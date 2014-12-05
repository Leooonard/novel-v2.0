

(function(){
	/*
		以下几个组件, 安插至具体设备视图后, 设备视图就拥有了显示网络信息的能力.
		因此之后添加新设备时, 本身不需设计显示网络信息能力. 通过集成组件拥有.
	*/

	//这个对象维护了路由器某个端口的视图.
	var $PortInfoView= $("\
		<section id= 'configAddress'>\
			<div class='form-group' style= 'margin-bottom: 5px;'>\
				<label for='ip' class='col-sm-3 control-label'>\
					IP地址:\
				</label>\
				<div class='col-sm-9'>\
					<input type='text' class='form-control' id= 'ip'>\
				</div>\
				<div style= 'clear: both;'></div>\
			</div>\
			<div class='form-group' style= 'margin-bottom: 5px;'>\
				<label for='mask' class='col-sm-3 control-label'>\
					子网掩码:\
				</label>\
				<div class='col-sm-9'>\
					<input type='text' class='form-control' id= 'mask'>\
				</div>\
				<div style= 'clear: both;'></div>\
			</div>\
		</section>\
	");

	//这个对象维护了路由表项的视图.
	var $RouteTableInfoView= $("\
		<section id= 'configRouteTable'>\
			<div class='form-group' style= 'margin-bottom: 5px;'>\
				<label for='ip' class='col-sm-3 control-label'>\
					IP地址:\
				</label>\
				<div class='col-sm-9'>\
					<input type='text' class='form-control' id= 'ip'>\
				</div>\
				<div style= 'clear: both;'></div>\
			</div>\
			<div class='form-group' style= 'margin-bottom: 5px;'>\
				<label for='mask' class='col-sm-3 control-label'>\
					子网掩码:\
				</label>\
				<div class='col-sm-9'>\
					<input type='text' class='form-control' id= 'mask'>\
				</div>\
				<div style= 'clear: both;'></div>\
			</div>\
			<div class='form-group' style= 'margin-bottom: 5px;'>\
				<label for='nexthop' class='col-sm-3 control-label'>\
					下一跳:\
				</label>\
				<div class='col-sm-9'>\
					<input type='text' class='form-control' id= 'nexthop'>\
				</div>\
				<div style= 'clear: both;'></div>\
			</div>\
			<button id= 'deleteRtr' class= 'btn btn-primary'>删除路由表项</button>\
		</section>\
	");

	//这个对象维护了网段信息的视图.  暂时不实现!!!
	var $ColorInfoView= $("\
		<section id= 'configSegement'>\
		</section>\
	");


	var novelView= {
		physicalLayer: function(){
			/*
				物理层将不集成到设备中, 物理层将集成到网线中.
				物理层可以选择物理层种类, 物理层的带宽, 传播延迟.
				在视图中, 物理层对象的作用是显示具体的html元素, 让用户选择.
				并且视图中的物理层需要提供一个接口, 让模型中的物理层进行调用, 获取最后的物理层属性.
				视图中需要存在多种物理层结构, 因不同种类的物理层结构, 其显示样式不同.
			*/

			//点对点结构的物理层.
			var CreateKnownTypePhysicalLayerHtmlView= function(name, bindWidth, delay){
				/*
					针对已经确定类型的物理层, 返回其jquery对象. 显示时, 使用p来显示物理层类型.
					函数接受名字, 返回一个jquery对象. 接受带宽, 默认为空. 接受延迟, 默认为空.
				*/
				var bindWidth= bindWidth|| "";
				var delay= delay|| "";
				return $("\
							<div class='form-group'>\
								<label for='physicalLayerType' class='col-sm-3 control-label'>\
									物理层类型:\
								</label>\
								<div class='col-sm-9'>\
									<p class='form-control' id= 'physicalLayerType'>"+ name+ "</p>\
								</div>\
							</div>\
							<div class='form-group'>\
								<label for='physicalLayerType' class='col-sm-3 control-label'>\
									物理层带宽:\
								</label>\
								<div class='col-sm-3'>\
									<input type= 'text' class='form-control' id= 'physicalLayerBindWidth' val= '"+ bindWidth+ "'/>\
								</div>\
								<label for='physicalLayerType' class='col-sm-3 control-label'>\
									物理层延迟:\
								</label>\
								<div class='col-sm-3'>\
									<input type= 'text' class='form-control' id= 'physicalLayerDelay' val= '"+ delay+ "'/>\
								</div>\
							</div>\
						");	
 			};
 			var physicalLayerDict= {
 				"p2pPhysicalLayer": "点对点结构物理层",
 				"busPhysicalLayer": "总线结构物理层"
 			};

 			/*
 				物理层数据结构.
	 			physicalLayerInfo= {
	 				"type": "",
	 				"bindWidth": "",
	 				"delay": ""
	 			};
			*/
 			//点对点结构的物理层.
			var p2pPhysicalLayer= function(){
				var name= "点对点结构物理层";
				var $htmlView= CreateKnownTypePhysicalLayerHtmlView(name);
				this.getPhysicalLayerInfo= function(){
					return {
						"type": "p2p",
						"bindWidth": $htmlView.find("#physicalLayerBindWidth").val().toString(),
						"delay": $htmlView.find("#physicalLayerDelay").val().toString()
					}
				};
			};
			//总线结构的物理层.
			var busPhysicalLayer= function(){
				var name= "总线结构物理层";
				var $htmlView= CreateKnownTypePhysicalLayerHtmlView(name);
				this.getPhysicalLayerInfo= function(){
					return {
						"type": "bus",
						"bindWidth": $htmlView.find("#physicalLayerBindWidth").val().toString(),
						"delay": $htmlView.find("#physicalLayerDelay").val().toString()
					}
				};
			};
			//未知结构的物理层类型, 需要用户手动去选择.
			var unknownPhysicalLayer= function(){
				var name= "未知结构物理层";
				var optionView= "";
				for(var key in physicalLayerDict){
					optionView+= "<option val= '"+ key+ "'>"+ physicalLayerDict[key]+ "</option>"
				}
				var $htmlView= $("\
					<div class='form-group'>\
						<label for='physicalLayerType' class='col-sm-3 control-label'>\
							物理层类型:\
						</label>\
						<div class='col-sm-9'>\
							<select class='form-control' id= 'physicalLayerType'>"+ optionView+ "</select>\
						</div>\
					</div>\
					<div class='form-group'>\
						<label for='physicalLayerType' class='col-sm-3 control-label'>\
							物理层带宽:\
						</label>\
						<div class='col-sm-3'>\
							<input type= 'text' class='form-control' id= 'physicalLayerBindWidth' val= '"+ bindWidth+ "'/>\
						</div>\
						<label for='physicalLayerType' class='col-sm-3 control-label'>\
							物理层延迟:\
						</label>\
						<div class='col-sm-3'>\
							<input type= 'text' class='form-control' id= 'physicalLayerDelay' val= '"+ delay+ "'/>\
						</div>\
					</div>\
				");	
				this.getPhysicalLayerInfo= function(){
					return {
						"type": $htmlView.find("physicalLayerType").val().toString(),
						"bindWidth": $htmlView.find("#physicalLayerBindWidth").val().toString(),
						"delay": $htmlView.find("#physicalLayerDelay").val().toString()
					}
				};
			};
		},
		NetworkLayer: function(){
			/*
				网络层将集成到设备中. 网络层目前将默认使用主流的IPv4协议.(IPv6协议可以考虑后期加入)
				网络层对于不同的设备将显示不同的元素, 可分为主机设备, 路由设备两种.
				在视图中, 网络层对象的作用是显示一个具体的html元素, 让用户选择.
				视图需要实现一个接口, 导出html元素中的数据, 返还至模型.
			*/

			var hostIPv4NetworkLayer= function(networkAdapterInfo){
				/*
					IPv4协议下的主机设备网络层.
					需要提供一个输入, 说明该主机网卡的情况, 包括网卡的数量(靠数组长度提供), 网卡连接的网段的名字, 网卡已存的信息.
					(每张网卡将对应一个IP, 子网掩码, 默认路由)

					networkAdapterInfo= [{
						"name": "", 网卡名字
						"ipAddress": "", 网卡对应的IP地址
						"maskAddress": "", 网卡对应的子网掩码
						"targetRouteAddress": "" 网卡对应的目标路由地址
					}, ...];
				*/
				var name= "IPv4主机网络层";
				var htmlView= "";
				var $htmlView= $("<div class= 'networkLayerWrapper'></div>");

				for(var i= 0; i< networkAdapterInfo.length; i++){
					var adapter= networkAdapterInfo[i];
					var name= adapter.name|| "";
					var ipAddress= adapter.ipAddress|| "";
					var maskAddress= adapter.maskAddress|| "";
					var targetRouteAddress= adapter.targetRouteAddress|| "";
					$htmlView.append();
					htmlView+= "\
						\
							<div class='form-group'>\
								<label for='netWorkLayerAdapter"+ name+ "' class='col-sm-3 control-label'>\
									网段名:\
								</label>\
								<div class='col-sm-9'>\
									<p class='form-control' id= 'netWorkLayerAdapter"+ name+ "'>"+ name+ "</p>\
								</div>\
							</div>\
							<div class='form-group'>\
								<label for='netWorkLayerAdapter"+ name+ "ipAddress"+ "' class='col-sm-3 control-label'>\
									IP地址:\
								</label>\
								<div class='col-sm-9'>\
									<input type= 'text' class='form-control' id= 'netWorkLayerAdapter"+ name
									+ "ipAddress"+ "' val= '"+ ipAddress+ "'/>
								</div>\
							</div>\
							<div class='form-group'>\
								<label for='netWorkLayerAdapter"+ name+ "maskAddress"+ "' class='col-sm-3 control-label'>\
									子网掩码:\
								</label>\
								<div class='col-sm-9'>\
									<input type= 'text' class='form-control' id= 'netWorkLayerAdapter"+ name
									+ "maskAddress"+ "' val= '"+ maskAddress+ "'/>
								</div>\
							</div>\
							<div class='form-group'>\
								<label for='netWorkLayerAdapter"+ name+ "targetRouteAddress"+ "' class='col-sm-3 control-label'>\
									目标路由:\
								</label>\
								<div class='col-sm-9'>\
									<input type= 'text' class='form-control' id= 'netWorkLayerAdapter"+ name
									+ "targetRouteAddress"+ "' val= '"+ targetRouteAddress+ "'/>
								</div>\
							</div>\
						</div>\
					";
				}

				var $htmlView= $(htmlView);

				this.getNetworkLayerInfo= function(){
					var info= [];
					var $wrapperContainer= $htmlView.find(".networkLayerWrapper")
					for(var i= 0; i< $wrapperContainer.length; i++){
						var $wrapper= $($wrapperContainer.get(i));
						info.push({
							"name": $($wrapper.find(".form-control").get(0)).val(),
							"ipAddress": $($wrapper.find(".form-control").get(1)).val(),
							"maskAddress": $($wrapper.find(".form-control").get(2)).val(),
							"targetRouteAddress": $($wrapper.find(".form-control").get(3)).val()
						});
					}
					return info;
				};
			};

			var routeIPv4NetworkLayer= function(networkAdapterInfo){
				/*
					IPv4协议下的路由设备网络层.
					需要提供一个输入, 说明该路由网卡的情况, 包括网卡的数量(靠数组长度提供), 网卡连接的网段的名字, 网卡已存的信息.
					(每张网卡将对应一个IP, 子网掩码, 一个路由表)

					networkAdapterInfo= [{
						"name": "", 网卡名字
						"ipAddress": "", 网卡对应的IP地址
						"maskAddress": "", 网卡对应的子网掩码
						"routeTable": [{ 网卡对应的路由表
							"targetRouteAddress": "", 目标路由地址
							"maskAddress": "", 子网掩码
							"nextSkipAddress": "" 下一跳地址
						}, ...]
					}, ...];
				*/

				var name= "IPv4路由网络层"
				var htmlView= "";

				for(var i= 0; i< networkAdapterInfo.length; i++){
					var adapter= networkAdapterInfo[i];
				}
			};
		},
		route: function(){
			var ID= undefined; //唯一的标示符.
			var viewName= undefined; //表示设备的名字.
			this.setID= function(id){
				/*
					该函数绑定对象唯一的ID.
				*/
				ID= id;
			};
			this.getID= function(){
				/*
					该函数绑定对象唯一的ID.
				*/
				return ID;
			};
			this.setViewName= function(name){
				viewName= name;
			};
			this.getViewName= function(){
				return viewName;
			};
			this.getHtmlView= function(){
				/*
					返回对象的html jQuery对象, 将被显示在容器中.
				*/
				return $htmlView;
			};
			this.setStyle= function(styleDict){
				/*
					为对象的html对象设置样式.
					参数为字典, 键为设置的具体样式, 值为样式的值.
				*/
				for(item in styleDict){ //依次为每个设定项赋值.
					try{
						$htmlView.css(item, styleDict[item]);
					}catch(e){
						continue;
					}	
				}
			};
			this.getViewInfo= function(){
				/*
					该函数将返回设备视图支持的组件视图. 以对象形式返回.
				*/
				return {
					portInfo: $PortInfoView,
					routeTableInfo: $RouteTableInfoView
				};
			};

			this.compareID= function(id){
				if(ID== id){
					return true;
				}else{
					return false;
				}
			}
			
			var ControllerInterface= undefined;
			this.registerControllerInterface= function(interface){
				ControllerInterface= interface;
			};

			this.bindEvent= function(){
				/*
					该函数用于为设备视图绑定事件.
					绑定事件为: $novelRouteView的mousedown, click, mouseup, 以及
					$wrapper的mousedown, click, mouseup.

					主要提供的操作时, 放大缩小功能, 通过最外层的$novelRouetView提供.
					拖动功能, 通过里层的$wrapper提供.
					点击功能, 分为左键单击, 右键单击功能, 通过里层的$wrapper提供.
				*/
				var novelRouteViewMouseDown= function(e, mouseDownPointer){	
					/*
						该函数用于处理鼠标按键事件(当按在周围一圈黑色时). 需要注册mousemove事件.
						由于鼠标容易划出至容器区域, 因此需要改变容器区域的mousemove事件以及鼠标图形.
					*/		
					var event= e|| window.event;
					var $this= $(this); //$this指设备对象.
					if(event.which== 1){
						mouseDownPointer.x= event.pageX;
						mouseDownPointer.y= event.pageY;

						//鼠标按下后, 注册mousemove. 平时不注册该事件.
						$this.mousemove(function(e){
							var event= e|| window.event;
							//使用call函数, 改变函数this指向.
							novelRouteViewMouseMove.call($this, e, mouseDownPointer);
							return false;
						});

						$this.find(".wrapper").mousemove(function(e){
							var event= e|| window.event;
							var $that= $(this);
							$that.css('cursor', 'Crosshair');
							novelRouteViewMouseMove.call($this, e, mouseDownPointer);
							return false;
						});

						//鼠标按下后, 还要调用controller的注册回调对象.
						ControllerInterface.changeMouseMoveCallback(function(e){
							var event= e|| window.event;
							var $that= $(this);
							$that.css('cursor', 'Crosshair');
							//函数将在controller那里的代码执行, 所以本身的this指向是错误的, 需要用call来改变this指向.
							//同时注意, 本身函数里的this指向被赋予了$that, 而不是$this!
							novelRouteViewMouseMove.call($this, e, mouseDownPointer);
							return false;
						});
						return false;
					}
				};				
				var novelRouteViewMouseMove= function(e, mouseDownPointer){
					/*
						鼠标按在黑色一圈上移动时的处理函数. 
						功能为相应的改变设备的大小.
					*/
					var event= e|| window.event;
					var $this= $(this);
					var nowPointer= {
						x: event.pageX,
						y: event.pageY
					};
					var width= parseInt($this.css('width'));
					var height= parseInt($this.css('height'));
					$this.css('width', (width+ nowPointer.x- mouseDownPointer.x)+ 'px');
					$this.css('height', (height+ nowPointer.y- mouseDownPointer.y)+ 'px');
					mouseDownPointer.x= nowPointer.x;
					mouseDownPointer.y= nowPointer.y;
					return false;
				};
				var wrapperMouseDown= function(e, mouseDownPointer){
					/*
						鼠标按在图形上上时的处理函数. 
						功能为移动相应的设备, 需要为外层已经自身设定相应的mousemove处理函数.
					*/
					var event= e|| window.event;
					var $this= $(this);
					if(event.which== 1){
						mouseDownPointer.x= event.pageX;
						mouseDownPointer.y= event.pageY;

						$this.mousemove(function(e){
							var event= e|| window.event;
							wrapperMouseMove.call($this, e, mouseDownPointer);
							return false;
						});

						$this.parent().mousemove(function(e){
							var event= e|| window.event;
							var $that= $(this);
							$that.css('cursor', 'default');
							wrapperMouseMove.call($this, e, mouseDownPointer);
							return false;
						});

						ControllerInterface.changeMouseMoveCallback(function(e){
							var event= e|| window.event;
							var $that= $(this);
							$that.css('cursor', 'default');
							wrapperMouseMove.call($this, e, mouseDownPointer);
							return false;
						});
						return false;
					}else if(event.which== 3){
						//右键点击事件. 应该要创造链接. 需要通知控制器.
					}
				};
				var wrapperMouseMove= function(e, mouseDownPointer){
					var event= e|| window.event;
					var $this= $(this);
					var $parent= $this.parent();
					var nowPointer= {
						x: event.pageX,
						y: event.pageY
					};
					var left= parseInt($parent.css('left'));
					var top= parseInt($parent.css('top'));

					//首先先要解除对象的click事件绑定, 因为对象移动了.
					$this.unbind("click");

					$parent.css('left', (left+ nowPointer.x- mouseDownPointer.x)+ 'px');
					$parent.css('top', (top+ nowPointer.y- mouseDownPointer.y)+ 'px');
					mouseDownPointer.x= nowPointer.x;
					mouseDownPointer.y= nowPointer.y;
				};
				var wrapperClick= function(e){
					var event= e|| window.event;
					var $this= $(this);
					$this.unbind('mousemove');
					$novelRouteView.unbind("mousemove");
					$novelRouteView.css("cursor", "Crosshair");
					ControllerInterface.restoreMoveCallback();
					if(event.which== 1){
						//是左键点击事件应该通知controller. 由controller接管, 调出配置div.
						ControllerInterface.deviceClickCallback(ID);
					}
					return false;
				};

				//使用object使其成为可变对象, 通过传入函数即可改变自身.
				var mouseDownPointer= { 
					x: 0,
					y: 0
				};

				var $novelRouteView= $htmlView;
				$novelRouteView.mousedown(function(e){
					var $this= $(this);
					//使用call函数, 改变函数内的this指向. 使操作能够正常.
					novelRouteViewMouseDown.call($this, e, mouseDownPointer);
					return false;
				});
				$novelRouteView.mouseup(function(e){
					var $this= $(this);
					$this.unbind('mousemove');
					$wrapper.unbind("mousemove");
					$wrapper.css("cursor", "default");
					ControllerInterface.restoreMoveCallback();
					return false;
				});
				$novelRouteView.click(function(e){
					var $this= $(this);
					$this.unbind('mousemove');
					$wrapper.unbind("mousemove");
					$wrapper.css("cursor", "default");
					ControllerInterface.restoreMoveCallback();
					return false;
				});

				var $wrapper= $htmlView.find(".wrapper");
				$wrapper.mousedown(function(e){
					var $this= $(this);
					//这里先解绑click, 再重新绑. 因为移动后会解绑click, 所以需要重新绑定.
					//先解绑是因为上次操作可能不触发mousemove, 防止注册多个重复click事件.
					$this.unbind("click");
					$this.click(wrapperClick);
					wrapperMouseDown.call($this, e, mouseDownPointer);
					return false;
				});
				$wrapper.mouseup(function(e){
					var $this= $(this);
					$this.unbind('mousemove');
					$novelRouteView.unbind("mousemove");
					$novelRouteView.css("cursor", "Crosshair");
					ControllerInterface.restoreMoveCallback();
					return false;
				});
			};


			var $htmlView= $("\
				<div class= 'novelRouteView'>"+
					"<div class= 'wrapper'>"+
						"<div class= 'routeView'>"+
							"<img src='/media/image/route.jpg' class= 'routeImg'>"+
							"<p>设备</p>"+
						"</div>"+
						"<div class= 'infoView'>"+
							"<section class= 'routeDevDiv' style= 'display: none;''>"+
								"<p class= 'devID'>设备号: <span>Null</span></p>"+
								"<hr/>"+
								"<section class= 'devSection'>"+
									"<p class= 'segNumber'>网段<span>Null</span></p>"+
									"<p class= 'devIP'>设备IP: <span>Null</span></p>"+
									"<p class= 'devMask'>设备子网掩码: <span>Null</span></p>"+
									"<hr/>"+
								"</section>"+
								"<section class= 'devRtr'>"+
									"<p class= 'devIP'>目的IP地址: <span>Null</span></p>"+
									"<p class= 'devMask'>子网掩码: <span>Null</span></p>"+
									"<p class= 'devNexthop'>下一跳: <span>Null</span></p>"+
									"<hr/>"+
								"</section>"+
							"</section>"+
						"</div>"+
					"</div>"+
				"</div>"
			); //jQuery对象.
		}
	};
	window.novelView= novelView;
})();