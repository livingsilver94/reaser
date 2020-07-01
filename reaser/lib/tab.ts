/** Track search-related URLs for a browser tab. */
export class TrackedTab {
	isSearching: boolean
	// Named tuples are expected in TypeScript 4.0.
	searchParam: [string, string]
	lastURL: string
	readonly URLs: Iterable<string>
	private history: Set<string>

	constructor() {
		this.isSearching = false
		this.searchParam = ["", ""]
		this.lastURL = ""
		this.history = new Set()
		this.URLs = this.history
	}

	/**
	 * Add a URL to the tab search history.
	 * @param url any URL
	 */
	addURL(url: string) {
		const prevSize = this.history.size
		this.history.add(url)
		if (this.history.size != prevSize) { this.lastURL = url }
	}

	/**
	 * Check if a URL is in the tab search history.
	 * @param url URL to check
	 * @returns whether the URL is tracked
	 */
	hasURL(url: string): boolean {
		return this.history.has(url)
	}

	/**
	 * Check if there are URLs in the tab search history.
	 * @returns whether the search history has at least one URL
	 */
	hasURLs(): boolean {
		return this.history.size > 0
	}

	/**
	 * Remove a URL from the tab search history.
	 * @param url URL to remove
	 */
	removeURL(url: string): boolean {
		return this.history.delete(url)
	}
}
