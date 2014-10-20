

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
				}
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
					$parent.css('left', (left+ nowPointer.x- mouseDownPointer.x)+ 'px');
					$parent.css('top', (top+ nowPointer.y- mouseDownPointer.y)+ 'px');
					mouseDownPointer.x= nowPointer.x;
					mouseDownPointer.y= nowPointer.y;
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
				$wrapper.click(function(e){
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