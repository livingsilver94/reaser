import { isSearchElement } from "./lib/search_detection"

/**
 * Keywords of the last search.
 * @type {string}
 */
var searchKey

/**
 * Tell if the user was interacting with a search-related element.
 * @type {boolean}
 */
var wasSearching

// This will be a decorator in future
function bubblingEvent(evtCallback) {
	return function(evt) {
		if (!evt.isTrusted) return
		evt.stopPropagation()
		evtCallback(evt)
	}
}

const handleFocused = bubblingEvent(async evt => {
	if (!wasSearching) {
		await browser.runtime.sendMessage({ searching: true })
		wasSearching = true
	}
})

const handleUnfocused = bubblingEvent(async evt => {
	if (wasSearching) {
		await browser.runtime.sendMessage({ searching: false })
		wasSearching = false
	}
})

const handleChangedValue = bubblingEvent(evt => {
	const type = evt.target.getAttribute("type")
	if (evt.target instanceof HTMLInputElement && (type === "text" || type === "search")) {
		searchKey = evt.target.value
	}
})


const srcElements = Array.from(document.querySelectorAll("form, input")).filter(el => isSearchElement(el))
for (const element of srcElements) {
	element.addEventListener("focusin", handleFocused)
	element.addEventListener("focusout", handleUnfocused)
	element.addEventListener("input", handleChangedValue)
}

handleFocused(document.activeElement)
console.debug("Content loaded")

browser.runtime.onMessage.addListener(request => {
	if (request.searchStr) {
		return Promise.resolve(searchKey)
	}
})
