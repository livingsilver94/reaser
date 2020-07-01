import { browser, WebNavigation, Runtime } from 'webextension-polyfill-ts'
import { TrackedTab } from "reaser/lib/tab"

/**
 * Keep track of open tabs and their search data.
 */
var activeTabs: Map<number, TrackedTab> = new Map()

/**
 * Return the parameter name whose value is `val`.
 *
 * @param url a URL with a query string
 * @param val the value of a parameter
 * @returns the name (key) of the parameter or undefined if no parameter is found.
 */
function paramKey(url: string, val: string): string | undefined {
	const params = (new URL(url)).searchParams
	for (const [key, paramVal] of params) {
		if (paramVal === val) { return key }
	}
	return undefined
}

/**
 * Return the second-level domain of a URL.
 *
 * @param url URL from which to extract the domain
 * @returns the domain name
 */
function domain(url: string): string {
	// FIXME: domains like *.co.uk
	const hostname = (new URL(url)).hostname.split(".")
	return hostname[hostname.length - 2]
}


const handleNewURL = async (
	update:
		WebNavigation.OnBeforeNavigateDetailsType |
		WebNavigation.OnHistoryStateUpdatedDetailsType) => {
	if (update.frameId !== 0 || !update.url.includes("?")) { return }

	const searchInfo = activeTabs.get(update.tabId)
	if (searchInfo == null || searchInfo.hasURL(update.url)) { return }

	let shouldAddURL = false
	if (searchInfo.isSearching) {
		shouldAddURL = true
		const searchStr: string = await browser.tabs.sendMessage(update.tabId, { searchStr: true })
		const searchQueryKey = paramKey(update.url, searchStr)
		if (searchQueryKey == undefined) { return }
		searchInfo.searchParam = [searchQueryKey, searchStr]
	} else {
		const params = (new URL(update.url)).searchParams
		const oldParam = searchInfo.searchParam
		if (domain(update.url) === domain(searchInfo.lastURL) && params.get(oldParam[0]) === oldParam[1]) {
			shouldAddURL = true
		}
	}
	if (shouldAddURL) {
		searchInfo.addURL(update.url)
		console.debug("Added to tracked URLs: ".concat(update.url))
	}
}

// Track already existing tabs when the addon is loaded
browser.tabs.query({})
	.then(tabs => {
		for (const tab of tabs) {
			if (tab.id == undefined) { continue }
			activeTabs.set(tab.id, new TrackedTab())
		}
	})
	.catch(() => console.error("Error on fetching open tabs. Only new tabs will be tracked."))

/** ************* Listeners ***************/
browser.tabs.onCreated.addListener(tab => {
	if (tab.id == undefined) { return }
	activeTabs.set(tab.id, new TrackedTab())
})

browser.runtime.onMessage.addListener((message: any, sender: Runtime.MessageSender) => {
	if (sender.tab == undefined || sender.tab.id == undefined) { return }

	console.debug(message)
	const tabID = sender.tab.id
	const searchInfo = activeTabs.get(tabID)
	if (searchInfo == undefined) { return }
	searchInfo.isSearching = message.searching
})

browser.webNavigation.onBeforeNavigate.addListener(handleNewURL)
browser.webNavigation.onHistoryStateUpdated.addListener(handleNewURL)

browser.tabs.onRemoved.addListener(async tabId => {
	const searchInfo = activeTabs.get(tabId)
	if (searchInfo == undefined) { return }

	for (const historyURL of searchInfo.URLs) {
		await browser.history.deleteUrl({ url: historyURL })
		searchInfo.removeURL(historyURL)
	}
	if (!searchInfo.hasURLs()) { activeTabs.delete(tabId) }
	// Some URLs may not have been removed. We'll try again on browser closure.
	// TODO: check if this is really necessary.
})

// window.addEventListener("beforeunload", async (_evt) => {
// 	for (const searchInfo of activeTabs.values()) {
// 		for (const historyURL of searchInfo.URLs) {
// 			await browser.history.deleteUrl({ url: historyURL })
// 		}
// 	}
// })

/** *********** End Listeners *************/
