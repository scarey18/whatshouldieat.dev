import { biSort } from 'commonUtils/miscFunctions';


class RestaurantsRequest {
	constructor(component) {
		this.location = component.props.location;
		this.price = component.state.price;
		this.categories = component.state.categories;
		this.params = this.setParams();
		this.resultsLog = [];
	}

	setParams() {
		const params = [`location=${this.location}`];

		if (this.price < 4) {
			const priceList = [];
			for (let i = 1; i <= this.price; i++) {
				priceList.push(i);
			}
			params.push(`price=${priceList.join(',')}`);
		}

		if (this.categories.length > 0) {
			const aliases = this.categories.sortedAliases;
			params.push(`categories=${aliases.join(',')}`);
		}

		return params.join('&');	
	}

	get offset() {
		return this.resultsLog.reduce((sum, x) => sum + x);
	}

	get canFetchMore() {
		const resultsLength = this.resultsLog.length;
		return resultsLength === 0 || 
			(this.resultsLog[resultsLength - 1] === 50 && this.offset <= 950);
	}

	get url() {
		let url = '/api/restaurants?' + this.params;
		if (this.resultsLog.length > 0) {
			url += `&offset=${this.offset}`;
		}
		return url;
	}
}


function getOrCreateRequest(component) {
	for (const request of component.requestsLog) {
		if (component.props.location === request.location &&
				component.state.price === request.price &&
				component.state.categories.isEqualTo(request.categories)) {
			return request;
		}
	}
	const request = new RestaurantsRequest(component);
	component.requestsLog.push(request);
	return request;
}


// Stops scrollbar flickering on card transitions
function stopOverflow(comp) {
	const body = document.querySelector('body');
	body.style.overflowY = 'hidden';
	comp.overflowTimeout = setTimeout(() => body.style.overflowY = 'auto', 400);
}


function discardThroughPrice(price, restaurants) {
	return biSort(r => (!r.price || r.price.length <= price), restaurants);
}


function discardDuplicates(seenRestaurants, restaurants) {
	return restaurants.filter(restaurant => {
		for (const r of seenRestaurants) {
			if (r.alias === restaurant.alias) return false;
		}
		return true;
	});
}


function retrieveDiscarded(component, params) {
	const price = params.price || component.state.price;
	const categories = params.categories || component.state.categories;
	const filters = params.filters || component.state.filters;

	const biSortCallback = restaurant => {
		return categories.hasCommon(restaurant.categories) &&
			!filters.hasCommon(restaurant.categories) &&
			(!restaurant.price || restaurant.price.length <= price);
	}
	return biSort(biSortCallback, component.discarded);
}


export { 
	getOrCreateRequest, stopOverflow, discardThroughPrice, 
	discardDuplicates, retrieveDiscarded
}