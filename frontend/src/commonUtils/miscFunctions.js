function biSort(callback, items) {
	const stackA = [];
	const stackB = [];
	items.forEach(item => {
		const stack = callback(item) ? stackA : stackB;
		stack.push(item);
	});
	return [stackA, stackB];
}


export { biSort }