/**
 * Only run the passed callback if the event in trusted. Also stop the event propagation.
 * This will be a decorator in future.
 *
 * @param cb the event callback to decorate
 * @returns the decorated callback
 */
export function trustedEvent(cb: (event: Event) => any): (event: Event) => any {
	return function(evt) {
		if (!evt.isTrusted) return
		evt.stopPropagation()
		cb(evt)
	}
}
