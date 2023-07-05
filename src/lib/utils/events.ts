export function getTargetHtmlElement<T extends Event>(e: T) {
	if (!(e.target instanceof HTMLElement)) {
		throw new Error('e.target is not HTMLElement');
	}

	return e.target;
}
