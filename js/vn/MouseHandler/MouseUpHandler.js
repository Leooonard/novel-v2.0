import {MouseHandler} from "./MouseHandler.js"

export class MouseUpHandler extends MouseHandler{
	constructor($b){
		super($b)
	}

	get which(){
		return this._event.which
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
}