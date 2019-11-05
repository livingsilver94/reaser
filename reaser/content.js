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
function trustedEvent(evtCallback) {
	return function(evt) {
		if (!evt.isTrusted) return
		evt.stopPropagation()
		evtCallback(evt)
	}
}

const handleFocused = trustedEvent(async evt => {
	if (!wasSearching) {
		await browser.runtime.sendMessage({ searching: true })
		wasSearching = true
	}
})

const handleUnfocused = trustedEvent(async evt => {
	// Don't send any message if we still are in the same parent
	// relatedTarget is the element that is gaining focus
	if (evt.currentTarget.contains(evt.relatedTarget)) return

	if (wasSearching) {
		await browser.runtime.sendMessage({ searching: false })
		wasSearching = false
	}
})

const handleChangedValue = trustedEvent(evt => {
	if (evt.target instanceof HTMLInputElement) {
		const type = evt.target.getAttribute("type")
		if (type === "text" || type === "search") searchKey = evt.target.value
	}
})


const srcElements = Array.from(document.querySelectorAll("form, input")).filter(el => isSearchElement(el))
for (const element of srcElements) {
	element.addEventListener("focusin", handleFocused)
	element.addEventListener("blur", handleUnfocused, true)
	element.addEventListener("input", handleChangedValue)
}

handleFocused(document.activeElement)
console.debug("Content loaded")

browser.runtime.onMessage.addListener(request => {
	if (request.searchStr) {
		return Promise.resolve(searchKey)
	}
})
