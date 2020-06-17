import { browser } from 'webextension-polyfill-ts'
import { isSearchElement } from "./lib/search_detect"

/**
 * Keywords of the last search.
 */
let searchKey: string

/**
 * Tell if the user was interacting with a search-related element.
 */
let isUserSearching: boolean

const handleFocused = async (_: FocusEvent) => {
	if (!isUserSearching) {
		await browser.runtime.sendMessage({ searching: true })
		isUserSearching = true
	}
}

const handleUnfocused = async (evt: FocusEvent) => {
	if (evt.currentTarget == null) { return }

	// Don't send any message if we still are in the same parent.
	// relatedTarget is the element that is gaining focus.
	const currentTarget = evt.currentTarget as HTMLElement
	const relatedTarget = evt.relatedTarget as HTMLElement
	if (currentTarget.contains(relatedTarget)) { return }

	if (isUserSearching) {
		await browser.runtime.sendMessage({ searching: false })
		isUserSearching = false
	}
}

const handleChangedValue = (evt: Event) => {
	if (evt.target instanceof HTMLInputElement) {
		const type = evt.target.getAttribute("type")
		if (type == "text" || type == "search") {
			searchKey = evt.target.value
		}
	}
}

Array.from(document.querySelectorAll<HTMLElement>("form, input"))
	.filter(el => isSearchElement(el))
	.forEach(el => {
		el.addEventListener("focusin", handleFocused)
		el.addEventListener("blur", handleUnfocused, true)
		if (el instanceof HTMLInputElement) {
			el.addEventListener("input", handleChangedValue)
		}
	})

browser.runtime.onMessage.addListener(request => {
	if (request.searchStr) {
		return Promise.resolve(searchKey)
	}
	return Promise.resolve()
})
