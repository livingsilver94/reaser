import { isSearchElement } from "./lib/search_detection"
import { trustedEvent } from "./lib/trusted_event"

import { browser } from 'webextension-polyfill-ts'

/**
 * Keywords of the last search.
 */
let searchKey: string

/**
 * Tell if the user was interacting with a search-related element.
 */
let wasSearching: boolean

const handleFocused = trustedEvent(async (evt: FocusEvent) => {
	if (!wasSearching) {
		await browser.runtime.sendMessage({ searching: true })
		wasSearching = true
	}
})

const handleUnfocused = trustedEvent(async (evt: FocusEvent) => {
	if (evt.currentTarget == null) { return }

	// Don't send any message if we still are in the same parent.
	// relatedTarget is the element that is gaining focus.
	const currentTarget = evt.currentTarget as HTMLElement
	const relatedTarget = evt.relatedTarget as HTMLElement
	if (currentTarget.contains(relatedTarget)) { return }

	if (wasSearching) {
		await browser.runtime.sendMessage({ searching: false })
		wasSearching = false
	}
})

const handleChangedValue = trustedEvent((evt: InputEvent) => {
	if (evt.target instanceof HTMLInputElement) {
		const type = evt.target.getAttribute("type")
		if (type == "text" || type == "search") {
			searchKey = evt.target.value
		}
	}
})

const srcElements = Array.from(document.querySelectorAll("form, input")).filter(el => isSearchElement(el))
for (const element of srcElements) {
	element.addEventListener("focusin", handleFocused)
	element.addEventListener("blur", handleUnfocused, true)
	element.addEventListener("input", handleChangedValue)
}

console.debug("Content loaded")

browser.runtime.onMessage.addListener(request => {
	if (request.searchStr) {
		return Promise.resolve(searchKey)
	}
	return Promise.resolve()
})
