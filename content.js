// Web pages can define search-purposed elements in infinite ways. The lack
// of a standard procedure to do so makes us, sometimes, not to detect
// elements that should be detected. Fortunately there are a bunch of common
// practices that will limit the amount of false negatives.

var wasSearching = false

function isSearchElement(el) {
	if (!el) return false
	if (el.getAttribute("type") === "search" || el.getAttribute("role") === "search") return true
	return isSearchElement(el.form) || false
}

function handleFocused(element) {
	searches = isSearchElement(element)
	if (searches && !wasSearching) {
		browser.runtime.sendMessage({ "searching": true })
	}
	wasSearching = searches
}

var forms = document.querySelectorAll("form")
for (const form of forms) {
	form.addEventListener("focus", event => handleFocused(event.target), true)

	form.addEventListener("blur", event => {
		if (wasSearching) {
			browser.runtime.sendMessage({ "searching": false })
			wasSearching = false
		}
	}, true)
}

handleFocused(document.activeElement)
