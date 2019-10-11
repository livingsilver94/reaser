import { handleFocused, handleBlurred } from "lib/search_detection"

var forms = document.querySelectorAll("form")
for (const form of forms) {
	form.addEventListener("focus", async event => { await handleFocused(event.target) }, true)
	form.addEventListener("blur", handleBlurred, true)
}
handleFocused(document.activeElement)
