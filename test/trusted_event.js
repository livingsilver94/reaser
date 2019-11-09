import { trustedEvent } from "../reaser/lib/trusted_event"

const mockedCallback = jest.fn()

/**
 * Create a fake event and run it.
 *
 * @param {boolean} trusted - whether the event is trusted
 * @returns {object} the mocked `Event` object used
 */
function runDecoratedCallback(trusted) {
	const evt = { isTrusted: trusted, stopPropagation: jest.fn() }
	const decoratedCallback = trustedEvent(mockedCallback)
	decoratedCallback(evt)
	return evt
}

describe.each([[true, 1],
	[false, 0]])("Trusted and untrusted events",
	(trusted, times) => {
		test(`${trusted ? "" : "un"}trusted event runs the callback ${times} times`, () => {
			runDecoratedCallback(trusted)
			expect(mockedCallback).toHaveBeenCalledTimes(times)
		})
	})

test("Propagation is stopped", () => {
	runDecoratedCallback(true)
	const evt = runDecoratedCallback(true)
	expect(evt.stopPropagation).toHaveBeenCalled()
})
