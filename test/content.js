import * as content from "../reaser/content"

test("<form role=\"search\"> is search element", () => {
	const form = document.createElement("form")
	form.setAttribute("role", "search")
	expect(content.isSearchElement(form)).toBeTruthy()
})

test("<input type=\"search\"> is search element", () => {
	const input = document.createElement("input")
	input.setAttribute("type", "search")
	expect(content.isSearchElement(input)).toBeTruthy()
})

test("input in <form type=\"search\"> is search element", () => {
	const domparser = new DOMParser()
	const doc = domparser.parseFromString("<form role=\"search\"><input id=\"mockInput\"></form>", "text/html")
	expect(content.isSearchElement(doc.getElementById("mockInput"))).toBeTruthy()
})
