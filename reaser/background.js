/**
 * Keeps track of tabs in which the user is doing a search.
 * key: tabId; value: TabSearch
 */
var activeTabs = new Map()

class TabSearch {
	constructor() {
		this.isSearching = false
		this.isNewPage = true
		this._history = []
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
	// We want to ignore messages coming from a tab that is loading *after*
	// a "complete" state. During such an event in fact some page script may run
	// so any message is likely not originating from user's inputs.
	const searchInfo = activeTabs.get(sender.tab.id)
	if (sender.tab.status === "loading" && !searchInfo.isNewPage) {
		return
	}
	searchInfo.isSearching = message.searching
})

browser.tabs.onCreated.addListener(tab => {
	activeTabs.set(tab.id, new TabSearch())
})

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
	const searchInfo = activeTabs.get(tabId)

	searchInfo.isNewPage = (changeInfo.status === "loading" && changeInfo.url)

	if (changeInfo.url && searchInfo.isSearching) {
		searchInfo.addUrl(changeInfo.url)
		searchInfo.isSearching = false
	}
}, { urls: ["http://*/*", "https://*/*"], properties: ["status"] })

browser.tabs.onRemoved.addListener(tabId => {
	const searchInfo = activeTabs.get(tabId)

	searchInfo.filterUrls(element => {
		browser.history.deleteUrl({ url: element })
			.then(() => { console.debug(element); return false })
			.catch(() => true)
	})
	if (!searchInfo.hasUrls()) { activeTabs.delete(tabId) }
	// Some URLs couldn't possibly be removed from history. We'll try again on browser close
})
