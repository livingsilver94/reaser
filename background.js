/**
 * Keeps track of tabs in which the user is doing a search.
 * key: tabId; value: TabSearch
 */
var activeTabs = new Map()

class TabSearch {
	constructor() {
		this.isSearching = false
		this._history = new Array()
	}

	addUrl(url) {
		this._history.push(url)
	}

	filterUrls(filter) {
		this._history = this._history.filter(filter)
	}

	hasUrls() {
		return this._history.length > 0
	}
}



browser.runtime.onMessage.addListener((message, sender) => {
	// If the page is loading, it's likely that the user is not interacting with it.
	// Any event that happens during this status is, again, likely programmatic.
	if (sender.tab.status !== "loading")
		activeTabs.get(sender.tab.id).isSearching = message.searching
})

browser.tabs.onCreated.addListener(tab => {
	activeTabs.set(tab.id, new TabSearch())
})

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
	searchInfo = activeTabs.get(tabId)
	if (changeInfo.url && searchInfo.isSearching) {
		searchInfo.addUrl(changeInfo.url)
		searchInfo.isSearching = false
	}
}, { urls: ["http://*/*", "https://*/*"], properties: ["status"] })

browser.tabs.onRemoved.addListener(tabId => {
	searchInfo = activeTabs.get(tabId)

	searchInfo.filterUrls(element => {
		browser.history.deleteUrl({ url: element })
			.then(() => {console.log(element); return false})
			.catch(() => true)
	})
	if (!searchInfo.hasUrls())
		activeTabs.delete(tabId)
	// Some URLs couldn't possibly be removed from history. We'll try again on browser close
})
