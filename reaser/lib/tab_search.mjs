/** @module */

/** Track search-related URLs for a browser tab. */
export class TabSearch {
	/** Instantiate the class. */
	constructor() {
		this.isSearching = false
		this.searchParam = undefined
		this.lastUrl = undefined
		this._history = new Set()
	}

	/**
	 * Add a URL to the tab search history.
	 *
	 * @param {string} url - any URL
	 */
	addUrl(url) {
		const prevSize = this._history.size
		this._history.add(url)
		if (this._history.size !== prevSize) this.lastUrl = url
	}

	/**
	 * Filter the tracked URLs with a function.
	 *
	 * @param {(url: string) => boolean} filter - filtering function
	 * @see Array filtering for an identical usage.
	 */
	filterUrls(filter) {
		this._history.forEach(url => {
			if (filter(url)) this._history.delete(url)
		})
	}

	/**
	 * Check if `url` is in the tab search history.
	 *
	 * @param {string} url - URL to check
	 * @returns {boolean} whether the URL is tracked
	 */
	hasUrl(url) {
		return this._history.has(url)
	}

	/**
	 * Check if there are URLs tracked.
	 *
	 * @returns {boolean} whether the search history has URL(s)
	 */
	hasUrls() {
		return this._history.size > 0
	}
}
