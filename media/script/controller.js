/*
	控制器功能放置在该js文件内.
	包含处理用户输入工作(鼠标, 键盘事件).
	创建, 管理, 删除具体设备工作.
	控制器很多时候需要作为一个连接者, 他存有最多的信息, 连接了view和model.
	view和model希望能够互相通信时, 或自身能力无法完成任务时, 需要使用控制器.
*/

(function(){
	var util= window.novelUtil;
	var $labContainer= undefined; //实验平台的具体容器. 必须是jquery对象. 今后的设备将添加至该容器.
	var IDArray= []; //这个数组存放了所有设备唯一的ID号, 当前有多少台设备, 数组就应该有多少个元素.
	var modelIDArray= []; 
	var modelArray= []; //这个数组存放了所有的已注册成功设备的模型.
	var viewArray= []; //这个数组存放了所有的已注册成功设备的视图.


	var InterfaceForView= function(){
		/*
			这个接口对象用于提供给设备视图. 使设备视图能够调用controller的某些功能.
		*/

		//使视图能够改变控制器对mousemove的事件.
		this.changeMouseMoveCallback= function(func){
			if($labContainer){		
				$labContainer.unbind("mousemove");
				$labContainer.mousemove(func);
			}
		};

		//使视图能够还原控制器对mousemove的事件.
		this.restoreMoveCallback= function(){
			if($labContainer){
				$labContainer.css('cursor', 'default');
				$labContainer.unbind("mousemove");
				$labContainer.mousemove(mouseMoveCallback);
			}
		};

		//使视图受到点击时, 能够通过控制器完成配置菜单的显示.
		this.deviceClickCallback= function(ID){
			/*
				设备视图收到了点击事件. 需要controller接管. 显示配置界面.
				配置界面需要根据设备模型具体生成.
				参数ID可以找到相应的设备模型.
				无返回值, 但是需要将配置结果写入设备模型.
			*/

			//先找到相应的设备模型.
			var model= undefined;
			for(var i= 0; i< modelArray.length; i++){
				if(modelArray[i].compareID(ID)){
					model= modelArray[i];
					break;
				}
			}
			if(model== undefined){ //没找到则出错, 退出.
				return false;
			}

			//再找到相应的设备视图.
			var view= undefined;
			for(var i= 0; i< viewArray.length; i++){
				if(viewArray[i].compareID(ID)){
					view= viewArray[i];
					break;
				}
			}
			if(view== undefined){
				return false;
			}

			var $config= $configHtmlHead.clone(); //复制一个副本.
			console.log($configHtmlHead);

			/*
				先从设备模型获取相应的网络信息, 网络信息放置于数组中, 使得信息有先后关系, 在前的则显示也在前.
				获取到网络信息后, 再去设备视图获取显示信息, 将两者结合, append到config中.
			*/
			var modelInfo= model.getModelInfo();
			var viewInfo= view.getViewInfo();

			//首先填充头部.
			for(var i= 0; i< $config.find("#headName").length; i++){
				$($config.find("#headName").get(i)).text(model.getType());
			}
			$config.find("#deviceName").val(view.getViewName());

			for(var i= 0; i< modelInfo.length; i++){
				var info= modelInfo[i];

				//读取对象的键值.
				for(key in info){
					if(viewInfo[key]== undefined){
						return false;
					}
					var modelValue= info[key]; //这里的modelValue还是一个数组.
					var viewValue= viewInfo[key]; //对应的设备视图.
					for(var j= 0; j< modelValue.length; j++){ //获取所有具体的网络信息.
						var mInfo= modelValue[j];
						var vInfo= viewValue.clone();					
						for(mKey in mInfo){ //每个网络信息都有自己的属性.
							vInfo.find("#"+ mKey).val(mInfo[mKey]); //生成的视图!!!
						}
						$config.append(vInfo); //添加至末尾.
					}
				}
			}
			$config.append($configHtmlFooter.clone()); //最后添加尾部
			$config.css('display', 'block');
			$(document.body).append($config);
		};
	};

	var mouseMoveCallback= function(e){
		return false;
	}

	var novelController= {
		createDevice: function(model, view){
			/*
				函数用于创建一个设备, 并将设备ID添加至ID号列表中(ID是设备存在的证据).
				再申请一个设备ID, 添加至设备ID列表中.
				创建成功返回true, 将设备注册至ID号列表, 并且放置于文档之中, 还需要帮设备视图添加事件.
				创建失败返回false, 不会进行ID号注册, 也不会添加设备至文档.
			*/

			if($labContainer== undefined){
				return false;
			}

			var ID= util.getID(IDArray);
			if(!util.registerID(ID, IDArray)){
				//注册出错. 返回false.
				return false;
			}

			//注册成功.
			model.setID(ID); //setID是model, view的必须接口, 用于存储唯一的ID号. 也是model与view间的唯一联系.
			view.setID(ID);

			var modelID= undefined;
			while(true){ //注册modelID, 如果出错将重复注册, 直到注册成功.
				modelID= util.getModelID(modelIDArray);
				if(util.registerModelID(modelID, modelIDArray)){
					break;
				}
			}
			model.setModelID(modelID);
			view.setViewName(modelID);

			var $htmlView= view.getHtmlView(); //getHtmlView是view的必须接口, 用于返回view的样式, 该样式将被append到容器中.
			if(!util.testjQuery($htmlView)){
				return false;
			}
			$labContainer.append($htmlView);

			/*
				绑定事件. 由于视图本身缺乏处理一些问题的能力, 需要通过控制器完成. 
				在这里, 控制器需要将暴露的接口传递给视图, 使得视图在必要时刻能够调用控制器提供的功能.
			*/
			view.bindEvent();

			//这里将接口对象直接传递给设备视图. 视图是否使用由视图具体需要实现哪些功能决定.
			if(view.registerControllerInterface){ //如果实现了该函数则传递.
				view.registerControllerInterface(new InterfaceForView());
			}

			modelArray.push(model);
			viewArray.push(view);
			return true;
		},
		bindContainer: function(obj){
			/*
				用于绑定具体显示容器. 容器必须是jQuery对象.
				绑定成功返回true, 失败返回false.
			*/
			if(util.testjQuery(obj)){
				$labContainer= obj;
				return true;
			}else{
				return false;
			}
		}
	};

	var $configHtmlHead= $("\
		<section class= 'novelConfig'>\
			<section>\
				<h4><span id= 'headName'></span>配置</h4>\
				<div class='form-group' style= 'margin-bottom: 5px;'>\
					<label for='deviceName' class='col-sm-2 control-label'>\
						<span id= 'headName'></span>名:\
					</label>\
					<div class='col-sm-10'>\
						<input type='text' class='form-control' id= 'deviceName'>\
					</div>\
					<div style= 'clear: both;'></div>\
				</div>\
				<section>\
					<button id= 'finishBtn' class= 'btn btn-primary'>填写完成</button>\
					<button id= 'closeBtn' class= 'btn btn-primary'>直接关闭</button>\
					<button id= 'deleteBtn' class= 'btn btn-primary'>删除设备</button>\
				</section>\
				<hr/>\
			</section>\
		</section>\
	");

	var $configHtmlFooter= $("\
		<section id= 'configButtom'>\
			<button id= 'finishBtn' class= 'btn btn-primary'>填写完成</button>\
			<button id= 'closeBtn' class= 'btn btn-primary'>直接关闭</button>\
			<button id= 'deleteBtn' class= 'btn btn-primary'>删除设备</button>\
		</section>\
	");

	window.novelController= novelController;
})();