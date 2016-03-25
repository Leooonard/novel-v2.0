import {
   UniqueIDManager
}
from "../UniqueIDManager.js"
import {
   CircleView
}
from "../view/CircleView.js"
import {
   CircleCoordManager
}
from "../CoordManager/CircleCoordManager.js"
import {
   eventDispatcher
}
from "../EventDispatcher.js"

export class Circle {
   constructor(x, y, width) {
      width = width || 300
      this._viewManager = new CircleView()
      this._viewManager.width = width
      this._coordManager = new CircleCoordManager(this._viewManager.width, 50)
      this._id = UniqueIDManager.getUniqueID()
      this._viewManager.setID(this._id)
      this.setCoord(x, y)
   }

   setCoord(x, y) {
      this._coordManager.setCoord(x, y)
      this._viewManager.setCoord(this._coordManager.x, this._coordManager.y)
   }

   updateCoord(dx, dy){
      this._coordManager.updateCoord(dx, dy)
      this._viewManager.setCoord(this._coordManager.x, this._coordManager.y)
   }

   getView(){
      return this._viewManager.getView()
   }

   getID(){
      return this._id
   }

   get width(){
      return this._viewManager.width
   }

   set width(w){
      this._viewManager.width = w
      this._coordManager.width = w
   }

   get x(){
      return this._coordManager.x
   }

   get y(){
      return this._coordManager.y
   }
}