(function(){
    var GetScreenSize= function(){
        /*
            该函数用于返回屏幕分辨率. 是指整个屏幕的分辨率, 而非浏览器分辨率.
            返回一个对象, 对象包括宽度, 高度.
        */
        return {
            'width': window.screen.width,
            'height': window.screen.height
        };
    };

    var CreateFullScreenMask= function(parent){
        var $mask= $("<div class= 'FullScreenMask'></div>");

        var id= undefined;
        //寻找唯一ID
        while(true){
            id= "FullScreenMask"+ Math.floor(Math.random()* 10000).toString();
            if($("#"+ id).length=== 0){
                $mask.attr("id", id);
                break;
            }
        }

        var $parent= parent|| $(document.body);
        $parent.append($mask);
        return id;
    };

    var RemoveFullScreenMask= function(id){
        var $mask= $("#"+ id);
        $mask.remove();
    };

    //用于记录浮动详细信息对话框的所有实例.
    window.FloatDetailedInfoDialog_Array= [];


    var FloatDetailedInfoDialog= function(parent){
        /*
            该函数代表浮动详细信息对话框对象, 参数parent是对话框的父对象, 这个设置只可以在生成时赋值.
            无法使用config参数改变. parent对象如果为空, 则默认使用document.body为父对象.
        */
        var $dialog= $(""+
            "<div class= 'FloatDetailedInfoDialog absoluteCenter'>"+
                "<div id= 'FloatDetailedInfoDialog_resizeWrapper'>"+
                    "<span id= 'FloatDetailedInfoDialog_minimizeBtn' class= 'FloatDetailedInfoDialog_resizeBtn glyphicon glyphicon-minus'></span>"+
                    "<span id= 'FloatDetailedInfoDialog_maximizeBtn' class= 'FloatDetailedInfoDialog_resizeBtn glyphicon glyphicon-plus'></span>"+
                "</div>"+
                "<div id= 'FloatDetailedInfoDialog_title'>标题</div>"+
                "<div id= 'FloatDetailedInfoDialog_body'>内容</div>"+
                "<div id= 'FloatDetailedInfoDialog_footer'>"+
                    "<button class= 'btn btn-primary FloatDetailedInfoDialog_footerBtn' id= 'FloatDetailedInfoDialog_functionalBtn'>功能按钮</button>"+
                    "<button class= 'btn btn-primary FloatDetailedInfoDialog_footerBtn' id= 'FloatDetailedInfoDialog_closeBtn'>关闭</button>"+
                "</div>"+
            "</div>");

        //寻找唯一ID
        while(true){
            var id= "FloatDetailedInfoDialog"+ Math.floor(Math.random()* 10000).toString();
            if($("#"+ id).length=== 0){
                $dialog.attr("id", id);
                break;
            }
        }

        var $title= $dialog.find("#FloatDetailedInfoDialog_title")
        var $body= $dialog.find("#FloatDetailedInfoDialog_body");
        var $footer= $dialog.find("#FloatDetailedInfoDialog_footer");
        var $minimizeBtn= $dialog.find("#FloatDetailedInfoDialog_minimizeBtn");
        var $maximizeBtn= $dialog.find("#FloatDetailedInfoDialog_maximizeBtn");
        var $closeBtn= $dialog.find("#FloatDetailedInfoDialog_closeBtn");
        var $functionalBtn= $dialog.find("#FloatDetailedInfoDialog_functionalBtn");

        //按下鼠标时的坐标.
        var mouseDownPointer= {
            x: 0,
            y: 0
        };
        //按下后拖动时的坐标.
        var mouseNowPointer= {
            x: event.pageX,
            y: event.pageY
        };
        //移动鼠标时, dialog可能跟不上鼠标, 这里可以控制他移动的距离
        var moveRatio= 1;
        //指对话框的高度, 宽度对与整个屏幕来说的大小.
        var screenSizeRatio= 0.6;
        //侧滑隐藏的比例, 指对话框还在body内的宽度除以总宽度的值, 小于该阈值则隐藏.
        var asideHideRatio= 0.85;
        //指侧滑后, 侧滑到的位置. 该系数乘以body的宽度得到最后left位置.
        var asideHideRemainingRatio= 0.99;
        //指侧滑隐藏后, 鼠标悬浮在剩余显示部分时, 略微弹出部分的大小.
        var asideHideHoverRatio= 0.9;
        //对话框的父对象. 需要对父对象进行判断, 如果父对象是body, 则激活屏幕旁自动隐藏功能, 否则不激活.
        var $parent= parent|| $(document.body);

        //flag, 表示是否使用靠边自动隐藏功能, 该功能只有父对象是body时可以使用.
        //也可以通过config函数手动配置.
        var asideHideInUse= ($parent.get(0)== document.body);

        var InitDialog= function(){
            /*
                初始化对话框, 主要功能是获取屏幕分辨率, 然后计算对话框的宽度高度. 
                并赋值给title, body等各个部件. 然后赋予事件函数.
            */

            var screenSize= GetScreenSize();

            $dialog.css("width", screenSize.width* screenSizeRatio+ "px")
                        .css("height", screenSize.height* screenSizeRatio+ "px")
                        .css("box-shadow", "0px "+  parseInt(1.0/ 300.0* screenSize.height* screenSizeRatio)+ "px "+
                                 parseInt(5.0/ 600.0* screenSize.width* screenSizeRatio)+ "px "+
                                 parseInt(3.0/ 300.0* screenSize.height* screenSizeRatio)+ "px rgba(0,0,0,.265)")
                        .css("border-top-left-radius", parseInt(20.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                        .css("border-top-right-radius", parseInt(20.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                        .css("display", "block")
                        .css("z-index", GetMaxZindex().toString());

            $title.css("height", parseInt(0.1* screenSize.height* screenSizeRatio)+ "px")
                        .css("border-top-left-radius", parseInt(20.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                        .css("border-top-right-radius", parseInt(20.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                        .css("padding", parseInt(0.025* screenSize.height* screenSizeRatio)+ "px")
                        .css("line-height", parseInt(0.05* screenSize.height* screenSizeRatio)+ "px")
                        .css("font-size", parseInt(0.05* screenSize.height* screenSizeRatio)+ "px")
                        .mousedown(function(e){
                            $dialog.unbind("mouseenter").unbind("mouseleave");
                            var event= e|| window.event;
                            var $this= $(this);
                            var titleMouseMove= function(e){
                                var event= e|| window.event;
                                var $this= $(this);
                                var left= parseInt($dialog.css('left'));
                                var top= parseInt($dialog.css('top'));
                                mouseNowPointer.x= event.pageX;
                                mouseNowPointer.y= event.pageY;
                                $dialog.css('left', (left+ moveRatio* (mouseNowPointer.x- mouseDownPointer.x))+ 'px');
                                $dialog.css('top', (top+ moveRatio* (mouseNowPointer.y- mouseDownPointer.y))+ 'px');
                                mouseDownPointer.x= mouseNowPointer.x;
                                mouseDownPointer.y= mouseNowPointer.y;
                            };
                            if(event.which== 1){
                                mouseDownPointer.x= event.pageX;
                                mouseDownPointer.y= event.pageY;
                                $(document.body).mousemove(function(e){
                                    titleMouseMove.call($this, e);
                                    return false;
                                });
                                $(document.body).mouseup(function(){
                                    $this.unbind("mousemove");
                                    $(this).unbind("mousemove");
                                    $(this).unbind("mouseup");
                                    if(asideHideInUse){
                                        //使用侧滑隐藏, 开始执行逻辑.
                                        if((parseInt($parent.css("width"))- parseInt($dialog.position().left))* 1.0/ parseInt($dialog.css("width"))< asideHideRatio){
                                            //如果对话框的在body内的部分比上总宽度小于阈值, 则侧滑隐藏.
                                            $dialog.animate({
                                                "left": parseInt($parent.css("width"))* asideHideRemainingRatio
                                            }, 500, function(){
                                                var mouseEnterCallback= function(){
                                                    $dialog.unbind("mouseenter");
                                                    $dialog.animate({
                                                        "left": parseInt($parent.css("width"))* asideHideHoverRatio
                                                    }, 300, function(){
                                                        $dialog.mouseleave(function(){
                                                            $dialog.unbind("mouseleave");
                                                            $dialog.animate({
                                                                "left": parseInt($parent.css("width"))* asideHideRemainingRatio
                                                            }, 300, function(){
                                                                $dialog.mouseenter(mouseEnterCallback);
                                                            });
                                                        });
                                                    });
                                                    return false;
                                                };
                                                $dialog.mouseenter(mouseEnterCallback);
                                            });
                                        }
                                    }
                                    return false;
                                });
                            }
                            //还要改变对话框的z-index顺序.
                            $dialog.css("z-index", GetMaxZindex().toString());
                        });

            $body.css("height", parseInt(0.8* screenSize.height* screenSizeRatio)+ "px")
                        .css("padding", parseInt(0.025* screenSize.height* screenSizeRatio)+ "px");

            $footer.css("height", parseInt(0.1* screenSize.height* screenSizeRatio)+ "px")
                        .css("line-height", parseInt(0.1* screenSize.height* screenSizeRatio)+ "px")
                        .css("padding-top", parseInt(0.01* screenSize.height* screenSizeRatio)+ "px")
                        .css("box-shadow", "0px "+  parseInt(-1.0/ 300.0* screenSize.height* screenSizeRatio)+ "px "+
                                 parseInt(1.0/ 600.0* screenSize.width* screenSizeRatio)+ "px "+
                                 parseInt(1.0/ 300.0* screenSize.height* screenSizeRatio)+ "px rgba(0,0,0,.265)");

            $minimizeBtn.css("width", parseInt(20.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                                .css("height", parseInt(20.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .css("line-height", parseInt(10.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .css("font-size", parseInt(10.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .css("right", parseInt(30.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                                .css("top", parseInt(10.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .click(function(e){
                                    var $this= $(this);
                                    $dialog.css("width", parseInt(screenSize.width* screenSizeRatio* 0.5)+ "px")
                                                .css("height", parseInt(40.0/ 300.0* screenSize.height* screenSizeRatio)+ "px");
                                    $title.css("padding-left", parseInt(30.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                                            .css("padding-right", parseInt(30.0/ 600.0* screenSize.width* screenSizeRatio)+ "px");
                                    $body.css("display", "none");
                                    $footer.css("display", "none");
                                    $this.css("display", "none");
                                    $maximizeBtn.css("display", "block");
                                    return false;
                                });
            $maximizeBtn.css("width", parseInt(20.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                                .css("height", parseInt(20.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .css("line-height", parseInt(10.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .css("font-size", parseInt(10.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .css("right", parseInt(30.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                                .css("top", parseInt(10.0/ 300.0* screenSize.height* screenSizeRatio)+ "px")
                                .click(function(e){
                                    var $this= $(this);
                                    $dialog.css("width", parseInt(screenSize.width* screenSizeRatio)+ "px")
                                                .css("height", parseInt(screenSize.height* screenSizeRatio)+ "px");
                                    $title.css("padding-left", parseInt(10.0/ 600.0* screenSize.width* screenSizeRatio)+ "px")
                                            .css("padding-right", parseInt(10.0/ 600.0* screenSize.width* screenSizeRatio)+ "px");
                                    $body.css("display", "block");
                                    $footer.css("display", "block");
                                    $this.css("display", "none");
                                    $minimizeBtn.css("display", "block");
                                    return false;
                                });
            $closeBtn.click(function(e){
                for(var i= 0; i< window.FloatDetailedInfoDialog_Array.length; i++){
                    //比较数组中的对话框对象与目标对象是否相同. 如果相同则从数组中删除.
                    if(window.FloatDetailedInfoDialog_Array[i]=== $dialog){
                        window.FloatDetailedInfoDialog_Array.splice(i, 1);
                    }
                }
                $dialog.remove();
            });

            $dialog.find(".FloatDetailedInfoDialog_footerBtn").css("margin", "0 "+ (20.0/ 600.0)* parseInt(screenSize.width* screenSizeRatio)+ "px");
        };

        var GetMaxZindex= function(){
            /*
                获取最大的z-index
            */

            //z-index的上下阈值.
            var upperBound= 2499;
            var bottomBound= 1600;

            if(!window.FloatDetailedInfoDialog_Array|| window.FloatDetailedInfoDialog_Array.length== 0){
                window.FloatDetailedInfoDialog_Array= new Array();
                return bottomBound; //如果不存在该数组, 或数组内没有元素, 直接返回默认z-index值.
            }
            var maxZindex= parseInt(window.FloatDetailedInfoDialog_Array[0].css("z-index"));
            for(var i= 1; i< window.FloatDetailedInfoDialog_Array.length; i++){
                if(parseInt(window.FloatDetailedInfoDialog_Array[i].css("z-index"))> maxZindex){
                    maxZindex= parseInt(window.FloatDetailedInfoDialog_Array[i].css("z-index"));
                }
            }
            if(maxZindex== upperBound){ //默认的最大z-index值2499. 2500为loading的z-index值.
                //需要重新调整全局的z-index值.
                if(window.FloatDetailedInfoDialog_Array.length== 900){
                    //说明900个z-index值已经用完. 直接返回最大值.
                    return maxZindex;
                }else{
                    //z-index值没有被用完, 进行全局调整. 先以z-index为标准进行排序. 
                    //排序后第一个元素赋予1600, 后面依次递增1.
                    window.FloatDetailedInfoDialog_Array.sort(function(a, b){
                        if(parseInt($(a).css("z-index"))< parseInt($(b).css("z-index"))){
                            return -1;
                        }else if(parseInt($(a).css("z-index"))== parseInt($(b).css("z-index"))){
                            return 0;
                        }else{
                            return 1;
                        }
                    });
                    for(var i= 0; i< window.FloatDetailedInfoDialog_Array.length; i++){
                        window.FloatDetailedInfoDialog_Array[i].css("z-index", (1600+ i)+ "");
                    }
                    return 1600+ window.FloatDetailedInfoDialog_Array.length;
                }
            }else{
                //直接返回最大值加1.
                return maxZindex+ 1;
            }
        };

        InitDialog();

        this.config= function(configObj){
            /*
                该函数用于配置对话框, 可多次进行配置, 每次可只配置部分值, 不会改变其他已设置的值.
            */
            if(configObj.title){
                $title.text(configObj.title);
            }
            if(configObj.body){
                $body.empty();
                $body.append(configObj.body);
            }
            if(configObj.disableAsideHide){
                asideHideInUse= false;
            }
            if(configObj.enableAsideHide){
                asideHideInUse= true;
            }
            if(configObj.hideFunctionalBtn){
                $functionalBtn.css("display", "none");
            }
            if(configObj.showFunctionalBtn){
                $functionalBtn.css("display", "block");
            }
            if(configObj.functionalBtnText){
                $functionalBtn.text(configObj.functionalBtnText);
            }
            if(configObj.functionalBtnCallback){
                $functionalBtn.unbind("click");
                $functionalBtn.click(configObj.functionalBtnCallback);
            }
            if(configObj.screenSizeRatio){
                screenSizeRatio= configObj.screenSizeRatio;
            }
            if(configObj.moveRatio){
                moveRatio= configObj.moveRatio;
            }
            if(configObj.asideHideRatio){
                asideHideRatio= configObj.asideHideRatio;
            }
            if(configObj.asideHideRemainingRatio){
                asideHideRemainingRatio= configObj.asideHideRemainingRatio;
            }
            if(configObj.asideHideHoverRatio){
                asideHideHoverRatio= configObj.asideHideHoverRatio;
            }
        };

        $parent.append($dialog);
        if(window.FloatDetailedInfoDialog_Array== undefined){
            window.FloatDetailedInfoDialog_Array= new Array();
        }
        window.FloatDetailedInfoDialog_Array.push($dialog);
    };

    window.CreateFloatDetailedInfoDialog= function(parent){
        return new FloatDetailedInfoDialog(parent);
    };

    var ModalConfirmDialog= function(parent){
        /*
            确认对话框.
        */

        //先显示遮罩.
        var maskID= CreateFullScreenMask(parent);

        var $dialog= $(""+
            "<div class= 'ModalConfirmDialog absoluteCenter'>"+
                "<div id= 'ModalConfirmDialog_title'>标题</div>"+
                "<div id= 'ModalConfirmDialog_body'>内容</div>"+
                "<div id= 'ModalConfirmDialog_footer'>"+
                    "<button class= 'btn btn-primary ModalConfirmDialog_footerBtn' id= 'ModalConfirmDialog_confirmBtn'>确认</button>"+
                    "<button class= 'btn btn-primary ModalConfirmDialog_footerBtn' id= 'ModalConfirmDialog_closeBtn'>关闭</button>"+
                "</div>"+
            "</div>");

        //寻找唯一ID
        while(true){
            var id= "ModalConfirmDialog"+ Math.floor(Math.random()* 10000).toString();
            if($("#"+ id).length=== 0){
                $dialog.attr("id", id);
                break;
            }
        }

        var $title= $dialog.find("#ModalConfirmDialog_title");
        var $body= $dialog.find("#ModalConfirmDialog_body");
        var $footer= $dialog.find("#ModalConfirmDialog_footer");
        var $confirmBtn= $dialog.find("#ModalConfirmDialog_confirmBtn");
        var $closeBtn= $dialog.find("#ModalConfirmDialog_closeBtn");

        //指对话框的高度, 宽度对与整个屏幕来说的大小.
        var screenSizeRatio= 0.3;
        //对话框的父对象. 
        var $parent= parent|| $(document.body);

        var InitDialog= function(){
            var screenSize= GetScreenSize();

            $dialog.css("width", screenSize.width* screenSizeRatio+ "px")
                        .css("height", screenSize.height* screenSizeRatio+ "px")
                        .css("box-shadow", "0px "+ (1.0/ 180.0* screenSize.height* screenSizeRatio)+ "px "
                            + (5.0/ 400.0* screenSize.width* screenSizeRatio)+ "px "
                            + (3.0/ 180.0* screenSize.height* screenSizeRatio)+ "px "+ "rgba(0,0,0,.065)")
                        .css("border-top-left-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px")
                        .css("border-top-right-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px");

            $title.css("height", 40.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("padding", 10.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("line-height", 20.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("font-size", 20.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("border-top-left-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px")
                    .css("border-top-right-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px");

            $body.css("height", 100.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                        .css("line-height", 100.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                        .css("font-size", 15.0/ 180.0* screenSize.height* screenSizeRatio+ "px");

            $footer.css("height", 40.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                        .css("line-height", 40.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                        .css("box-shadow", "0px "+  (-1.0/ 180.0* screenSize.height* screenSizeRatio)+ "px "+
                                 (1.0/ 400.0* screenSize.width* screenSizeRatio)+ "px "+
                                 (1.0/ 180.0* screenSize.height* screenSizeRatio)+ "px rgba(0,0,0,.265)");

            $dialog.find(".ModalConfirmDialog_footerBtn").css("margin", "0 "+ (20.0/ 400.0)* parseInt(screenSize.width* screenSizeRatio)+ "px");

            $closeBtn.click(function(e){
                $dialog.remove();
                RemoveFullScreenMask(maskID); //删除遮罩不能忘记
            });
        };

        InitDialog();

        this.config= function(configObj){
            if(configObj.title){
                $title.text(configObj.title);
            }
            if(configObj.body){
                $body.empty();
                $body.append(configObj.body);
            }
            if(configObj.confirmBtnText){
                $confirmBtn.text(configObj.confirmBtnText);
            }
            if(configObj.confirmBtnCallback){
                $confirmBtn.unbind("click");
                $confirmBtn.click(function(e){
                    configObj.confirmBtnCallback.call(this, e);
                    RemoveFullScreenMask(maskID);
                    $dialog.remove();
                });
            }
        };

        $parent.append($dialog);
    };

    window.CreateModalConfirmDialog= function(parent){
        return new ModalConfirmDialog(parent);
    };

    var ModalAlertDialog= function(parent){
        /*
            提醒对话框
        */

        var maskID= CreateFullScreenMask(parent);

        var $dialog= $(""+
            "<div class= 'ModalAlertDialog absoluteCenter'>"+
                "<div id= 'ModalAlertDialog_title'>标题</div>"+
                "<div id= 'ModalAlertDialog_body'>通知</div>"+
                "<div id= 'ModalAlertDialog_footer'>"+
                    "<button class= 'btn btn-primary' id= 'ModalAlertDialog_confirmBtn'>确认</button>"+
                "</div>"+
            "</div>");

        //寻找唯一ID
        while(true){
            var id= "ModalAlertDialog"+ Math.floor(Math.random()* 10000).toString();
            if($("#"+ id).length=== 0){
                $dialog.attr("id", id);
                break;
            }
        }

        var $title= $dialog.find("#ModalAlertDialog_title");
        var $body= $dialog.find("#ModalAlertDialog_body");
        var $footer= $dialog.find("#ModalAlertDialog_footer");
        var $confirmBtn= $dialog.find("#ModalAlertDialog_confirmBtn");

        //指对话框的高度, 宽度对与整个屏幕来说的大小.
        var screenSizeRatio= 0.3;
        //对话框的父对象. 
        var $parent= parent|| $(document.body);

        var InitDialog= function(){
            var screenSize= GetScreenSize();

            $dialog.css("width", screenSize.width* screenSizeRatio+ "px")
                        .css("height", screenSize.height* screenSizeRatio+ "px")
                        .css("box-shadow", "0px "+ (1.0/ 180.0* screenSize.height* screenSizeRatio)+ "px "
                            + (5.0/ 400.0* screenSize.width* screenSizeRatio)+ "px "
                            + (3.0/ 180.0* screenSize.height* screenSizeRatio)+ "px "+ "rgba(0,0,0,.065)")
                        .css("border-top-left-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px")
                        .css("border-top-right-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px");

            $title.css("height", 40.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("line-height", 20.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("font-size", 20.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("padding", 10.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                    .css("border-top-left-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px")
                    .css("border-top-right-radius", (20.0/ 400.0* screenSize.width* screenSizeRatio)+ "px");

            $body.css("height", 100.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                        .css("line-height", 100.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                        .css("font-size", 15.0/ 180.0* screenSize.height* screenSizeRatio+ "px");

            $footer.css("height", 40.0/ 180.0* screenSize.height* screenSizeRatio+ "px")
                        .css("line-height", 40.0/ 180.0* screenSize.height* screenSizeRatio+ "px")                 
                        .css("box-shadow", "0px "+  (-1.0/ 180.0* screenSize.height* screenSizeRatio)+ "px "+
                                 (1.0/ 400.0* screenSize.width* screenSizeRatio)+ "px "+
                                 (1.0/ 180.0* screenSize.height* screenSizeRatio)+ "px rgba(0,0,0,.265)");

            $confirmBtn.click(function(){
                $dialog.remove();
                RemoveFullScreenMask(maskID);
            });
        };

        InitDialog();

        this.config= function(configObj){
            if(configObj.title){
                $title.text(configObj.title);
            }
            if(configObj.body){
                $body.empty();
                $body.append(configObj.body);
            }
        };

        $parent.append($dialog);
    };

    window.CreateModalAlertDialog= function(parent){
        return new ModalAlertDialog(parent);
    };
})();

