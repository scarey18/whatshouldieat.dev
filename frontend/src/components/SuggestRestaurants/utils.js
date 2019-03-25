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
	comp.state.filters.forEach(filter => {
		if (filter.includes('$')) {
			const prices = {
				'$$': '1',
				'$$$': '1,2',
				'$$$$': '1,2,3'
			}
			paramObj['price'] = prices[filter];
		}
	});
	comp.state.categories.forEach(category => {
		if (category.includes('$')) {
			paramObj['price'] = String(category.length);
		} else {
			paramObj['categories'] = category;
		}
	});
	let params = [];
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
			const isPrice = filter.includes('$');
			if (isPrice && 
					filter.length > 1 && 
					r.price &&
					r.price.length >= filter.length) {
				return false;
			} else if (!isPrice && restaurantCategories.includes(filter)) {
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
			const isPrice = category.includes('$');
			if (isPrice && 
					r.price &&
					r.price.length !== category.length) {
				return false;
			} else if (!isPrice && !restaurantCategories.includes(category)) {
				return false;
			}
		}
		return true;
	});
}


export { stopOverflow, getParams, eliminateThroughFilters, eliminateThroughCategories };