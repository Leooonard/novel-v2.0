import {
   MouseHandler
}
from "./MouseHandler.js"

export class MouseMoveHandler extends MouseHandler {
   constructor($b) {
      super($b)
   }

   store(event) {
      //第一次触发move事件后，坐标的更新就通过上次event对象来进行。
      if (this._event !== undefined) {
         let coord = this.getCoord(this._event)
         this.setLastCoord(coord.x, coord.y)
      }

      this.storeEvent(event)
   }

   get lastX() {
      return this._x
   }

   get lastY() {
      return this._y
   }

   get x() {
      return this.getCoord(this._event).x
   }

   get y() {
      return this.getCoord(this._event).y
   }

   get dx() {
      return this.x - this.lastX
   }

   get dy() {
      return this.y - this.lastY
   }

   hasLastCoord() {
      if (this._lastCoord === undefined) {
         return false
      } else {
         return true
      }
   }

   setLastCoord(x, y) {
      this._x = x
      this._y = y
   }
}