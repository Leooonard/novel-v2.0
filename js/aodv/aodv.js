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

   let sourceDevice = Manager.generateDevice()
   sourceDevice.setName("源设备")
   sourceDevice.setCoord(100, 100)
   Manager.appendDevice(sourceDevice)

   let targetDevice = Manager.generateDevice()
   targetDevice.setName("目标设备")
   targetDevice.setCoord(200, 100)
   Manager.appendDevice(targetDevice)

   let $addDevice = $("#addDevice")
   $addDevice.on("click", function(event) {
      let device = Manager.generateDevice()
      Manager.appendDevice(device)
   })

   let $startExperiment = $("#startExperiment")
   $startExperiment.on("click", function(){
      let data = Manager.exportData()
      let dataString = JSON.stringify(data)
      let url = "./aodvStartExperiment"
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
      let url = "./aodvSaveExperiment"
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
      let url = "./aodvLoadExperiment"
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