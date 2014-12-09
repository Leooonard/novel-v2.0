

(function(){
     //这个对象维护了网段信息的视图.  暂时不实现!!!
     var $ColorInfoView= $("\
          <section id= 'configSegement'>\
          </section>\
     ");

     var novelView= {
          PhysicalLayer: function(){
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
                         <div class='panel-group' id='physicalLayer' role='tablist' aria-multiselectable='true'>\
                             <div class='panel panel-primary'>\
                             <div class='panel-heading pointer' role='tab' id='physicalLayerHeader' data-toggle='collapse' data-target='#physicalLayerBody' aria-expanded='true' aria-controls='physicalLayerBody' data-buttontoggle= 'toggle' data-before= '展开物理层︾' data-after= '闭合物理层︽'></div>\
                             <div id='physicalLayerBody' class='panel-collapse collapse' role='tabpanel' aria-labelledby='header'>\
                                 <div class='panel-body'>\
                                        <div class='form-group'>\
                                             <label for='physicalLayerType' class='col-sm-3 control-label'>\
                                                  物理层类型:\
                                             </label>\
                                             <div class='col-sm-9'>\
                                                  <p class='form-control' id= 'physicalLayerType'>"+ name+ "</p>\
                                             </div>\
                                        </div>\
                                        <div class='form-group'>\
                                             <label for='physicalLayerType' class='col-sm-2 control-label'>\
                                                  物理层带宽:\
                                             </label>\
                                             <div class='col-sm-4'>\
                                                  <input type= 'text' class='form-control' id= 'physicalLayerBindWidth' val= '"+ bindWidth+ "'/>\
                                             </div>\
                                             <label for='physicalLayerType' class='col-sm-2 control-label'>\
                                                  物理层延迟:\
                                             </label>\
                                             <div class='col-sm-4'>\
                                                  <input type= 'text' class='form-control' id= 'physicalLayerDelay' val= '"+ delay+ "'/>\
                                             </div>\
                                        </div>\
                                   </div>\
                             </div>\
                         </div>");
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
                    this.getHtmlView= function(){
                         return $htmlView;
                    };
               };
               this.createP2PPhysicalLayer= function(){
                    return new p2pPhysicalLayer();
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
                    this.getHtmlView= function(){
                         return $htmlView;
                    };
               };
               this.createBusPhysicalLayer= function(){
                    return busPhysicalLayer();
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
                    this.getHtmlView= function(){
                         return $htmlView;
                    };
               };
               this.createUnknownPhysicalLayer= function(){
                    return new unknownPhysicalLayer();
               };
          },
          NetworkLayer: function(){
               /*
                    网络层将集成到设备中. 网络层目前将默认使用主流的IPv4协议.(IPv6协议可以考虑后期加入)
                    网络层对于不同的设备将显示不同的元素, 可分为主机设备, 路由设备两种.
                    在视图中, 网络层对象的作用是显示一个具体的html元素, 让用户选择.
                    视图需要实现一个接口, 导出html元素中的数据, 返还至模型.
                    视图需要实现一个接口, 返回html元素, 以供显示.
               */

               var CreateNetworkLayerView= function(networkAdapterInfo, isHost){
                    /*
                         返回一个网络层html元素的jquery对象.
                         输入是网络层的信息. 输出是jquery视图对象.
                         isHost判断是否是主机设备的网络层, 默认是主机设备.

                         主机设备的数据结构
                         networkAdapterInfo= [{
                              "name": "", 网卡名字
                              "ipAddress": "", 网卡对应的IP地址
                              "maskAddress": "", 网卡对应的子网掩码
                              "targetRouteAddress": "" 网卡对应的目标路由地址
                         }, ...];

                         路由设备的数据结构
                         networkAdapterInfo= [{
                              "name": "", 网卡名字
                              "ipAddress": "", 网卡对应的IP地址
                              "maskAddress": "", 网卡对应的子网掩码
                              "routeTable": [{ 网卡对应的路由表
                                   "targetRouteAddress": "", 路由表项对应的IP地址
                                   "maskAddress": "", 路由表项对应的子网掩码
                                   "nextSkip": "", 路由表项对应的下一跳地址
                              }, ...]
                         }, ...];
                    */

                    //网络层tablist字符串
                    var networkLayer= (
                         "<div class='panel-group' id='networkLayer' role='tablist' aria-multiselectable='true'>"+
                             "<div class='panel panel-primary'>"+
                                  "<div class='panel-heading pointer' role='tab' id='networkLayerHeader' data-toggle='collapse' data-target='#networkLayerBody' aria-expanded='true' aria-controls='networkLayerBody' data-buttontoggle= 'toggle' data-before= '展开网络层︾' data-after= '闭合网络层︽'></div>"+
                                  "<div id='networkLayerBody' class='panel-collapse collapse' role='tabpanel' aria-labelledby='header'>"+
                                      "<div class='panel-body'>"+     
                                      "</div>"+
                                  "</div>"+
                              "</div>"+
                         "</div>");
                    var $networkLayer= $(networkLayer);

                    //具体网卡字符串
                    var routeNetworkAdapter= (
                         "<div id= 'networkAdapter' class= 'panel panel-info'>"+
                             "<div class= 'panel-heading'>"+
                                 "网卡名: <span id= 'networkAdapterName'>#*networkAdapterName#*</span>"+
                             "</div>"+
                             "<div class='form-inline panel-body'>"+
                                 "<div class='form-group col-md-6'>"+
                                       "<label for='networkAdapterIPv4Address'>IP地址:</label>"+
                                       "<input type='email' class='form-control' id='networkAdapterIPv4Address' placeholder='IP地址(如192.168.0.1)' val= '#*networkAdapterIPv4Address#*'>"+
                                 "</div>"+
                                 "<div class='form-group col-md-6'>"+
                                       "<label for= 'networkAdapterMaskAddress'>子网掩码:</label>"+
                                       "<input class='form-control' type='text' id= 'networkAdapterMaskAddress' placeholder='子网掩码(如255.255.255.0)' val= '#*networkAdapterMaskAddress#*'>"+
                                 "</div>"+
                                 "<div class= 'form-group col-md-6'></div>"+
                                 "<div style= 'clear: both;'></div>"+
                                 "<span id= 'expandRouteTabel' class= 'expand' data-toggle= 'collapse' data-target= '#networkAdapterRouteTable' aria-expanded='true' aria-controls='networkAdapterRouteTable' data-buttontoggle= 'toggle' data-before= '展开路由表︾' data-after= '闭合路由表︽'></span>"+
                                 "<div id= 'networkAdapterRouteTable' class= 'panel-collapse collapse'>"+
                                       "<div class= 'panel panel-warning'>"+
                                             "<div class= 'panel-heading'>"+
                                                   "路由表"+
                                                   "<button id= 'addRouteTableRow' class= 'btn btn-warning btn-sm floatRight marginRight20'>"+
                                                         "添加路由表项"+
                                                   "</button>"+
                                                   "<div style= 'clear: both;'></div>"+
                                             "</div>"+
                                             "<div class='form-inline panel-body'>"+
                                                   "<ul class= 'list-group'>"+
                                                   "</ul>"+
                                             "</div>"+
                                       "</div>"+
                                 "</div>"+
                             "</div>"+
                         "</div>");
                    var $routeNetworkAdapter= $(routeNetworkAdapter);

                    var hostNetworkAdapter= (
                         "<div id= 'networkAdapter' class= 'panel panel-info'>"+
                             "<div class= 'panel-heading'>"+
                                 "网卡名: <span id= 'networkAdapterName'>#*networkAdapterName#*</span>"+
                             "</div>"+
                             "<div class='form-inline panel-body'>"+
                                 "<div class='form-group col-md-4'>"+
                                       "<label for='networkAdapterIPv4Address'>IP地址:</label>"+
                                       "<input type='email' class='form-control' id='networkAdapterIPv4Address' placeholder='IP地址(如192.168.0.1)' val= '#*networkAdapterIPv4Address#*'>"+
                                 "</div>"+
                                 "<div class='form-group col-md-4'>"+
                                       "<label for= 'networkAdapterMaskAddress'>子网掩码:</label>"+
                                       "<input class='form-control' type='text' id= 'networkAdapterMaskAddress' placeholder='子网掩码(如255.255.255.0)' val= '#*networkAdapterMaskAddress#*'>"+
                                 "</div>"+
                                 "<div class= 'form-group col-md-4'>"+
                                        "<label for= 'networkAdapterTargetRouteAddress'>目标路由:</label>"+
                                       "<input class='form-control' type='text' id= 'networkAdapterTargetRouteAddress' placeholder='目标路由(如192.168.0.0)' val= '#*networkAdapterTargetRouteAddress#*'>"+
                                 "</div>"+
                                 "<div style= 'clear: both;'></div>"+
                             "</div>"+
                         "</div>");
                    var $hostNetworkAdapter= $(hostNetworkAdapter);

                    var NetworkAdapterAppend= function(networkLayer, networkAdapter){
                         /*
                              将具体网卡添加到网络层tablist内.
                         */
                         networkLayer.find("#networkLayerBody .panel-body").append(networkAdapter);
                         return networkLayer;
                    };

                    //具体路由表项字符串
                    var routeTableRow= (
                         "<li class= 'list-group-item' style= 'height: auto'>"+
                             "<div class='form-group col-md-3'>"+
                                 "<label for='routeTableRowTargetRouteAddress'>目的地址:</label></br>"+
                                 "<input type='email' class='form-control' id='routeTableRowTargetRouteAddress' placeholder='目的地址(如192.168.0.1)' val= '#*routeTableRowIPv4Address#*'>"+
                             "</div>"+
                             "<div class='form-group col-md-3'>"+
                                 "<label for= 'routeTableRowMaskAddress'>子网掩码:</label></br>"+
                                 "<input id= 'routeTableRowMaskAddress' class='form-control' type='text' placeholder='子网掩码(如255.255.255.0)' val= '#*routeTableRowMaskAddress#*'>"+
                             "</div>"+
                             "<div class='form-group col-md-3'>"+
                                 "<label for='routeTableRowNextSkip'>下一跳:</label></br>"+
                                 "<input type='password' class='form-control' id='routeTableRowNextSkip' placeholder='下一跳(如192.168.0.0)' val= '#*routeTableRowNextSkip#*'>"+
                             "</div>"+
                             "<div class= 'form-group col-md-3'>"+
                                 "<button id= 'deleteRouteTableRow' class= 'btn btn-info form-control'>删除路由表项</button>"+
                             "</div>"+
                             "<div style= 'clear: both;'></div>"+
                         "</li>");
                    var $routeTableRow= $(routeTableRow);

                    var RouteTableRowAppend= function(networkAdapter, routeTableRow){
                         /*
                              将具体路由表项添加到路由表内.
                         */
                         networkAdapter.find("#networkAdapterRouteTable .list-group").append(routeTableRow);
                         return networkAdapter;
                    };

                    var DeleteRouteTableRow= function(e){
                         /*
                              点击事件函数.
                              点击删除路由表项按钮后调用.
                         */
                         var $this= $(this);
                         var event= e|| window.event;

                         //删除该行.
                         $this.closest(".list-group-item").remove();
                         return false;
                    };

                    var AddRouteTableRow= function(e){
                         var $this= $(this);
                         var event= e|| window.event;

                         var $rowList= $this.closest(".panel").find(".list-group"); //先获取存放路由表项的ul.

                         //先生成一个新的路由表项li.
                         var row= routeTableRow;
                         row= row.replace(/#*routeTableRowTargetRouteAddress#*/g, "");
                         row= row.replace(/#*routeTableRowMaskAddress#*/g, "");
                         row= row.replace(/#*routeTableRowNextSkip#*/g, "");

                         $rowList.append($(row)); //添加到ul最后.
                         return false;
                    };

                    var RegisterEvent= function(layer){
                         layer.delegate("#addRouteTableRow", "click", AddRouteTableRow);
                         layer.delegate("#deleteRouteTableRow", "click", DeleteRouteTableRow);
                    };

                    //如果传入的信息为空, 则返回默认的视图.
                    if(!networkAdapterInfo){
                         if(isHost){
                              var adapterView= hostNetworkAdapter;
                              adapterView= adapterView.replace(/#\*networkAdapterName#\*/g, "");
                              adapterView= adapterView.replace(/#\*networkAdapterIPv4Address#\*/g, "");
                              adapterView= adapterView.replace(/#\*networkAdapterMaskAddress#\*/g, "");
                              adapterView= adapterView.replace(/#\*networkAdapterTargetRouteAddress#\*/g, "");
                              NetworkAdapterAppend($networkLayer, $(adapterView));
                         }else{
                              var adapterView= routeNetworkAdapter;
                              adapterView= adapterView.replace(/#\*networkAdapterName#\*/g, "");
                              adapterView= adapterView.replace(/#\*networkAdapterIPv4Address#\*/g, "");
                              adapterView= adapterView.replace(/#\*networkAdapterMaskAddress#\*/g, "");
                              var $adapterView= $(adapterView);
                              var row= routeTableRow;
                              row= row.replace(/#\*routeTableRowTargetRouteAddress#\*/g, "");
                              row= row.replace(/#\*routeTableRowMaskAddress#\*/g, "");
                              row= row.replace(/#\*routeTableRowNextSkip#\*/g, "");
                              RouteTableRowAppend($adapterView, $(row));
                              NetworkAdapterAppend($networkLayer, $adapterView);
                              RegisterEvent($networkLayer);
                         }
                         return $networkLayer;
                    }

                    if(isHost){ //是主机设备的网络层.   
                         for(var i= 0; i< networkAdapterInfo.length; i++){
                              var adapter= networkAdapterInfo[i];
                              var adapterView= hostNetworkAdapter;

                              //获取输入中的值, 没有则为空.
                              var name= (adapter.name|| "").replace(/"|'/g, "");
                              var ipAddress= (adapter.ipAddress|| "").replace(/"|'/g, "");
                              var maskAddress= (adapter.maskAddress|| "").replace(/"|'/g, "");
                              var targetRouteAddress= (adapter.targetRouteAddress|| "").replace(/"|'/g, "");

                              //将输入中的值替换模板中的占位符.
                              adapterView= adapterView.replace(/#\*networkAdapterName#\*/g, name);
                              adapterView= adapterView.replace(/#\*networkAdapterIPv4Address#\*/g, ipAddress);
                              adapterView= adapterView.replace(/#\*networkAdapterMaskAddress#\*/g, maskAddress);
                              adapterView= adapterView.replace(/#\*networkAdapterTargetRouteAddress#\*/g, targetRouteAddress);
                              NetworkAdapterAppend($networkLayer, $(adapterView));
                         }
                         return $networkLayer;
                    }else{ //是路由设备的网络层.
                         for(var i= 0; i< networkAdapterInfo.length; i++){
                              var adapter= networkAdapterInfo[i];
                              var adapterView= routeNetworkAdapter;
                              var name= (adapter.name|| "").replace(/"|'/g, "");
                              var ipAddress= (adapter.ipAddress|| "").replace(/"|'/g, "");
                              var maskAddress= (adapter.maskAddress|| "").replace(/"|'/g, "");
                              adapterView= adapterView.replace(/#\*networkAdapterName#\*/g, name);
                              adapterView= adapterView.replace(/#\*networkAdapterIPv4Address#\*/g, ipAddress);
                              adapterView= adapterView.replace(/#\*networkAdapterMaskAddress#\*/g, maskAddress);
                              var $adapterView= $(adapterView);
                              var routeTable= (adapter.routeTable|| []);
                              for(var j= 0; j< routeTable.length; j++){
                                   var rtargetRouteAddress= (routeTable.targetRouteAddress|| "").replace(/"|'/g, "");
                                   var rmaskAddress= (routeTable.maskAddress|| "").replace(/"|'/g, "");
                                   var rnextSkip= (routeTable.nextSkip|| "").replace(/"|'/g, "");
                                   var row= routeTableRow;
                                   row= row.replace(/#\*routeTableRowTargetRouteAddress#\*/g, rtargetRouteAddress);
                                   row= row.replace(/#\*routeTableRowMaskAddress#\*/g, rmaskAddress);
                                   row= row.replace(/#\*routeTableRowNextSkip#\*/g, rnextSkip);
                                   RouteTableRowAppend($adapterView, $(row));
                              }
                              NetworkAdapterAppend($networkLayer, $adapterView);
                         }
                         RegisterEvent($networkLayer);
                         return $networkLayer;
                    }
               };

               var dynamicIPv4NetworkLayer= function(){
                    /*
                         IPv4协议下的动态路由网络层.
                         暂时空置.
                    */

                    var name= "IPv4动态路由网络层";
               };
               this.createDynamicIPv4NetworkLayer= function(){
                    return new dynamicIPv4NetworkLayer();
               };

               var hostIPv4NetworkLayer= function(networkAdapterInfo){
                    /*
                         IPv4协议下的主机设备网络层.
                         需要提供一个输入, 说明该主机网卡的情况, 包括网卡的数量(靠数组长度提供), 网卡连接的网段的名字, 网卡已存的信息.
                         (每张网卡将对应一个IP, 子网掩码, 默认路由)

                         主机设备的数据结构
                         networkAdapterInfo= [{
                              "name": "", 网卡名字
                              "ipAddress": "", 网卡对应的IP地址
                              "maskAddress": "", 网卡对应的子网掩码
                              "targetRouteAddress": "" 网卡对应的目标路由地址
                         }, ...];
                    */
                    var name= "IPv4主机网络层";
                    var $htmlView= CreateNetworkLayerView(networkAdapterInfo, true);

                    this.getNetworkLayerInfo= function(){
                         var info= [];
                         var $adapterList= $htmlView.find("#networkAdapter")
                         for(var i= 0; i< $adapterList.length; i++){
                              var $adaper= $($adapterList.get(i));
                              info.push({
                                   "name": $adapter.find("#networkAdapterName").val(),
                                   "ipAddress": $adapter.find("#networkAdapterIPv4Address").val(),
                                   "maskAddress": $adapter.find("#networkAdapterMaskAddress").val(),
                                   "targetRouteAddress": $adapter.find("#networkAdapterTargetRouteAddress").val()
                              });
                         }
                         return info;
                    };

                    this.getHtmlView= function(){
                         return $htmlView;
                    };
               };
               this.createHostIPv4NetworkLayer= function(networkAdapterInfo){
                    return new hostIPv4NetworkLayer(networkAdapterInfo);
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
                                   "nextSkip": "" 下一跳地址
                              }, ...]
                         }, ...];
                    */

                    var name= "IPv4路由网络层"
                    var $htmlView= CreateNetworkLayerView(networkAdapterInfo, false);

                    this.getNetworkLayerInfo= function(){
                         var info= [];
                         var $adapterList= $htmlView.find("#networkAdapter")
                         for(var i= 0; i< $adapterList.length; i++){
                              var $adaper= $($adapterList.get(i));
                              var name= $adapter.find("#networkAdapterName").val();
                              var ipAddress= $adapter.find("#networkAdapterIPv4Address").val();
                              var maskAddress= $adapter.find("#networkAdapterMaskAddress").val();
                              var $rowList= $adapter.find("#networkAdapterRouteTable .list-group li");
                              var routeTable= [];
                              for(var j= 0; j< $rowList.length; j++){
                                   var $row= $($rowList.get(j));
                                   var rtargetRouteAddress= $row.find("#routeTableRowTargetRouteAddress").val();
                                   var rmaskAddress= $row.find("#routeTableRowMaskAddress").val();
                                   var rnextSkip= $row.find("#routeTableRowNextSkip").val();
                                   routeTable.push({
                                        "targetRouteAddress": rtargetRouteAddress,
                                        "maskAddress": rmaskAddress,
                                        "nextSkip": rnextSkip
                                   });
                              }
                              info.push({
                                   "name": name,
                                   "ipAddress": ipAddress,
                                   "maskAddress": maskAddress,
                                   "routeTable": routeTable
                              });
                         }
                         return info;
                    };

                    this.getHtmlView= function(){
                         return $htmlView;
                    };
               };
               this.createRouteIPv4NetworkLayer= function(networkAdapterInfo){
                    return new routeIPv4NetworkLayer(networkAdapterInfo);
               };
          },
          Device: function(){
               var route= function(){
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
                         

                         //使用object使其成为可变对象, 通过传入函数即可改变自身.
                         var mouseDownPointer= { 
                              x: 0,
                              y: 0
                         };

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

                         $wrapper.mousedown(function(e){
                              var $this= $(this);
                              //这里先解绑click, 再重新绑. 因为移动后会解绑click, 所以需要重新绑定.
                              //先解绑是因为上次操作可能不触发mousemove, 防止注册多个重复click事件.
                              $this.unbind("click");
                              $this.click(wrapperClick);
                              wrapperMouseDown.call($this, e, mouseDownPointer);
                              return false;
                         });

                         $wrapper.mouseup(wrapperMouseUp);
                    };

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
                               ControllerInterface.deviceRightClickCallback(event, ID);
                               return false;
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


                     var wrapperMouseUp= function(e){
                          var $this= $(this);
                          $this.unbind('mousemove');
                          $novelRouteView.unbind("mousemove");
                          $novelRouteView.css("cursor", "Crosshair");
                          ControllerInterface.restoreMoveCallback();
                          return false;
                     };

                    this.changeViewMouseUp= function(func){
                        /*
                            通过该函数, controller可以改变视图监听的mouseup事件函数.
                        */
                        $wrapper.unbind("mouseup");
                        $wrapper.mouseup(func);
                    };

                    this.restoreViewMouseUp= function(){
                        $wrapper.unbind("mouseup");
                        $wrapper.mouseup(wrapperMouseUp);
                    };

                    this.getCenteralPosition= function(){
                        /*
                            该函数用于返回设备的中心位置坐标.
                            返回值为对象. 对象包含x坐标, y坐标.
                        */

                        var left= parseInt($htmlView.css("left"));
                        var top= parseInt($htmlView.css("top"));
                        var width= parseInt($htmlView.css("width"));
                        var height= parseInt($htmlView.css("height"));
                        return {
                            x: left+ width/ 2,
                            y: top+ height/ 2
                        }
                    };

                    var $htmlView= $(
                         "<div class= 'novelRouteView'>"+
                              "<div class= 'wrapper'>"+
                                   "<div class= 'routeView'>"+
                                        "<img src='/media/image/route.jpg' class= 'routeImg'>"+
                                        "<p>设备</p>"+
                                   "</div>"+
                              "</div>"+
                         "</div>");
                    var $novelRouteView= $htmlView;
                    var $wrapper= $htmlView.find(".wrapper");
               }; 
               this.CreateRoute= function(){
                    return new route();
               }; 
          },
          Segement: function(){
               var cableSegement= function(){
                    /*
                         有线网段, 通过实线表示.
                         有线网络的特点是不存在物理层层面的延迟和信号损耗.
                         在数据链路层可以选择链路层种类, 如点对点, 总线. 并且设置带宽和延迟.
                    */

                    var ID= undefined;
                    var viewName= undefined;

                    //通过矩形对角顶点的两组坐标, 可以计算出矩形的左上角坐标, 矩形的高宽. 即线段容器的位置, 长宽信息.
                    var originX= undefined, originY= undefined; //两个变量记录了视图的初始位置信息.
                    var nowX= 0, nowY= 0; //两个变量记录了与初始位置信息相对的另一个顶点的位置信息.

                    var strokeWidth= 1; //canvas中画笔的宽度.

                    this.getID= function(){
                         return ID;
                    };
                    this.setID= function(id){
                         ID= id;
                    };
                    this.getViewName= function(){
                         return viewName;
                    };
                    this.setViewName= function(viewName){
                         viewName= viewName;
                    };

                    var $htmlView= $(
                        "<div class= 'novelSegement'>"+
                            "<canvas></canvas>"+
                        "</div>"
                    );
                    var context= $htmlView.find("canvas").get(0).getContext("2d");
                    context.lineWidth= 1;
                    context.strokeStyle= "rgba(0, 0, 0, 1)";

                    this.getHtmlView= function(){
                        return $htmlView;
                    };

                    this.removeHtmlView= function(){
                        $htmlView.remove();
                    };

                    var caculateNewPosition= function(){
                        /*
                            调用函数后, 根据两个位置坐标更新图形的位置信息, 长宽信息.
                            一般在调用setPosition后, 使用该函数.
                        */

                        var width= nowX- originX;
                        var height= nowY- originY;
                        if(width< 0){
                            //对角坐标在原始坐标左面时, 需要移动矩形的左上角位置.
                            console.log(nowX);
                            $htmlView.css("left", nowX);
                            $htmlView.css("width", Math.abs(width));
                            $htmlView.css("padding", "0");
                            $htmlView.find("canvas").attr("width", Math.abs(width));
                        }else if(width== 0){
                            //两点x坐标相同. 这种情况, 需要给canvas一个1px的宽度(), 并且设置两边的padding为10px.
                            // $htmlView.css("left", nowX- 10); //先左移10px.
                            $htmlView.css("left", originX);
                            $htmlView.css("width", strokeWidth);
                            // $htmlView.css("padding", "0 10px");
                            $htmlView.find("canvas").attr("width", strokeWidth);
                        }else{
                            $htmlView.css("left", originX);
                            $htmlView.css("width", width);
                            // $htmlView.css("padding", "0");
                            $htmlView.find("canvas").attr("width", width);
                        }
                        if(height< 0){
                            $htmlView.css("top", nowY);
                            $htmlView.css("height", Math.abs(height));
                            // $htmlView.css("padding", "0");
                            $htmlView.find("canvas").attr("height", Math.abs(height));
                        }else if(height== 0){
                            // $htmlView.css("top", nowY- 10);
                            $htmlView.css("top", originY);
                            $htmlView.css("height", strokeWidth);
                            // $htmlView.css("padding", "10px 0");
                            $htmlView.find("canvas").attr("height", strokeWidth);
                        }else{
                            $htmlView.css("height", height);
                            $htmlView.css("top", originY);
                            // $htmlView.css("padding", "0");
                            $htmlView.find("canvas").attr("height", height);
                        }

                        //然后更新canvas中的线段.
                        updateCanvas();
                    };

                    var updateCanvas= function(hover){
                        var width= nowX- originX;
                        var height= nowY- originY;
                        context.clearRect(0, 0, Math.abs(width), Math.abs(height));
                        if(hover){ //是鼠标在线段上方的状态.
                            context.save();
                            context.strokeStyle= "rgba(255, 0, 0, .3)";
                            context.lineWidth= "10";
                            context.lineCap= "round";
                            context.beginPath();
                            if(width> 0&& height< 0){
                                context.moveTo(0, Math.abs(height));
                                context.lineTo(Math.abs(width), 0);
                            }else if(width< 0&& height> 0){   
                                context.moveTo(Math.abs(width), 0);
                                context.lineTo(0, Math.abs(height));
                            }else{
                                context.moveTo(0, 0);
                                context.lineTo(Math.abs(width), Math.abs(height));
                            }
                            context.closePath();
                            context.stroke();
                            context.restore();
                        }
                        context.beginPath();
                        if(width> 0&& height< 0){
                            context.moveTo(0, Math.abs(height));
                            context.lineTo(Math.abs(width), 0);
                        }else if(width< 0&& height> 0){   
                            context.moveTo(Math.abs(width), 0);
                            context.lineTo(0, Math.abs(height));
                        }else{
                            context.moveTo(0, 0);
                            context.lineTo(Math.abs(width), Math.abs(height));
                        }
                        context.closePath();
                        context.stroke();
                    };

                    this.moveOrigin= function(x, y){
                        //用于改变原坐标位置. 算shortcut?  以后应该改善该函数. 应该把功能放入setPosition.
                        if(x|| x=== 0){
                            originX= x;
                        }
                        if(y|| y=== 0){
                            originY= y;
                        }
                    };

                    this.setPosition= function(x, y, update){
                        /*
                            update变量决定是否在设置完最新的坐标值后, 直接更新图形.
                            四个坐标值, 如果为空, 则不更新.
                        */

                        //先验证参数的合法性. 再验证origin坐标是否已经赋值, 如果已经赋值, 以后的值都将赋给now坐标.
                        if(x|| x=== 0){
                            if(!originX&& originX!== 0){
                                originX= x;
                                $htmlView.css("left", originX);
                            }else{
                                nowX= x;
                            }
                        }
                        if(y|| y=== 0){
                            if(!originY&& originY!== 0){
                                originY= y;
                                $htmlView.css("top", originY);
                            }else{
                                nowY= y;
                            }
                        }


                        //设置完最新坐标后默认直接更新图形.
                        if(update|| update=== null){
                            caculateNewPosition();
                        }
                    };

                    var isInZone= function(x, y){
                        /*
                            这个函数通过origin坐标与now坐标. 得出直线方程.
                            然后计算传入的坐标是否在该直线上下10px范围内.
                            在返回true, 不在返回false.
                        */

                        var zoneHeight= 14; //范围高度.

                        //fx是求出的对应x值, 在直线上的y值.  式子中, 有个地方* 1.0是为了转型成浮点数.
                        var fx= ((nowY- originY)* 1.0/ (nowX- originX))* (x- originX)+ originY;

                        return ((y> fx- zoneHeight)&& (y< fx+ zoneHeight)) //如果y值在范围高度内, 返回true.
                            
                    };

                    var updateHoverStyle= function(){
                        //暂时只更换鼠标的手势.
                        $htmlView.css("cursor", "pointer");
                        updateCanvas(true);
                    };

                    var cancelHoverStyle= function(){
                        //还原鼠标手势.
                        $htmlView.css("cursor", "default");
                        updateCanvas();
                    };

                    this.bindEvent= function(){
                        /*
                            这个函数主要用于绑定线段的事件函数.
                            线段最主要的事件函数分别是mouseenter, mousemove.
                            当鼠标进入线段上下10px区域时, 需要改变状态变量, 将线段设置为可点击状态, 并且在外观上做出改变, 最后监听mousemove事件.
                            当鼠标离开线段上下10ox区域时, 需要改变状态变量, 将线段设置为不可点击状态, 并且在外观上还原, 停止监听mousemove.
                        */

                        $htmlView.mouseenter(function(e){
                            var event= e|| window.event;
                            var state= false; //确定鼠标是否在范围内.
                            if(isInZone(parseInt(event.pageX), parseInt(event.pageY))){ //在范围内, 需要改变样式. 并监听点击事件.
                                state= true;

                                $htmlView.click(function(e){
                                    //...
                                    alert("点击到了!");
                                    return false;
                                });

                                updateHoverStyle();
                            }

                            $htmlView.mousemove(function(e){
                                var event= e|| window.event;
                                if(!isInZone(parseInt(event.pageX), parseInt(event.pageY))&& state){
                                    //鼠标不在范围内, 并且原来状态在范围内时, 说明鼠标离开了范围.
                                    state= false;
                                    $htmlView.unbind("click");

                                    cancelHoverStyle();
                                }else if(isInZone(parseInt(event.pageX), parseInt(event.pageY))&& !state){
                                    //鼠标在范围内, 并且原来状态不在范围内时, 鼠标进入了范围.
                                    state= true;
                                    $htmlView.click(function(e){
                                        //...
                                        alert("点击到了!");
                                        return false;
                                    });

                                    updateHoverStyle();
                                }
                                return false;
                            });
                            return false;
                        });

                        $htmlView.mouseleave(function(e){
                            $htmlView.unbind("mousemove");
                            $htmlView.unbind("click");
                            cancelHoverStyle();
                            return false;
                        });
                    };
               };
               this.CreateCableSegement= function(){
                    return new cableSegement();
               };
          }
     };
     window.novelView= novelView;
})();