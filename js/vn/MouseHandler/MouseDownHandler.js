import {MouseHandler} from "./MouseHandler.js"

export class MouseDownHandler extends MouseHandler{
	constructor($b) {
		super($b)
	}

	getMouseDirect(){
		let which = this._event.which
		switch(which){
			case 1:
				return "left"
			case 2:
				return "middle"
			case 3:
				return "right"
			default:
         		throw new Error("unknown event.which = " + which)
		}
	}

	get which(){
		return this._event.which
	}

	get x(){
		return this.getCoord(this._event).x
	}

	get y(){
		return this.getCoord(this._event).y
	}

	get $target(){
		var $target = $(event.target)
		return $target
	}
}