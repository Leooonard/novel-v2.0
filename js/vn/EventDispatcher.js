import {Manager} from "./Manager.js"

class EventDispatcher {
   constructor() {
      this._eventDeviceMap = new Map()
   }

   on(eventName, device, callback){
      if(this._eventDeviceMap.has(eventName)){
         this._eventDeviceMap.get(eventName).set(device, callback)
      }else{
         let deviceMap = new Map()
         deviceMap.set(device, callback)
         this._eventDeviceMap.set(eventName, deviceMap)
      }
   }

   dispatch(eventName, $target, args){
      if(this._eventDeviceMap.has(eventName)){
         let deviceMap = this._eventDeviceMap.get(eventName)
         let device = $target
         if(!deviceMap.has(device)){
            if(device instanceof jQuery){
               device = Manager.getDeviceByElement($target)
            }else{
               return
            }
         }
         let callback = this._eventDeviceMap.get(eventName).get(device)
         callback.call(device, args)

         this.logDispatch(eventName, device)
      }
   }

   broadcast(eventName, args){
      if(this._eventDeviceMap.has(eventName)){
         let deviceMap = this._eventDeviceMap.get(eventName)
         let deviceArray = [...deviceMap.entries()]
         for(let i = 0 ; i < deviceArray.length ; i++){
            let device =  deviceArray[i][0]
            let callback = deviceArray[i][1]
            callback.call(device, args)
         }
         this.logBroadcast(eventName)
      }
   }

   logDispatch(eventName, device){
      console.log(eventName + " fired by device " + device.getID())
   }

   logBroadcast(eventName){
      console.log(eventName + " broadcast by device ")
   }
}

export let eventDispatcher = new EventDispatcher()
