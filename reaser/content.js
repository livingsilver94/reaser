import { handleFocused, handleBlurred } from "./lib/search_detection"

var possibleElements = document.querySelectorAll("form, input[type='search']")
for (const element of possibleElements) {
	element.addEventListener("focus", async event => { await handleFocused(event.target) }, true)
	element.addEventListener("blur", handleBlurred, true)
}

handleFocused(document.activeElement)
console.debug("Content loaded")

window.addEventListener("beforeunload", () => {
	for (const element of possibleElements) {
		element.removeEventListener("blur", handleBlurred, true)
	}
})
