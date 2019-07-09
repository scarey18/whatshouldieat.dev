// Stops scrollbar flickering on card transitions
function stopOverflow(comp) {
	const body = document.querySelector('body');
	body.style.overflowY = 'hidden';
	comp.overflowTimeout = setTimeout(() => body.style.overflowY = 'auto', 400);
}


function getParams(comp, offset) {
	const params = [`location=${comp.props.location}`, `offset=${offset}`];

	if (comp.state.price < 4) {
		const priceList = [];
		for (let i = 1; i <= comp.state.price; i++) {
			priceList.push(i);
		}
		params.push(`price=${priceList.join(',')}`);
	}

	return params.join('&');
}


function discardThroughPrice(price, restaurants) {
	const discarded = [];
	const kept = [];

	restaurants.forEach(r => {
		if (r.price && r.price.length > price) {
			discarded.push(r);
		} else {
			kept.push(r);
		}
	});
	return [kept, discarded];
}


export { stopOverflow, getParams, discardThroughPrice }