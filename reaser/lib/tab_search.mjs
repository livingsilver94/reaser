export class TabSearch {
	constructor() {
		this.isSearching = false
		this.searchParam = undefined
		this.lastUrl = undefined
		this._history = new Set()
	}

	addUrl(url) {
		const prevSize = this._history.size
		this._history.add(url)
		if (this._history.size !== prevSize) this.lastUrl = url
	}

	filterUrls(filter) {
		this._history.forEach(url => {
			if (filter(url)) this._history.delete(url)
		})
	}

	hasUrl(url) {
		return this._history.has(url)
	}

	hasUrls() {
		return this._history.length > 0
	}
}
