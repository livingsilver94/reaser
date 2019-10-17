export class TabSearch {
	constructor() {
		this.isSearching = false
		this._history = new Set()
	}

	addUrl(url) {
		this._history.add(url)
	}

	hasUrl(url) {
		return this._history.has(url)
	}

	hasUrls() {
		return this._history.length > 0
	}

	filterUrls(filter) {
		this._history.forEach(url => {
			if (filter(url)) this._history.delete(url)
		})
	}
}
