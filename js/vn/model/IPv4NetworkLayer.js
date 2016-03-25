class IPv4NetworkLayer extends NetworkLayer {
	constructor() {
		super()
		var info = {
			ip: undefined,
			mask: undefined,
			target: undefined,
		}
		this.info = Object.assign({}, info)
	}
}