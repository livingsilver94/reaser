import { TabSearch } from "./lib/tab_search"

/**
 * Keeps track of tabs in which the user is doing a search.
 * key: tabId; value: TabSearch
 */
var activeTabs = new Map()


browser.tabs.onCreated.addListener(tab => {
	activeTabs.set(tab.id, new TabSearch())
})

browser.runtime.onMessage.addListener((message, sender) => {
	console.debug(message)
	const searchInfo = activeTabs.get(sender.tab.id)
	searchInfo.isSearching = message.searching
})

browser.webNavigation.onBeforeNavigate.addListener((info) => {
	if (info.frameId !== 0) return
	if (!info.url.includes("?")) return

	const searchInfo = activeTabs.get(info.tabId)
	if (searchInfo.isSearching && !searchInfo.hasUrl(info.url)) {
		searchInfo.addUrl(info.url)
		console.debug("Added to history: ".concat(info.url))
	}
})

browser.webNavigation.onHistoryStateUpdated.addListener((info) => {
	if (info.frameId !== 0) return
	if (!info.url.includes("?")) return

	const searchInfo = activeTabs.get(info.tabId)
	if (searchInfo.isSearching && !searchInfo.hasUrl(info.url)) {
		searchInfo.addUrl(info.url)
		console.debug("Added to history: ".concat(info.url))
	}
// 	searchInfo.isSearching = false
})

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
