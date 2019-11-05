
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


export function getCookie(name) {
	for (const str of document.cookie.split('; ')) {
		const [key, value] = str.split('=');
		if (key === name) return value;
	}
}


export function scrollToForm() {
		const fontSize = getComputedStyle(document.documentElement).fontSize;
		const headerHeight = 5 * parseFloat(fontSize);
		if (window.scrollY < headerHeight) {
			window.scroll({
				top: headerHeight,
				left: 0,
				behavior: 'smooth',
			});
		}
	}