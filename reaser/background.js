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

function handlePageUpdate(details) {
	// We don't care of iframes, only tabs
	if (details.frameId !== 0) return

	const searchInfo = activeTabs.get(details.tabId)
	if (searchInfo.isSearching) {
		searchInfo.isNewPage = true
		searchInfo.isSearching = false
		searchInfo.addUrl(details.url)
		console.debug(details.url)
	}
}

browser.tabs.onCreated.addListener(tab => {
	activeTabs.set(tab.id, new TabSearch())
})

browser.runtime.onMessage.addListener((message, sender) => {
	// We ignore messages coming from a page we're leaving as they're not relevant
	const searchInfo = activeTabs.get(sender.tab.id)
	if (sender.tab.status === "loading" && !searchInfo.isNewPage) return

	console.debug(message)
	searchInfo.isNewPage = false
	searchInfo.isSearching = message.searching
})

browser.webNavigation.onDOMContentLoaded.addListener(handlePageUpdate)
browser.webNavigation.onHistoryStateUpdated.addListener(handlePageUpdate)

browser.tabs.onRemoved.addListener(tabId => {
	const searchInfo = activeTabs.get(tabId)

	searchInfo.filterUrls(async element => {
		try {
			await browser.history.deleteUrl({ url: element })
			return false
		} catch (_) { return true }
	})
	if (!searchInfo.hasUrls()) { activeTabs.delete(tabId) }
	// TODO: Some URLs couldn't possibly be removed from history. We'll try again on browser close
})
