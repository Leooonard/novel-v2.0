import {Device} from "./Device/Device.js"
import {Circle} from "./Device/Circle.js"
import {zIndexManager} from "./ZIndexManager.js"
import {AnimationManager} from "./AnimationManager.js"

let deviceArray = []
let $board = undefined
let animationManager = undefined

export class Manager {
   static setBoard($b){
      $board = $b
      animationManager = new AnimationManager($board)
   }

   static clearBoard(){
      for(let i = 0 ; i < deviceArray.length ; i++){
         let device = deviceArray[i]
         device.remove()
         zIndexManager.remove(device)
      }
      deviceArray = []
   }

   static initBoardByData(dataArray){
      for(let i = 0 ; i < dataArray.length ; i++){
         let data = dataArray[i]
         let device = Manager.generateDevice()
         device.setName(data.name)
         device.setCoord(data.x, data.y)
         Manager.appendDevice(device)
      }
   }

   static generateDevice() {
      var device = new Device()
      deviceArray.push(device)
      device.setCoord(200, 200)
      device.setName("设备" + deviceArray.length)
      return device
   }

   static generateCircle(x, y){
      let circle = new Circle(x, y)
      deviceArray.push(circle)
      return circle
   }

   static appendDevice(device){
      $board.append(device.getView())
      zIndexManager.put(device)
   }

   static appendCircle(circle){
      $board.append(circle.getView())
      zIndexManager.put(circle)
   }

   static removeCircle(circle){
      for(let i = 0 ; i < deviceArray.length ; i++){
         let device = deviceArray[i]
         if(device.getID() === circle.getID()){
            let $element = $("[data-id=" + circle.getID() + "]")
            $element.remove()
            zIndexManager.remove(circle)
            arrayRemoveAt(deviceArray, i)
            return
         }
      }
   }

   static getDeviceByElement($element){
      let id = $element.attr("data-id")
      for(var i = 0 ; i < deviceArray.length ; i++){
         let device = deviceArray[i]
         if(device.getID() === id){
            return device
         }
      }
      throw new Error("unknown $element(id = " + id + ")")
   }

   static playAnimation(animationArray){
      animationManager.play(deviceArray, animationArray)
   }

   static exportData(){
      let dataArray = []
      for(let i = 0 ; i < deviceArray.length ; i++){
         let device = deviceArray[i]
         let x = device.x
         let y = device.y
         let index = i
         let data = {
            x,
            y,
            index,
         }
         dataArray.push(data)
      }
      return dataArray
   }
}

function arrayRemoveAt(array, index){
   array.splice(index, 1)
}