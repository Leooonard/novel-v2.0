import {
	HostIPv4NetworkLayer
}
from "./HostIPv4NetworkLayer.js"

class RouteIPv4NetworkLayer extends HostIPv4NetworkLayer {
	constructor() {
		super()

		var info = {
			routeTable: [],
		}

		this.info = Object.assign({}, info)
		this._routeTable = undefined
	}

	get routeTable() {
		return this._routeTable
	}

	set routeTable(routeTable) {
		this._routeTable = routeTable
	}
}