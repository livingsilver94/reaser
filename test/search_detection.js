import { isSearchElement } from "../reaser/lib/search_detection"

/**
 * Create an HTMLElement
 *
 * @param {string} name - element name (input, form...)
 * @param {string} attrName - optional attribute name to set
 * @param {string} attrValue - optional attribute value to set
 * @returns {HTMLElement} the HTML element
 */
function createElement(name, attrName, attrValue) {
	const el = document.createElement(name)
	if (attrName && attrValue) el.setAttribute(attrName, attrValue)
	return el
}

describe.each([[createElement("form", "role", "search"), true],
	[createElement("input", "type", "search"), true],
	[createElement("input", "name", "q"), true],
	[createElement("form"), false],
	[createElement("input"), false],
	["", false]])("Search elements",
	(element, expected) => {
		test(`${element.outerHTML} is a search element: ${expected}`, () => {
			expect(isSearchElement(element)).toBe(expected)
		})
	})
