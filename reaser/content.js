// Web pages can define search-purposed elements in infinite ways. The lack
// of a standard procedure to do so makes us, sometimes, not to detect
// elements that should be detected. Fortunately there are a bunch of common
// practices that will limit the amount of false negatives.

export var wasSearching = false

export function isSearchElement(el) {
	if (!el) return false
	if (el.getAttribute("type") === "search" || el.getAttribute("role") === "search") return true
	return isSearchElement(el.form) || false
}

export function handleFocused(element) {
	const searches = isSearchElement(element)
	if (searches && !wasSearching) {
		browser.runtime.sendMessage({ searching: true })
	}
	wasSearching = searches
}

export function handleBlurred() {
	if (wasSearching) {
		browser.runtime.sendMessage({ searching: false })
		wasSearching = false
	}
}


var forms = document.querySelectorAll("form")
for (const form of forms) {
	form.addEventListener("focus", event => handleFocused(event.target), true)
	form.addEventListener("blur", handleBlurred, true)
}
handleFocused(document.activeElement)
