/*
	记录设备的网络信息. 需要保持自身一个唯一的ID号.	
*/

(function(){
	/*
		以下几个组件, 安插至具体设备模型后, 设备模型就拥有了记录网络信息的能力.
		因此之后添加新设备时, 本身不需设计记录网络信息能力. 通过集成组件拥有.
		模型组件设定的变量名必须和视图组件中设定的元素名相同, 作为一一对应关系, 能够设置, 取回具体值.
	*/
	//这个对象维护了路由器某个端口的信息.
	var PortInfoModel= function(ip, mask){
		this.ip= ip|| '';
		this.mask= mask|| '';
	};

	//这个对象维护了路由器路由表项的信息. 路由表由多个路由表项组成. 不单独表示.
	var RouteTableInfoModel= function(ip, mask, nexthop){
		this.ip= ip|| '';
		this.mask= mask|| '';
		this.nexthop= nexthop|| '';
	};

	//维护了网段颜色的信息, 暂时不使用.
	var ColorInfoModel= function(color){
		this.color= color|| '';
	};

	var novelModel= {

		physicalLayer: function(){
			/*
				物理层将不集成到设备中, 物理层将集成到网线中.
				物理层可以选择物理层种类, 物理层的带宽, 传播延迟.
				在模型中, 物理层的作用是保存物理层的数据信息.
				数据信息通过视图中的物理层对象提供的接口获取.
				模型中不需分多个物理层对象, 因模型只是保存信息. 信息的数据结构不会改变.
			*/

			//物理层数据结构.
			var physicalLayerInfo= {
				"type": false,
				"bindWidth": false,
				"delay": false
			};

			this.setLayerInfo= function(info){
				if(info.type!== undefined){
					physicalLayerInfo.type= info.type;
				}
				if(info.bindWidth!== undefined){
					physicalLayerInfo.bindWidth= info.bindWidth;
				}
				if(info.delay!== undefined){
					physicalLayerInfo.delay= info.delay;
				}
			};

			this.getLayerInfo= function(){
				return physicalLayerInfo;
			};
		},

		networkLayer: function(){
			/*
				网络层将集成到设备中. 网络层目前将默认使用主流的IPv4协议.(IPv6协议可以考虑后期加入)
				网络层对于不同的设备将由不同的数据结构存储, 可分为主机设备, 路由设备两种.
				在模型中, 网络层对象的作用是存储一个对象的信息.
			*/
			var hostIPv4NetworkLayer= function(){
				/*
					网卡的数据结构
					var hostIPv4NetworkLayerInfo= {
						"name": undefined, //网段名称
						"ipAddress": undefined,
						"maskAddress": undefined,
						"targetRouteAddress": undefined
					};
				*/

				var hostIPv4NetworkLayerInfoContainer= [];

				this.setLayerInfo= function(info){
					hostIPv4NetworkLayerInfoContainer= []; //先清空容器. 因为有可能发生删除网卡.
					for(var i= 0; i< info.length; i++){
						var data= {};
						data.name= info[i].name!== undefined? info[i].name: false;
						data.ipAddress= info[i].ipAddress!== undefined? info[i].ipAddress: false;
						data.maskAddress= info[i].maskAddress!== undefined? info[i].maskAddress: false;
						data.targetRouteAddress= info[i].targetRouteAddress!== undefined? info[i].targetRouteAddress: false;
						hostIPv4NetworkLayerInfoContainer.push(data);
					}
				};

				this.getLayerInfo= function(){
					return hostIPv4NetworkLayerInfoContainer;
				};
			};

			var routeIPv4NetworkLayer= function(){
				/*
					网卡的数据结构.
					var routeIPv4NetworkLayerInfo= [{
						"name": false, //网卡名称
						"ipAddress": false,
						"maskAddress": false,
						"routeTable": [{ 网卡对应的路由表
	                            "targetRouteAddress": "", 目标路由地址
	                            "maskAddress": "", 子网掩码
	                            "nextSkip": "" 下一跳地址
	                        }, ...]
					}, ...];
				*/

				var routeIPv4NetworkLayerInfoContainer= [];

				this.setLayerInfo= function(info){
					for(var i= 0; i< info.length; i++){
						var data= {};
						data.name= info[i].name!== undefined? info[i].name: false;
						data.ipAddress= info[i].ipAddress!== undefined? info[i].ipAddress: false;
						data.maskAddress= info[i].maskAddress!== undefined? info[i].maskAddress: false;
					}
				};

				this.getLayerInfo= function(){
					return routeIPv4NetworkLayerInfoContainer;
				};
			};


		},	
		Segement: function(){
			var typeDict= {
				"cable": CreateCableSegement
			};
			var cableSegement= function(){
				var ID= undefined;
				var type= "cable";

				this.getID= function(){
					return ID;
				};
				this.setID= function(ID){
					ID= ID;
				};
				this.getType= function(){
					return type;
				};
			};
			this.CreateCableSegement= function(){
				return new cableSegement();
			};
			this.CreateViewByType= function(type){
			    var initFunction= typeDict[type]; //获取对应的构造函数.
			    if(initFunction){
			        return initFunction();
			    }
			    return false;
			};
		},

		Device: function(){
			var ID= undefined; //唯一的ID号, 唯一的标示. 字符串类型.
			var type= '设备';
			var networkLayer= {
				"physicalLayer": false,
				"networkLayer": false
			};

			this.setID= function(id){
				/*
					该函数绑定对象唯一的ID.
				*/
				ID= id;
			};

			this.getID= function(){
				/*
					该函数返回对象唯一的ID.
				*/
				return ID;
			};

			this.getType= function(){
				return type;
			};

			this.compareID= function(id){
				if(ID=== id){
					return true;
				}else{
					return false;
				}
			};

			this.extendNetworkLayer= function(dict){
                for(layer in dict){
                    if(dict.hasOwnProperty(layer)){
                        networkLayer[layer]= dict[layer];
                    }
                }
            };

			this.getLayerInfo= function(){

			};

			this.setLayerInfo= function(info){

			};

			this.getModelInfo= function(){
				/*
					该函数返回设备模型所支持的网络信息组件.
					返回的数据结构为: 最外层数组(能够分别先后显示顺序), 数组元素为对象(能够区分是哪种组件),
					对象内的值为数组(所记录的具体网络信息集合), 数组内的元素为对象(记录了具体的网络信).
				*/
				return [
					{
						portInfo: portArray 
					},
					{
						routeTableInfo: routeTableArray
					}
				];
			};
		},
	};
	window.novelModel= novelModel;
})();