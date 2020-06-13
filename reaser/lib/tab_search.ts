/** Track search-related URLs for a browser tab. */
export class TabSearch {
	isSearching: boolean
	searchParam
	lastURL: string
	private history: Set<string>

	constructor() {
		this.isSearching = false
		this.searchParam = undefined
		this.lastURL = ""
		this.history = new Set()
	}

	/**
	 * Add a URL to the tab search history.
	 *
	 * @param url any URL
	 */
	addURL(url: string) {
		const prevSize = this.history.size
		this.history.add(url)
		if (this.history.size !== prevSize) this.lastURL = url
	}

	/**
	 * Filter the tracked URLs with a function.
	 *
	 * @param filter filtering function
	 * @see Array filtering for an identical usage.
	 */
	filterURLs(filter: (x: string) => boolean) {
		this.history.forEach(url => {
			if (filter(url)) this.history.delete(url)
		})
	}

	/**
	 * Check if `url` is in the tab search history.
	 *
	 * @param url URL to check
	 * @returns whether the URL is tracked
	 */
	hasURL(url: string): boolean {
		return this.history.has(url)
	}

	/**
	 * Check if there are URLs tracked.
	 *
	 * @returns whether the search history has URL(s)
	 */
	hasURLs(): boolean {
		return this.history.size > 0
	}

	*[Symbol.iterator]() { return this.history[Symbol.iterator] }
}
