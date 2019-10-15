import { TabSearch } from "./lib/tab_search"

/**
 * Keeps track of tabs in which the user is doing a search.
 * key: tabId; value: TabSearch
 */
var activeTabs = new Map()


browser.tabs.onCreated.addListener(tab => {
	activeTabs.set(tab.id, new TabSearch())
})

// OK VA BENE, VIENE LANCIATO **PRIMA** DELLO HISTORYUPDATE E PRIMA DEL DOMCONTENTLOADED
// ATTENZIONE: SE LA PAGINA USA LE HISTORY API, QUESTO NON VIENE LANCIATO. (ES. YOUTUBE)
browser.webNavigation.onBeforeNavigate.addListener((info) => {
	if (info.frameId !== 0) return
	if (!info.url.includes("?")) return
	const searchInfo = activeTabs.get(info.tabId)
	if (searchInfo.isSearching) {
		searchInfo.addUrl(info.url)
		console.debug("Added to history: ".concat(info.url))
		searchInfo.isSearching = false
	}
})

browser.webNavigation.onHistoryStateUpdated.addListener((info) => {
	if (info.frameId !== 0) return
	if (!info.url.includes("?")) return
	const searchInfo = activeTabs.get(info.tabId)
	if (searchInfo.hasUrl(info.url)) return
	console.debug(JSON.stringify(info))
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
