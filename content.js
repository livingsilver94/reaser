// Web pages can define search-purposed elements in infinite ways. The lack
// of a standard procedure to do so makes us, sometimes, not to detect
// elements that should be detected. Fortunately there are a bunch of common
// practices that will limit the amount of false negatives.


function isSearchElement(element) {
	if (!element) return false
	if (element.getAttribute("role") === "search" || element.getAttribute("type") === "search") return true
	return isSearchElement(element.form)
}

browser.runtime.onMessage.addListener(message => {
	if (message === "does-focused-element-search") {
		return Promise.resolve(isSearchElement(document.activeElement))
	}
})
