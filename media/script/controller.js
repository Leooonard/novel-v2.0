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
    var IDArray= []; //这个数组存放了所有设备唯一的ID号, 当前有多少台设备和线段, 数组就应该有多少个元素.
    var modelIDArray= []; 
    var deviceModelArray= []; //这个数组存放了所有的已注册成功设备的模型.
    var deviceViewArray= []; //这个数组存放了所有的已注册成功设备的视图.
    var segViewArray= []; //这个数组存放了所有的已注册成功线段的视图.
    var segModelArray= []; //这个数组存放了所有的已注册成功线段的模型.

    /*
        这个数组存放了所有的已注册成功的线段和设备的映射关系.
        数据结构为:
        {
            "segID": , //线段的ID号.
            "srcDeviceID": , //源设备的ID号.
            "tarDeviceID": , //目标设备的ID号.
        }
    */
    var segDeviceArray= []; 
    var rightClickPointer= undefined; //这个对象存放了当鼠标右击设备时的坐标.


    var InterfaceForDeviceView= function(){
        /*
            这个接口对象用于提供给设备视图. 使设备视图能够调用controller的某些功能.
        */

        this.deviceOuterMouseDownCallback= function(ID){
            /*
                视图外部受到点击时, 即需要放大缩小对象.
                这时, 对象可能会移动到别的对象上方. 需要取消其他对象的事件监听.
                所以需要将控制权交给controller.

                1. 取消其他事件函数的监听.
                2. 取消该视图函数对click的监听.
                3. 获取与设备相关的线段. 需要及时调整他们的位置.
                4. 增加labcontainer对mousemove, mouseup的监听. 调整大小的接口为scale
                5. 还原事件.
            */

            var restoreClick= true;
            var view= undefined;
            for(var i= 0; i< deviceViewArray.length; i++){
                if(deviceViewArray[i].compareID(ID)){
                    view= deviceViewArray[i];
                    break;
                }
            }
            if(view== undefined){
                return false;
            }

            var unbindEvent= function(){
                // 1
                for(var i= 0; i< deviceViewArray.length; i++){
                    var device= deviceViewArray[i];
                    if(!device.compareID(ID)){
                        device.unbindViewMouseDown(); //防止按了鼠标左键后, 又按下了右键.
                        device.unbindViewMouseEnter();
                        device.unbindViewMouseLeave();
                    }
                }

                for(var i= 0; i< segViewArray.length; i++){
                    var seg= segViewArray[i];
                    seg.unbindViewMouseEnter();
                    seg.unbindViewMouseLeave();
                }

                // 2
                view.unbindViewMouseEnter();
                view.unbindViewMouseLeave();
                view.unbindViewClick();
            };

            var restoreEvent= function(){
                for(var i= 0; i< deviceViewArray.length; i++){
                    var device= deviceViewArray[i];
                    if(!device.compareID(ID)){
                        device.restoreViewMouseDown(); //防止按了鼠标左键后, 又按下了右键.
                        device.restoreViewMouseEnter();
                        device.restoreViewMouseLeave();
                    }
                }

                for(var i= 0; i< segViewArray.length; i++){
                    var seg= segViewArray[i];
                    seg.restoreViewMouseEnter();
                    seg.restoreViewMouseLeave();
                }

                view.restoreViewMouseEnter();
                view.restoreViewMouseLeave();
                if(restoreClick){
                    view.restoreViewClick();
                }

                $labContainer.unbind("mousemove");
                $labContainer.unbind("mouseup");
            };

            unbindEvent();

            var segArray= [];
            if(isDeviceWithSegement(view.getID())){
                //该设备与线段相连.
                segArray= getSegementArrayByDeviceID(ID);
            }

            $labContainer.mousemove(function(e){
                var event= e|| window.event;
                restoreClick= false;
                view.scale(event); //调用缩放函数, 计算最新的大小.
                for(var i= 0; i< segArray.length; i++){
                    var seg= segArray[i];
                    if(seg.isSrcDevice){
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.moveOrigin(centeralPosition.x, centeralPosition.y, true);
                    }else{ 
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.setPosition(centeralPosition.x, centeralPosition.y, true);
                    }
                }
                return false;
            });

            $labContainer.mouseup(function(e){
                var event= e|| window.event;
                view.scale(event);
                for(var i= 0; i< segArray.length; i++){
                    var seg= segArray[i];
                    if(seg.isSrcDevice){
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.moveOrigin(centeralPosition.x, centeralPosition.y, true);
                    }else{ 
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.setPosition(centeralPosition.x, centeralPosition.y, true);
                    }
                }
                restoreEvent();
                return false;
            });
        };  

        this.deviceInnerMouseDownCallback= function(ID){
            /*
                视图内部受到点击时, 即需要移动对象.
                这时, 对象可能会移动到别的对象上方. 需要取消其他对象的事件监听.
                所以需要将控制权交给controller.

                1. 取消其他事件函数的监听.
                2. 取消该视图函数对click的监听.
                3. 获取与设备相关的线段. 需要及时调整他们的位置.
                4. 增加labcontainer对mousemove, mouseup的监听. 移动的接口为move.
                5. 还原事件.
            */

            var restoreClick= true; //判断是否需要恢复click事件. 原因在novelView.Device的wrapperClick函数中.
            var view= undefined;
            for(var i= 0; i< deviceViewArray.length; i++){
                if(deviceViewArray[i].compareID(ID)){
                    view= deviceViewArray[i];
                    break;
                }
            }
            if(view== undefined){
                return false;
            }

            var unbindEvent= function(){
                // 1
                for(var i= 0; i< deviceViewArray.length; i++){
                    var device= deviceViewArray[i];
                    if(!device.compareID(ID)){
                        device.unbindViewMouseDown(); //防止按了鼠标左键后, 又按下了右键.
                        device.unbindViewMouseEnter();
                        device.unbindViewMouseLeave();
                    }
                }

                for(var i= 0; i< segViewArray.length; i++){
                    var seg= segViewArray[i];
                    seg.unbindViewMouseEnter();
                    seg.unbindViewMouseLeave();
                }

                // 2
                view.unbindViewMouseEnter();
                view.unbindViewMouseLeave();
                view.unbindViewClick();
            };

            var restoreEvent= function(){
                for(var i= 0; i< deviceViewArray.length; i++){
                    var device= deviceViewArray[i];
                    if(!device.compareID(ID)){
                        device.restoreViewMouseDown(); //防止按了鼠标左键后, 又按下了右键.
                        device.restoreViewMouseEnter();
                        device.restoreViewMouseLeave();
                    }
                }

                for(var i= 0; i< segViewArray.length; i++){
                    var seg= segViewArray[i];
                    seg.restoreViewMouseEnter();
                    seg.restoreViewMouseLeave();
                }

                view.restoreViewMouseEnter();
                view.restoreViewMouseLeave();
                if(restoreClick){
                    view.restoreViewClick();
                }

                $labContainer.unbind("mousemove");
                $labContainer.unbind("mouseup");
            };

            unbindEvent();

            var segArray= [];
            if(isDeviceWithSegement(view.getID())){
                //该设备与线段相连.
                segArray= getSegementArrayByDeviceID(ID);
            }

            $labContainer.mousemove(function(e){
                var event= e|| window.event;
                restoreClick= false;
                view.move(event); //调用缩放函数, 计算最新的大小.
                for(var i= 0; i< segArray.length; i++){
                    var seg= segArray[i];
                    if(seg.isSrcDevice){
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.moveOrigin(centeralPosition.x, centeralPosition.y, true);
                    }else{ 
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.setPosition(centeralPosition.x, centeralPosition.y, true);
                    }
                }
                return false;
            });

            $labContainer.mouseup(function(e){
                var event= e|| window.event;
                view.move(event);
                for(var i= 0; i< segArray.length; i++){
                    var seg= segArray[i];
                    if(seg.isSrcDevice){
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.moveOrigin(centeralPosition.x, centeralPosition.y, true);
                    }else{ 
                        var centeralPosition= view.getCenteralPosition();
                        seg.segView.setPosition(centeralPosition.x, centeralPosition.y, true);
                    }
                }
                restoreEvent();
                return false;
            });
        };

        //使视图受到点击时, 能够通过控制器完成配置菜单的显示.
        this.deviceClickCallback= function(ID){
            /*
                设备视图收到了点击事件. 需要controller接管. 显示配置界面.
                配置界面需要根据设备模型具体生成.
                参数ID可以找到相应的设备模型.
                无返回值, 但是需要将配置结果写入设备模型.

                *** 需要解除该对象的click事件绑定!!!  防止多次调出对话框.
            */

            //先找到相应的设备模型.
            var model= undefined;
            for(var i= 0; i< deviceModelArray.length; i++){
                if(deviceModelArray[i].compareID(ID)){
                    model= deviceModelArray[i];
                    break;
                }
            }
            if(model== undefined){ //没找到则出错, 退出.
                return false;
            }

            //再找到相应的设备视图.
            var view= undefined;
            for(var i= 0; i< deviceViewArray.length; i++){
                if(deviceViewArray[i].compareID(ID)){
                    view= deviceViewArray[i];
                    break;
                }
            }
            if(view== undefined){
                return false;
            }

            //禁用view的click事件. 也就是, 该设备能够拖动, 缩放, 但不能点击.
            ...

            var $dialog= CreateFloatDetailedInfoDialog(); //建立对话框.          

            //通过调用接口获取html元素, 该元素可以直接放入对话框中.
            var info= model.getLayerInfo();
            view.setLayerInfo(info);
            var $viewInfo= view.getViewInfo();

            $dialog.config({
                "title": view.getViewName(),
                "body": $viewInfo,
                "functionalBtnText": "保存",
                "functionalBtnCallback": function(){
                    var info= view.getLayerInfo();
                    view.updateViewName(); //更新小图标上的名字.
                    $dialog.config({
                        "title": view.getViewName()
                    });
                    model.setLayerInfo(info);
                }
            });


            buttonToggle(); //这个很重要!!!
        };

        this.deviceRightMouseDownCallback= function(e, ID){
            /*
                当设备自身被右击时, 需要调用该回调, 将控制权交给controller.
                ID指被单击设备的ID号.
                controller需要绑定mousemove, mouseup两个事件.
            */
            var event= e|| window.event;

            //创建零时的网段. 该对象是网段对象.
            var $temporarySeg= createSegementView("cable");

            //设置网段对象的初始位置. 不显示图形位置.
            $temporarySeg.setPosition(parseInt(event.pageX), parseInt(event.pageY), false);
            $labContainer.append($temporarySeg.getHtmlView());

            var unbindEvent= function(){
                /*
                    这里执行夺取设备, 线段视图的控制权的函数.
                    夺取通过视图提供的接口进行.
                */

                for(var i= 0; i< deviceViewArray.length; i++){
                    deviceViewArray[i].unbindViewMouseDown(); //鼠标点击右键时, 还能点击左键. 这里防止用户做出类似行为.
                    deviceViewArray[i].unbindViewMouseEnter();
                    deviceViewArray[i].unbindViewMouseLeave();

                    //不需要解绑click. 右键mousedown不会绑click.
                }

                for(var i= 0; i< segViewArray.length; i++){
                    segViewArray[i].unbindViewMouseEnter(); 
                    segViewArray[i].unbindViewMouseLeave();
                }
            };

            var restoreEvent= function(){
                /*
                    还原函数.
                    controller交出控制权.
                */
                
                for(var i= 0; i< deviceViewArray.length; i++){
                    //这里还原各个设备的监听事件.
                    deviceViewArray[i].restoreViewMouseDown();
                    deviceViewArray[i].restoreViewMouseEnter();
                    deviceViewArray[i].restoreViewMouseLeave();
                    deviceViewArray[i].unbindMouseUp();
                }

                for(var i= 0; i< segViewArray.length; i++){
                    segViewArray[i].restoreViewMouseEnter();
                    segViewArray[i].restoreViewMouseLeave();
                }

                $labContainer.unbind("mousemove");
                $labContainer.unbind("mouseup");
            };

            //解除设备, 线段自身的监听事件.
            unbindEvent();

            //然后接管mousemove事件.
            $labContainer.mousemove(function(e){
                /*
                    mousemove事件决定线段的另一个端点.
                */
                var event= e|| window.event;
                $temporarySeg.setPosition(parseInt(event.pageX), parseInt(event.pageY), true);
                return false;
            });

            //接管mouseup事件.
            $labContainer.mouseup(function(e){
                /*
                    没有在设备内抬起鼠标, 该线段需要删除.
                */
                $temporarySeg.removeHtmlView();
                //还原原来的抬起事件.
                restoreEvent();
                return false;
            });

            //注册设备的mouseup事件. 并且在body捕捉mouseup事件.(如果捕捉到, 说明没有在设备上放开, 不是有效的网段)
            //用for循环, 会产生闭包问题, 十分麻烦, 使用jquery的工具函数 each来遍历.
            $.each(deviceViewArray, function(){
                var view= this;
                view.registerViewMouseUp(function(e){
                    /*
                        在设备内抬起了鼠标, 该线段需要保留.
                    */
                    if(view.compareID(ID)){
                        //在原设备上放开了鼠标. 该线段需要删除.
                        $temporarySeg.removeHtmlView();
                        //还原原来的抬起事件.
                        restoreEvent();
                        return false;
                    }

                    /*
                        保留该线段的操作.
                        1. 先调整位置.
                        2. 为线段申请ID.
                        3. 为线段绑定事件.
                        4. 创建线段模型对象.
                        5. 添加线段至列表.
                        6. 为线段添加与设备的映射关系. (当设备删除时, 线段删除时, 设备移动时都需使用该映射关系)
                    */

                    // 1
                    for(var j= 0; j< deviceViewArray.length; j++){
                        if(deviceViewArray[j].compareID(ID)){ //是原始设备.
                            var centeralPosition= deviceViewArray[j].getCenteralPosition();
                            $temporarySeg.moveOrigin(centeralPosition.x, centeralPosition.y);
                            centeralPosition= view.getCenteralPosition();
                            $temporarySeg.setPosition(centeralPosition.x, centeralPosition.y, true);
                            break;
                        }
                    }

                    // 2
                    var segID= util.getID(IDArray); 
                    if(!util.registerID(segID, IDArray)){
                        //注册ID出错, 该线段不能保留.
                        alert("ID号不够用了!");
                        $temporarySeg.removeHtmlView();
                        restoreEvent();
                        return false;
                    }

                    // 3
                    $temporarySeg.bindEvent();

                    // 4
                    var model= createSegementModel($temporarySeg);
                    $temporarySeg.setID(segID);
                    model.setID(segID);

                    // 5
                    segViewArray.push($temporarySeg);
                    segModelArray.push(model);

                    // 6
                    var segDevice= {
                        "segID": segID,
                        "srcDeviceID": ID,
                        "tarDeviceID": view.getID()
                    };
                    segDeviceArray.push(segDevice);

                    //还原原来的事件.
                    restoreEvent();
                    return false;
                });
            });
        };
    };

    var InterfaceForSegementView= function(){
        this.segementClickCallback= function(ID){
            /*
                当线段在有效区域内受到点击时, 需要显示配置界面.
                由于配置界面需要获取相对应的model中的信息. 所以需要通过controller进行流程.

                需要禁用对象的click绑定, 防止多次调用.
            */

            //先找到相应的设备模型.
            var model= undefined;
            for(var i= 0; i< deviceModelArray.length; i++){
                if(deviceModelArray[i].compareID(ID)){
                    model= deviceModelArray[i];
                    break;
                }
            }
            if(model== undefined){ //没找到则出错, 退出.
                return false;
            }

            //再找到相应的设备视图.
            var view= undefined;
            for(var i= 0; i< deviceViewArray.length; i++){
                if(deviceViewArray[i].compareID(ID)){
                    view= deviceViewArray[i];
                    break;
                }
            }
            if(view== undefined){
                return false;
            }

            var $dialog= CreateFloatDetailedInfoDialog(); //建立对话框.          

            //通过调用接口获取html元素, 该元素可以直接放入对话框中.
            var info= model.getLayerInfo();
            view.setLayerInfo(info);
            var $viewInfo= view.getViewInfo();

            $dialog.config({
                "title": view.getViewName(),
                "body": $viewInfo,
                "functionalBtnText": "保存",
                "functionalBtnCallback": function(){
                    var info= view.getLayerInfo();
                    view.updateViewName(); //更新小图标上的名字.
                    $dialog.config({
                        "title": view.getViewName()
                    });
                    model.setLayerInfo(info);
                }
            });


            buttonToggle(); //这个很重要!!!
        };
    };

    var isDeviceWithSegement= function(ID){
        /*
            测试一个设备是否与线段相连接.
        */
        for(var i= 0; i< segDeviceArray.length; i++){
            if(segDeviceArray[i].srcDeviceID=== ID|| segDeviceArray[i].tarDeviceID=== ID){
                return true;
            }
        }
        return false;
    };

    var getSegementArrayByDeviceID= function(ID){
        /*
            函数通过一个设备ID, 获取与该设备相连的所有的线段.
            返回值为数组. 若该设备没有与任何线段相连, 则返回空数组.
            数据结构为:
            [{
                "segView": , //线段视图对象
                "isSrcDevice": , //表示该设备是否为该线段的源设备
            }, ...]
        */
        var array= [];
        for(var i= 0; i< segDeviceArray.length; i++){
            var segDevice= segDeviceArray[i];
            if(segDevice.srcDeviceID=== ID|| segDevice.tarDeviceID=== ID){ //该线段与设备相关, 找出该设备的视图.
                for(var j= 0; j< segViewArray.length; j++){
                    if(segViewArray[j].getID()=== segDevice.segID){
                        array.push({
                            "segView": segViewArray[j],
                            "isSrcDevice": (segDevice.srcDeviceID=== ID)
                        });
                        break;
                    }
                }
            }
        }
        return array;
    };

    var mouseMoveCallback= function(e){
        return false;
    }

    var createSegementView= function(type){
        /*
            该函数用于创建网段.
            需要返回一个网段对象.
        */
        var view= new novelView.Segement().CreateViewByType(type);
        return view;
    };  

    var createSegementModel= function(view){
        /*
            该函数用于创建网段的模型对象.
            传入的线段视图用于进行模型对象匹配.
            最终生成的是对应于视图对象的模型对象.
        */

        var type= view.getType();
        var model= new novelModel.Segement().CreateModelByType(type);
        return model;
    };

    var novelController= {      
        createDevice: function(view, model){
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

            view.appendToDocument($labContainer);

            /*
                绑定事件. 由于视图本身缺乏处理一些问题的能力, 需要通过控制器完成. 
                在这里, 控制器需要将暴露的接口传递给视图, 使得视图在必要时刻能够调用控制器提供的功能.
            */
            view.bindEvent();

            //这里将接口对象直接传递给设备视图. 视图是否使用由视图具体需要实现哪些功能决定.
            if(view.registerControllerInterface){ //如果实现了该函数则传递.
                view.registerControllerInterface(new InterfaceForDeviceView());
            }

            deviceModelArray.push(model);
            deviceViewArray.push(view);
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
        },
        createStaticIPv4Route: function(){
            /*
                创建一个已经被定制过的路由对象.
                该函数的命名规则为, 使用从高层到低层的各层的特点来命名.
                创建失败返回false, 创建成功返回true.(以后应改为返回某个对象, 让用户有自定义空间)
            */

            var view= novelView.createStaticIPv4Route();
            var model= novelModel.createStaticIPv4Route();
            if(this.createDevice(view, model)){
                return true;
            }else{
                return false;
            }
        }
    };

    window.novelController= novelController;
})();