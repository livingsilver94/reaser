import { TabSearch } from "../reaser/lib/tab_search"

var ts

beforeEach(() => {
	ts = new TabSearch()
})

test("No cloned URLs stored", () => {
	ts.addUrl("url1")
	ts.addUrl("url2")
	ts.addUrl("url1")
	expect(ts.lastUrl).toBe("url2")
})

test("URLs are correctly filtered", () => {
	ts.addUrl("url1")
	ts.addUrl("url2")
	ts.filterUrls((url) => url === "url2")
	expect(ts.hasUrl("url1")).toBeTruthy()
	expect(ts.hasUrl("url2")).toBeFalsy()
})

test("Detect when there are (no) URLs", () => {
	ts.addUrl("url1")
	expect(ts.hasUrls()).toBeTruthy()
	ts.filterUrls((url) => url === "url1")
	expect(ts.hasUrls()).toBeFalsy()
})
