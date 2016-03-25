$(function() {
   var $loginBtn = $("#loginBtn")
   $loginBtn.click(function(){
      var $idInput = $("#id")
      var $passwordInput = $("#password")
      var $errorTip = $("#errorTip")
      var $loginForm = $("#loginForm")
      var $loginInfo = $("#loginInfo")
      $.post("./login", {
         "id": $idInput.val(),
         "password": $passwordInput.val(),
      }).done(function(response){
         if(!!response.ok){
            $loginForm.css("display", "none")
            $loginInfo.css("display", "block")
            var $idInfo = $loginInfo.find("#idInfo")
            var $nameInfo = $loginInfo.find("#nameInfo")
            var $experimentList = $("#experimentList")
            $idInfo.text(response.id)
            $nameInfo.text(response.name)
            $experimentList.css("display", "block")
         }else{
            $errorTip.text("网络错误，登录失败")
         }
      }).fail(function(){
         $errorTip.text("网络错误，登录失败")
      })
      return false
   })

   moveWave()

   function moveWave() {
      var $wave1 = $("#wave1")
      var $wave2 = $("#wave2")
      $wave2.css("display", "none")
      var speed = 0.5
      var wave1InitLeft = -15
      var wave2InitLeft = -90
      moveWave1()

      function moveWave1() {
         $wave1.css("display", "block")
         var rightThreshold = 168
         setTimeout(function() {
            var left = parseFloat($wave1.css("left"))
            if (left === rightThreshold) {
               $wave1.css("display", "none")
               $wave1.css("left", wave1InitLeft)
               setTimeout(moveWave2, 200)
            } else {
               left = left + speed
               if (left > rightThreshold) {
                  left = 1
               }
               $wave1.css("left", left + speed)
               moveWave1()
            }
         }, 16)
      }

      function moveWave2() {
         $wave2.css("display", "block")
         var rightThreshold = 90
         setTimeout(function() {
            var left = parseFloat($wave2.css("left"))
            if (left === rightThreshold) {
               $wave2.css("display", "none")
               $wave2.css("left", wave2InitLeft)
               setTimeout(moveWave1, 200)
            } else {
               left = left + speed
               if (left > rightThreshold) {
                  left = 1
               }
               $wave2.css("left", left + speed)
               moveWave2()
            }
         }, 16)
      }
   }
})