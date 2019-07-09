function biSort(callback, items) {
	const stackA = [];
	const stackB = [];
	items.forEach(item => {
		const stack = callback(item) ? stackA : stackB;
		stack.push(item);
	});
	return [stackA, stackB];
}


function isDescendant(parent, node) {
	switch (node) {
		case parent || null:
			return true;
		case document.querySelector('body'):
			return false;
		default:
			return isDescendant(parent, node.parentNode);
	}
}


export { biSort, isDescendant }