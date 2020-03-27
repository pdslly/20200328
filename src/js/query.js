function query(selector) {
	return new query.fn.init(selector)
}

query.fn = query.prototype = {
	init(selector) {
		let el = null
		if (selector instanceof EventTarget) {
			el = selector
		} else if (typeof selector === 'string') {
			el = document.querySelector(selector)
		} else {
			console.error('-ERR: invalid selector')
			return false
		}
		this.el = el
		return this
	},
	bind(event, fn, isCatch = false) {
		this.el.addEventListener(event, fn, !!isCatch)
		return this
	}
}

query.fn.init.prototype = query.fn

export default query