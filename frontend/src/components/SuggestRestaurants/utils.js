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
		paramObj['categories'] = category;
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
		const restaurantCategories = r.categories.map(c => c.alias);
		for (const filter of filters) {
			if (restaurantCategories.includes(filter)) {
				return false;
			}
		}
		return true;
	});
}


function eliminateThroughCategories(categories, restaurants) {
	return restaurants.filter(r => {
		const restaurantCategories = r.categories.map(c => c.alias);
		for (const category of categories) {
			if (!restaurantCategories.includes(category)) {
				return false;
			}
		}
		return true;
	});
}


function eliminateThroughPrice(price, restaurants) {
	return restaurants.filter(r => {
		return !r.price || r.price.length <= price;
	});
}


function addNewCategories(seenCategories, restaurants) {
	const categories = seenCategories.slice();
	const aliases = categories.map(c => c.alias);
	let categoryAdded = false;
	for (const r of restaurants) {
		for (const c of r.categories) {
			if (!aliases.includes(c.alias)) {
				aliases.push(c.alias);
				categories.push(c);
			}
		}
	}
	return categories;
}


export { stopOverflow, getParams, eliminateThroughFilters, eliminateThroughCategories, eliminateThroughPrice, addNewCategories };