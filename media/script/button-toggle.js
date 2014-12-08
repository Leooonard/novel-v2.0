(function(){
     /*
          JS用于改变元素的文字.
          点击元素后将元素文字从data-before改为data-after. 再点击时, 变回.
          当data-buttontoggle为single时, 只能单向的从data-before变为data-after.
          需要通过buttontoggle函数启动.
     */

     var buttonToggle= function(){
          var $toggleList= $("[data-buttontoggle]"); //收集所有有data-buttontoggle属性的元素.
          $toggleList.each(function(){
               var $this= $(this);
               $this.text($this.attr("data-before")); //初始化文字.
               $this.click(function(e){
                    /*
                         注册点击事件.
                    */
                    var buttonToggle= $this.attr("data-buttontoggle");
                    if(buttonToggle== "single"){ //单向时, 只需将文字改为data-after即可.
                         $this.text($this.attr("data-after"));
                    }else{ 
                         //双向时, 先要给元素加一个状态.
                         var buttonState= $this.attr("data-buttonstate");
                         if(!buttonState){
                              $this.attr("data-buttonstate", "after"); //没有data-buttonstate时, 要添加. 并且直接设置值为after.
                         }else if(buttonState== "before"){ //有data-buttontoggle时, 直接改变状态.
                              $this.attr("data-buttonstate", "after");
                         }else if(buttonState== "after"){
                              $this.attr("data-buttonstate", "before");
                         }else{
                              console.log("button-toggle.js: there is an error in getting data-buttonstate");
                         }

                         //判明状态后, 根据状态改变文字.
                         if($this.attr("data-buttonstate")== "after"){
                              $this.text($this.attr("data-after"));
                         }else if($this.attr("data-buttonstate")== "before"){
                              $this.text($this.attr("data-before"));
                         }else{
                              console.log("button-toggle.js: there is an error in setting text");
                         }
                    }
               });
          });
     };

     window.buttonToggle= buttonToggle;
})();