/**
 * Search detection module.
 *
 * @module
 */

/* Web pages can define search-purposed elements in infinite ways. The lack
of a standard procedure to do so makes us, sometimes, not to detect
elements that should be detected. Fortunately there are a bunch of common
practices that will limit the amount of false negatives. */


/**
 * Get attribute values for a given HTMLElement
 *
 * @param {HTMLElement} element - element to inspect
 * @param {string[]} attributes - array of attribute names
 * @returns {string[]} array of attribute values
 */
function attributes(element, attributes) {
	return attributes.map(attr => element.getAttribute(attr))
}

/**
 * Detect if the element is able to perform a search.
 *
 * @param {HTMLElement} el - element to inspect
 * @returns {boolean} whether the element can search
 */
export function isSearchElement(el) {
	if (!el) return false
	if (attributes(el, ["type", "role", "name", "id"]).includes("search")) return true
	if (el instanceof HTMLInputElement && el.getAttribute("name") === "q") return true
	return false
}
