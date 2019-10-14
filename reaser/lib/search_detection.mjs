/* Web pages can define search-purposed elements in infinite ways. The lack
of a standard procedure to do so makes us, sometimes, not to detect
elements that should be detected. Fortunately there are a bunch of common
practices that will limit the amount of false negatives. */

var wasSearching = false

function attributes(element, attributes) {
	return attributes.map(attr => element.getAttribute(attr))
}

export function isSearchElement(el) {
	if (!el) return false
	if (attributes(el, ["type", "role", "name", "id"]).includes("search")) return true
	if (el instanceof HTMLInputElement && el.getAttribute("name") === "q") return true

	const form = el.closest("form"); if (form === el) return false
	return isSearchElement(form)
}

export async function handleFocused(element) {
	const searches = isSearchElement(element)
	if (searches && !wasSearching) {
		await browser.runtime.sendMessage({ searching: true })
	}
	wasSearching = searches
}

export async function handleBlurred() {
	if (wasSearching) {
		await browser.runtime.sendMessage({ searching: false })
		wasSearching = false
	}
}
