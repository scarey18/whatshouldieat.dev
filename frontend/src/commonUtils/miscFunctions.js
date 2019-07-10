
/* Sorts an array of items into two arrays based on given parameters */
export function biSort(callback, items) {
	const stackA = [];
	const stackB = [];
	items.forEach(item => {
		const stack = callback(item) ? stackA : stackB;
		stack.push(item);
	});
	return [stackA, stackB];
}


export function isDescendant(parent, node) {
	switch (node) {
		case parent || null:
			return true;
		case document.querySelector('body'):
			return false;
		default:
			return isDescendant(parent, node.parentNode);
	}
}