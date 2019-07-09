function categoryIsIncluded(list, item) {
	for (const c of list) {
		if (c.alias === item.alias) {
			return true;
		}
	}
	return false;
}


function toggleItem(list, item) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].alias === item.alias) {
			return list.slice(0, i).concat(list.slice(i + 1));
		}
	}
	return list.concat([item]);
}


function addItems(list, items) {
	if (!Array.isArray(items)) {
		items = [items];
	}
	return list.concat(items.filter(item => !categoryIsIncluded(list, item)));
}


export { categoryIsIncluded, toggleItem, addItems }