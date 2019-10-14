// Web pages can define search-purposed elements in infinite ways. The lack
// of a standard procedure to do so makes us, sometimes, not to detect
// elements that should be detected. Fortunately there are a bunch of common
// practices that will limit the amount of false negatives.

var wasSearching = false

export function isSearchElement(el) {
	if (!el) return false
	if (el.getAttribute("type") === "search" || el.getAttribute("role") === "search") return true
	return isSearchElement(el.closest("form")) || false
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
