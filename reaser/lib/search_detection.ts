/* Web pages can define search-purposed elements in infinite ways.
 * The lack of a standard procedure to do so makes us, sometimes, not to detect
 * elements that should be detected.
 * Fortunately there are a bunch of common practices that will limit
 * the amount of false negatives. */


/**
 * Get attribute values for a given HTMLElement
 *
 * @param element element to inspect
 * @param attributes array of attribute names
 * @returns array of attribute values
 */
function attributes(element: HTMLElement, attributes: string[]): string[] {
	const presentAttrs: string[] = []
	for (const attribute of attributes) {
		const attrVal = element.getAttribute(attribute)
		if (attrVal != null) {
			presentAttrs.push(attrVal)
		}
	}
	return presentAttrs
}

/**
 * Detect if the element is able to perform a search.
 *
 * @param el element to inspect
 * @returns whether the element can search
 */
export function isSearchElement(el: HTMLElement): boolean {
	if (attributes(el, ["type", "role", "name", "id"]).includes("search")) { return true }
	if (el instanceof HTMLInputElement && el.getAttribute("name") === "q") { return true }
	return false
}
