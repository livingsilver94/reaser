import * as content from "../reaser/content"

test("<form role=\"search\"> is search element", () => {
	expect(content.isSearchElement(undefined)).toBeTruthy()
})
