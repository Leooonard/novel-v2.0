class BaseLayer {
	constructor() {
		this.info = {
			name: undefined,
		}
	}

	set layerInfo(info) {
		for (var attr of this.info) {
			if (info[attr] !== undefined) {
				this.info[attr] = info[attr]
			}
		}
	}

	get layerInfo() {
		return this.info
	}
}