import {CoordManager} from "./CoordManager.js"

export class CircleCoordManager extends CoordManager{
	constructor(circleWidth, deviceWidth){
		super()
		this._circleWidth = circleWidth
		this._deviceWidth = deviceWidth
	}

   setCoord(x, y){
      super.setCoord(x, y)
      this._x -= (this._circleWidth - this._deviceWidth) / 2
      this._y -= (this._circleWidth - this._deviceWidth) / 2
   }

   set width(width){
   	this._circleWidth = width
   }
}