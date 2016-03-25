class RouteTableRow {
	constructor(){
		this._info = {
			target: undefined,
			mask: undefined,
			nextHop: undefined,
		}
	}

	get info(){
		return this._info
	}

	set info(row){
		for (var attr of this.info) {
			if (row[attr] !== undefined) {
				this.info[attr] = info[attr]
			}
		}
	}
}