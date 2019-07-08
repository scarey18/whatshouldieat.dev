import React from 'react';
import Card from './Card';
import styles from 'styles/SuggestRestaurants.module.scss';
import * as utils from './utils';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import MapModal from 'components/common/MapModal';
import LoadingRing from 'components/common/LoadingRing';


const initialState = {
	restaurants: [],
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: true,
	savedRestaurants: [],
	renderMapModal: false,
	restaurantSelected: false,
	price: 4,
}


class SuggestRestaurants extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	setState = (...args) => {
		super.setState(...args);
		utils.stopOverflow(this);
	};

	componentDidMount() {
		this.getRestaurants();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location !== prevProps.location) {
			this.setState(initialState, this.getRestaurants);
		} else if (this.state.restaurants.length <= 12 &&
			prevState.restaurants.length > 12) {
			this.getRestaurants(this.state.offset + 50);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.overflowTimeout);
	}

	getRestaurants = async (offsetParam) => {
		const offset = offsetParam || 0;
		const params = utils.getParams(this, offset);
		const resp = await fetch('/api/restaurants?'+params);
		const data = await resp.json();
		let restaurants = this.state.restaurants.concat(data.businesses);
		if (this.state.filters.length > 0) {
			restaurants = utils.eliminateThroughFilters(this.state.filters, restaurants);
		}
		this.setState({restaurants, loading: false, offset});
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
			const restaurants = utils.eliminateThroughCategories(categories, this.state.restaurants);
			const history = this.state.history.concat([this.state]);
			this.setState({categories, restaurants, history});
		}
	};

	addFilter = filter => {
		const filters = this.state.filters.slice();
		if (!filters.includes(filter) && filter.length > 1) {
			filters.push(filter);
			const restaurants = utils.eliminateThroughFilters(filters, this.state.restaurants);
			const history = this.state.history.concat([this.state]);
			this.setState({filters, restaurants, history});
		}
	};

	changePrice = price => {
		if (price < 1 || price === this.state.price) {
			return;
		}
		const restaurants = utils.eliminateThroughPrice(price, this.state.restaurants);
		const history = this.state.history.concat([this.state]);
		this.setState({restaurants, price, history});
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

	selectRestaurant = () => {
		const history = this.state.history.concat([this.state]);
		this.setState({restaurantSelected: true, history});
	}

	render() {
		const stackedCards = this.state.restaurants.map((r, i) => (
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
					changePrice={this.changePrice}
					showOnMap={() => this.setState({renderMapModal: true})}
					selectRestaurant={this.selectRestaurant}
					restaurantSelected={this.state.restaurantSelected}
				/>
			</CSSTransition>
		));

		const stackClass = !this.state.restaurantSelected ?
			styles.cardStack : styles.selectedCardContainer;

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

				{/* Card stack with restaurants 
						(or single card if restaurant was selected) */}
					{this.state.restaurants.length > 0 &&
						<TransitionGroup className={stackClass}>
							{stackedCards}
						</TransitionGroup>
					}

				{/* Undo buttons */}
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
							!this.state.restaurantSelected &&
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