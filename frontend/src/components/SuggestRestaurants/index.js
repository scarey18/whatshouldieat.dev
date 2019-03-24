import React from 'react';
import Card from './Card';
import styles from 'styles/SuggestRestaurants.module.scss';
import testData from './test.json';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import MapModal from 'components/common/MapModal';
import LoadingRing from 'components/common/LoadingRing';


const prodState = {
	restaurants: [],
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: true,
	savedRestaurants: [],
	renderMapModal: false,
}

const devState = {
	...prodState,
	restaurants: testData.businesses,
	loading: false,
}


class SuggestRestaurants extends React.Component {
	constructor(props) {
		super(props);
		this.state = prodState;
	}

	setState = (...args) => {
		super.setState(...args);
		this.stopOverflow();
	};

	// Stops scrollbar flickering on card transitions
	stopOverflow = () => {
		const body = document.querySelector('body');
		body.style.overflowY = 'hidden';
		this.overflowTimeout = setTimeout(() => body.style.overflowY = 'auto', 400);
	};

	componentDidMount() {
		this.getRestaurants();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location !== prevProps.location) {
			this.setState(prodState);
			this.getRestaurants();
		} else if (this.state.restaurants.length <= 12 &&
			prevState.restaurants.length > 12) {
			this.getRestaurants(this.state.offset + 40);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.overflowTimeout);
	}

	getRestaurants = async (offsetParam) => {
		const offset = offsetParam || 0;
		const params = this.getParams(offset);
		const resp = await fetch('/api/restaurants?'+params);
		const data = await resp.json();
		let restaurants = this.state.restaurants.concat(data.businesses);
		if (this.state.filters.length > 0) {
			restaurants = this.eliminateThroughFilters(this.state.filters, restaurants);
		}
		this.setState({restaurants, loading: false, offset});
	};

	getParams = offset => {
		const paramObj = {
			'location': this.props.location,
			'offset': offset,
			'categories': 'restaurants',
			'price': '',
		}
		this.state.filters.forEach(filter => {
			if (filter.includes('$')) {
				const prices = {
					'$$': '1',
					'$$$': '1,2',
					'$$$$': '1,2,3'
				}
				paramObj['price'] = prices[filter];
			}
		});
		this.state.categories.forEach(category => {
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
	};

	nextRestaurant = saveRestaurant => {
		const history = this.state.history.concat([this.state]);
		const restaurants = this.state.restaurants.slice(1);
		const savedRestaurants = this.state.savedRestaurants.slice();
		if (saveRestaurant) {
			savedRestaurants.push(this.state.restaurants[0]);
		}
		this.setState({history, restaurants, savedRestaurants});
	};

	undo = () => {
		const historyState = this.state.history[this.state.history.length - 1];
		this.setState(historyState);
	};

	addCategory = category => {
		const categories = this.state.categories.slice();
		if (!categories.includes(category)) {
			categories.push(category);
			const restaurants = this.eliminateThroughCategories(categories, this.state.restaurants);
			const history = this.state.history.concat([this.state]);
			this.setState({categories, restaurants, history});
		}
	};

	addFilter = filter => {
		const filters = this.state.filters.slice();
		if (!filters.includes(filter) && filter.length > 1) {
			filters.push(filter);
			const restaurants = this.eliminateThroughFilters(filters, this.state.restaurants);
			const history = this.state.history.concat([this.state]);
			this.setState({filters, restaurants, history});
		}
	};

	eliminateThroughFilters = (filters, restaurants) => {
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
	};

	eliminateThroughCategories = (categories, restaurants) => {
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
	};

	bringBackSavedRestaurants = () => {
		const savedRestaurants = this.state.savedRestaurants.slice();
		const restaurants = this.state.restaurants.slice();
		const history = this.state.history.concat([this.state]);
		this.setState({
			restaurants: savedRestaurants.concat(restaurants),
			savedRestaurants: [],
			history,
		});
	};

	render() {
		const stackedCards = this.state.restaurants.map((r, i) => {
			return (
				<CSSTransition
					key={r.id}
					timeout={300}
					classNames={{
						enter: styles.cardEnter,
						enterActive: styles.cardEnterActive,
						exit: styles.cardExit,
						exitActive: styles.cardExitActive,
					}}
				>
					<Card
						renderContent={i <= 1}
						isStacked={i > 0}
						restaurant={r}
						isMobile={this.props.isMobile}
						nextRestaurant={this.nextRestaurant}
						addCategory={this.addCategory}
						addFilter={this.addFilter}
						showOnMap={() => this.setState({renderMapModal: true})}
					/>
				</CSSTransition>
			);
		});

		return (
			<React.Fragment>
				<div className={styles.suggestRestaurants}>

				{/* Loading ring while fetching restaurants */}
					{this.state.loading &&
						<div className={styles.loadingSection}>
							<div className={styles.loadingRingContainer}>
								<LoadingRing />
							</div>
							<h2>Retrieving restaurants...</h2>
						</div>
					}

				{/* Card stack with restaurants */}
					{!this.state.loading && this.state.restaurants.length > 0 &&
						<TransitionGroup className={styles.cardStack}>
							{stackedCards}
						</TransitionGroup>
					}
					<div className={styles.historyBtns}>
						{this.state.history.length > 0 &&
							<button 
								className={styles.undoBtn} 
								onClick={this.undo}
								title="Undo"
							>
								<i className="fas fa-undo fa-lg"></i>
							</button>
						}
						{this.state.savedRestaurants.length > 0 &&
							<button 
								className={styles.savedRestaurantsBtn} 
								title="Saved Restaurants"
								onClick={this.bringBackSavedRestaurants}
							>
								Bring back saved restaurants
							</button>
						}
					</div>
				{/* Message if no restaurants found */}
					{!this.state.loading && this.state.restaurants.length === 0 &&
						<div className={styles.messageSection}>
							<h2>We couldn't find any more restaurants for this search area. Try widening your search.</h2>
						</div>
					}
				</div>

				<MapModal 
					render={this.state.renderMapModal}
					restaurant={this.state.restaurants[0]}
					onClose={() => this.setState({renderMapModal: false})}
				/>
			</React.Fragment>
		);
	}
}


export default SuggestRestaurants;