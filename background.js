browser.webNavigation.onBeforeNavigate.addListener(details => {
	browser.tabs.sendMessage(details.tabId, "does-focused-element-search")
		.then(isSearchElement => {
			console.info(isSearchElement)
			if (isSearchElement) {
				browser.history.deleteUrl({ "url": details.url })
					.then(() => console.info("DELETED ------>" + details.url))
					.catch(err => { console.error(err.message) })
			}
		})
		.catch(error => {
			console.log(error.name)
			console.log(error.message)
		})
})
