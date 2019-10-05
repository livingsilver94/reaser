import * as content from "../reaser/content"

test('<form role="search"> is search element', () => {
	const form = document.createElement("form")
	form.setAttribute("role", "search")
	expect(content.isSearchElement(form)).toBeTruthy()
})

test('<input type="search"> is search element', () => {
	const input = document.createElement("input")
	input.setAttribute("type", "search")
	expect(content.isSearchElement(input)).toBeTruthy()
})

test('input in <form type="search"> is search element', () => {
	const domParser = new DOMParser()
	const doc = domParser.parseFromString('<form role="search"><input id="mockInput"></form>', "text/html")
	expect(content.isSearchElement(doc.getElementById("mockInput"))).toBeTruthy()
})

describe("Focus and blur of an element", () => {
	let searchForm
	beforeEach(() => {
		searchForm = document.createElement("form")
		searchForm.setAttribute("role", "search")
	})

	test("handleFocused sends a message to background once", () => {
		content.handleFocused(searchForm)
		content.handleFocused(searchForm)
		expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(1)
		expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ searching: true })
	})

	test("handleBlurred sends a message to background once", () => {
		content.handleBlurred(searchForm)
		content.handleBlurred(searchForm)
		expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(1)
		expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ searching: false })
	})
})
