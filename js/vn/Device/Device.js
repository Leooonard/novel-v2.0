import {
   UniqueIDManager
}
from "../UniqueIDManager.js"
import {
   DeviceView
}
from "../view/DeviceView.js"
import {
   CoordManager
}
from "../CoordManager/CoordManager.js"
import {
   eventDispatcher
}
from "../EventDispatcher.js"

import {Manager} from "../Manager.js"

export class Device {
   constructor() {
      this._viewManager = new DeviceView()
      this._coordManager = new CoordManager()
      this._id = UniqueIDManager.getUniqueID()
      this._viewManager.setID(this._id)
      this._viewManager.setName("设备")
      
      eventDispatcher.on("ZIndexUpdate", this, this.updateZIndex)
      eventDispatcher.on("MouseMove", this, this.updateCoord)
      eventDispatcher.on("MouseOver", this, this.updateHoverView)
      eventDispatcher.on("MouseOut", this, this.updateNormalView)
      eventDispatcher.on("LeftMouseDown", this, this.updateNormalView)
      eventDispatcher.on("DistanceCheck", this, this.distanceCheck)
      eventDispatcher.on("UnDistanceCheck", this, this.unDistanceCheck)
   }

   remove(){
      this._viewManager.getView().remove()
   }
   
   setName(name){
      this._viewManager.setName(name)
   }

   setCoord(x, y) {
      this._coordManager.setCoord(x, y)
      this._viewManager.setCoord(this._coordManager.x, this._coordManager.y)
   }
   
   getView() {
      return this._viewManager.getView()
   }
   
   getID() {
      return this._id
   }

   updateZIndex(zIndex) {
      this._viewManager.updateZIndex(zIndex)
   }

   updateCoord(coordArg) {
      this._coordManager.updateCoord(coordArg.dx, coordArg.dy)
      this._viewManager.setCoord(this._coordManager.x, this._coordManager.y)
   }

   updateHoverView(){
      const HoverClassName = "DeviceHover"
      this._viewManager.addClass(HoverClassName)
      this._circle = Manager.generateCircle(this._coordManager.x, this._coordManager.y)
      Manager.appendCircle(this._circle)
      eventDispatcher.broadcast("DistanceCheck", {
         x: this._coordManager.x,
         y: this._coordManager.y,
         device: this,
      })
   }

   updateNormalView(){
      const HoverClassName = "DeviceHover"
      this._viewManager.removeClass(HoverClassName)
      Manager.removeCircle(this._circle)
      this._circle = undefined
      eventDispatcher.broadcast("UnDistanceCheck")
   }

   distanceCheck(args){
      const InDistanceClassName = "InDistance"

      if(this === args.device){
         return
      }else{
         if(this._coordManager.inDistance(args.x, args.y)){
            this._viewManager.addClass(InDistanceClassName)
         }
      }
   }

   unDistanceCheck(){
      const InDistanceClassName = "InDistance"
      this._viewManager.removeClass(InDistanceClassName)
   }

   get x(){
      return this._coordManager.x
   }

   get y(){
      return this._coordManager.y
   }

   get name(){
      return this._viewManager.name
   }
}