import { TabSearch } from "./lib/tab_search"

/**
 * Keep track of open tabs and their search data.
 * @type {Map<number, TabSearch>}
 */
var activeTabs = new Map()

/**
 * Return the parameter name whose value is `val`.
 * @param {string} url - a URL with a query string
 * @param {string} val - the value of a parameter
 * @return {string} the name (key) of the parameter
 */
function paramKey(url, val) {
	const params = (new URL(url)).searchParams
	for (const [key, paramVal] of params) {
		if (paramVal === val) return key
	}
}

/**
 * Return the second-level domain of a URL.
 * @param {string} url
 * @return {string} the domain name
 */
function domain(url) {
	// FIXME: domains like *.co.uk
	const hostname = (new URL(url)).hostname.split(".")
	return hostname[hostname.length - 2]
}

async function handleNewUrl(update) {
	if (update.frameId !== 0 || !update.url.includes("?")) return

	const searchInfo = activeTabs.get(update.tabId)
	if (searchInfo.hasUrl(update.url)) return

	if (searchInfo.isSearching) {
		searchInfo.addUrl(update.url)
		console.debug("Added to history: ".concat(update.url))
		const searchStr = await browser.tabs.sendMessage(update.tabId, { searchStr: true })
		searchInfo.searchParam = { key: paramKey(update.url, searchStr), value: searchStr }
	} else {
		const params = (new URL(update.url)).searchParams
		const oldParam = searchInfo.searchParam
		if (domain(update.url) === domain(searchInfo.lastUrl) && params.get(oldParam.key) === oldParam.value) {
			searchInfo.addUrl(update.url)
			console.debug("Added to history: ".concat(update.url))
		}
	}
}


browser.tabs.onCreated.addListener(tab => {
	activeTabs.set(tab.id, new TabSearch())
})

browser.runtime.onMessage.addListener((message, sender) => {
	console.debug(message)
	const searchInfo = activeTabs.get(sender.tab.id)
	searchInfo.isSearching = message.searching
})

browser.webNavigation.onBeforeNavigate.addListener(handleNewUrl)
browser.webNavigation.onHistoryStateUpdated.addListener(handleNewUrl)

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
