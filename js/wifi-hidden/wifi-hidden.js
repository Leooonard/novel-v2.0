import {
   Manager
}
from "../vn/Manager.js"

import {
   registerBoard
}
from "../vn/Board.js"

$(function() {
   let $board = $("#experimentBoard")
   registerBoard($board)
   Manager.setBoard($board)

   let sendDevice1 = Manager.generateDevice()
   sendDevice1.setName("发送设备1")
   sendDevice1.setCoord(100, 100)
   Manager.appendDevice(sendDevice1)

   let sendDevice2 = Manager.generateDevice()
   sendDevice2.setName("发送设备2")
   sendDevice2.setCoord(300, 100)
   Manager.appendDevice(sendDevice2)

   let receiveDevice = Manager.generateDevice()
   receiveDevice.setName("接收设备")
   receiveDevice.setCoord(200, 100)
   Manager.appendDevice(receiveDevice)

   let $startExperiment = $("#startExperiment")
   $startExperiment.on("click", function(){
      let data = Manager.exportData()
      let dataString = JSON.stringify(data)
      let url = "./wifiHiddenStartExperiment"
      $.post(url, dataString).done(function(response){
         if(!!response.ok){
            alert("执行成功")
            let resultArray = response.result
            let $resultPanel = $("#resultPanel")
            for(let i = 0 ; i < resultArray.length ; i++){
               let result = resultArray[i]
               let $result = $("<p></p>")
               $result.text(result)
               $resultPanel.append($result)
            }
            let pcapArray = response.pcap
            let $pcapPanel = $("#pcapPanel")
            for(let i = 0 ; i < pcapArray.length ; i++){
               let pcap = pcapArray[i]
               let $pcap = $("<a></a>")
               $pcap.text((i + 1) + ".下载")
               $pcap.attr("href", pcap)
               $pcapPanel.append($pcap)
            }
            let traceArray = response.trace
            let $tracePanel = $("#tracePanel")
            for(let i = 0 ; i < traceArray.length ; i++){
               let trace = traceArray[i]
               let $trace = $("<p></p>")
               $trace.text(trace)
               $tracePanel.append($trace)
            }
         }else{
            alert("执行失败")
         }
      }).fail(function(){
         alert("执行失败")
      })
   })

   let $saveExperiment = $("#saveExperiment")
   $saveExperiment.on("click", function(){
      let data = Manager.exportData()
      let dataString = JSON.stringify(data)
      let url = "./saveExperiment"
      $.post(url, dataString).done(function(response){
         if(!!response.ok){
            alert("保存成功")
         }else{
            alert("保存失败")
         }
      }).fail(function(response){
         alert("保存失败")
      })
   })

   let $loadExperiment = $("#loadExperiment")
   $loadExperiment.on("click", function(){
      let url = "./loadExperiment"
      $.get(url).done(function(response){
         if(!!response.ok){
            alert("保存成功")
            Manager.clearBoard()
            Manager.initBoardByData(response.data)
         }else{
            alert("保存失败")
         }
      }).fail(function(response){
         alert("读取失败")
      })
   })
})