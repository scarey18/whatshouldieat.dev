import categoryIsIncluded from 'commonUtils/categoryIsIncluded';


// Stops scrollbar flickering on card transitions
function stopOverflow(comp) {
	const body = document.querySelector('body');
	body.style.overflowY = 'hidden';
	comp.overflowTimeout = setTimeout(() => body.style.overflowY = 'auto', 400);
}


function getParams(comp, offset) {
	const paramObj = {
		'location': comp.props.location,
		'offset': offset,
		'categories': 'restaurants',
		'price': '',
	}
	comp.state.categories.forEach(category => {
		paramObj['categories'] = category.alias;
	});

	if (comp.state.price < 4) {
		const priceList = [];
		for (let i = 1; i <= comp.state.price; i++) {
			priceList.push(i);
		}
		paramObj['price'] = priceList.join(',');
	}

	const params = [];
	for (let [param, value] of Object.entries(paramObj)) {
		if (value !== '') {
			params.push(param + '=' + value);
		}
	}
	return params.join('&');
}


function eliminateThroughFilters(filters, restaurants) {
	return restaurants.filter(r => {
		for (const filter of filters) {
			if (categoryIsIncluded(r.categories, filter)) {
				return false;
			}
		}
		return true;
	});
}


function eliminateThroughCategories(categories, restaurants) {
	return restaurants.filter(r => {
		for (const category of categories) {
			if (!categoryIsIncluded(r.categories, category)) {
				return false;
			}
		}
		return true;
	});
}


function eliminateThroughPrice(price, restaurants) {
	return restaurants.filter(r => !r.price || r.price.length <= price);
}


function addNewSeenCategories(seenCategories, restaurants) {
	restaurants.forEach(r => {
		seenCategories = seenCategories.concat(
			r.categories.filter(c => !categoryIsIncluded(seenCategories, c))
		);
	});
	return seenCategories;
}


function removeItem(list, item) {
	let index;
	for (let i = 0; i < list.length; i++) {
		if (list[i].alias === item.alias) {
			index = i;
			break;
		}
	}
	return list.slice(0, index).concat(list.slice(index + 1));
}


function addItems(list, items) {
	if (!Array.isArray(items)) {
		items = [items];
	}
	return list.concat(items.filter(item => !categoryIsIncluded(list, item)));
}


export { 
	stopOverflow, getParams, eliminateThroughFilters, 
	eliminateThroughCategories, eliminateThroughPrice, 
	addNewSeenCategories, removeItem, addItems
}