export class CoordManager {
   constructor() {
      this._x = 0
      this._y = 0
   }

   setCoord(x, y) {
      this._x = parseFloat(x)
      this._y = parseFloat(y)
   }

   updateCoord(dx, dy){
      this._x += dx
      this._y += dy
   }

   inDistance(x, y){
      const DistanceThreshold = 150
      let xDistance = Math.pow(this._x - x, 2)
      let yDistance = Math.pow(this._y - y, 2)
      let distance = Math.pow(xDistance + yDistance, 0.5)
      if(distance < DistanceThreshold){
         return true
      }else{
         return false
      }
   }

   get x() {
      return this._x
   }

   get y() {
      return this._y
   }
}