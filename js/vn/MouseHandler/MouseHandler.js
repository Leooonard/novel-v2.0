export class MouseHandler{
	constructor($b){
		this._$board = $b
	}

	store(event){
		this.storeEvent(event)
	}

	storeEvent(event){
		this._event = event
	}

	restore(){
		this.restoreEvent()
	}

	restoreEvent(){
		this._event = undefined
	}

	getCoord(event) {
		var offset = this._$board.offset()
		var x = event.clientX - offset.left
		var y = event.clientY - offset.top
		return {
			x,
			y,
		}
	}
}	