/**
 * Only run the passed callback if the event in trusted. Also stop the event propagation.
 * This will be a decorator in future.
 *
 * @param {(event: Event) => any} cb - the event callback to decorate
 * @returns {(event: Event) => any} the decorated callback
 */
export function trustedEvent(cb) {
	return function(evt) {
		if (!evt.isTrusted) return
		evt.stopPropagation()
		cb(evt)
	}
}
