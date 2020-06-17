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
	if (isUserSearching) { return }

	await browser.runtime.sendMessage({ searching: true })
	isUserSearching = true
}

const handleUnfocused = async (evt: FocusEvent) => {
	if (evt.currentTarget == null) { return }
	if (!isUserSearching) { return }

	// Don't send any message if we still are in the same parent.
	// relatedTarget is the element that is gaining focus.
	const currentTarget = evt.currentTarget as Node
	const relatedTarget = evt.relatedTarget as Node
	if (currentTarget.contains(relatedTarget)) { return }

	await browser.runtime.sendMessage({ searching: false })
	isUserSearching = false
}

const handleChangedValue = (evt: Event) => {
	if (evt.target == null) {return}

	const inputElement = evt.target as HTMLInputElement
	const type = inputElement.getAttribute("type")
	if (type == "text" || type == "search") {
		searchKey = inputElement.value
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
