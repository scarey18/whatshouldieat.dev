import React from 'react';
import Card from './Card';
import styles from 'styles/SuggestRestaurants.module.scss';
import * as utils from './utils';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import MapModal from 'components/common/MapModal';
import Sidebar from 'components/common/Sidebar';
import LoadingRing from 'components/common/LoadingRing';
import FiltersDashboard from 'components/common/FiltersDashboard';
import { Categories, Filters, SeenCategories } from 'commonUtils/CategoryClasses';


const initialState = {
	restaurants: [],
	history: [],
	categories: new Categories(),
	filters: new Filters(),
	loading: true,
	savedRestaurants: [],
	renderMapModal: false,
	restaurantSelected: false,
	price: 4,
	seenCategories: new SeenCategories(),
}


class SuggestRestaurants extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
		this.requestsLog = [];
		this.discarded = [];
		this.allSeenRestaurants = [];
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
			this.requestsLog = [];
			this.discarded = [];
			this.allSeenRestaurants = [];
			this.setState(initialState, this.getRestaurants);
		} else if (this.state.restaurants.length !== prevState.restaurants.length &&
			this.state.restaurants.length <= 12) {
			this.getRestaurants();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.overflowTimeout);
	}

	getRestaurants = async () => {
		const request = utils.getOrCreateRequest(this);
		if (request.canFetchMore) {
			const resp = await fetch(request.url);
			const data = await resp.json();

			request.resultsLog.push(data.businesses.length);
			let restaurants = utils.discardDuplicates(
				this.allSeenRestaurants, data.businesses
			);
			this.allSeenRestaurants = this.allSeenRestaurants.concat(restaurants);

			if (this.state.filters.length > 0) {
				let newlyDiscarded;
				[restaurants, newlyDiscarded] = this.state.filters.discard(restaurants);
				this.discarded = this.discarded.concat(newlyDiscarded);
			};

			const seenCategories = this.state.seenCategories.addUnseen(restaurants);
			this.setState({
				restaurants: this.state.restaurants.concat(restaurants), 
				loading: false, 
				seenCategories
			});
		}	
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

	addCategory = newCategories => {
		const categories = this.state.categories.add(newCategories);
		const [restaurants, newlyDiscarded] = categories.discard(
			this.state.restaurants
		);
		this.discarded = this.discarded.concat(newlyDiscarded);
		const history = this.state.history.concat([this.state]);
		this.setState({categories, restaurants, history});
	};

	addFilter = newFilters => {
		const filters = this.state.filters.add(newFilters);
		const [restaurants, newlyDiscarded] = filters.discard(this.state.restaurants);
		this.discarded = this.discarded.concat(newlyDiscarded);
		const history = this.state.history.concat([this.state]);
		this.setState({filters, restaurants, history});
	};

	changePrice = price => {
		if (price < 1 || price === this.state.price) return;
		let retrieved = [];
		if (price > this.state.price) {
			[retrieved, this.discarded] = utils.retrieveDiscarded(this, {price});
		}
		let [restaurants, newlyDiscarded] = utils.discardThroughPrice(
			price, this.state.restaurants
		);
		restaurants = utils.sortInOrder(
			this.allSeenRestaurants, this.state.restaurants.concat(restaurants)
		);
		this.discarded = this.discarded.concat(newlyDiscarded);
		const history = this.state.history.concat([this.state]);
		this.setState({restaurants, price, history});
	};

	bringBackSavedRestaurants = () => {
		const history = this.state.history.concat([this.state]);
		this.setState({
			restaurants: this.state.savedRestaurants.concat(this.state.restaurants),
			savedRestaurants: [],
			history,
		});
	};

	selectRestaurant = () => {
		const history = this.state.history.concat([this.state]);
		this.setState({restaurantSelected: true, history});
	};

	removeCategory = category => {
		const categories = this.state.categories.remove(category);
		let retrieved = [];
		[retrieved, this.discarded] = utils.retrieveDiscarded(this, {categories});
		const restaurants = utils.sortInOrder(
			this.allSeenRestaurants, this.state.restaurants.concat(retrieved)
		);
		const history = this.state.history.concat([this.state]);
		this.setState({categories, history, restaurants});
	};

	removeFilter = filter => {
		const filters = this.state.filters.remove(filter);
		let retrieved = [];
		[retrieved, this.discarded] = utils.retrieveDiscarded(this, {filters});
		const restaurants = utils.sortInOrder(
			this.allSeenRestaurants, this.state.restaurants.concat(retrieved)
		);
		const history = this.state.history.concat([this.state]);
		this.setState({filters, history, restaurants});
	};

	render() {
		const stackedCards = this.state.restaurants.slice(0, 11).map((r, i) => (
			<CSSTransition
				key={r.id}
				timeout={300}
				unmountOnExit
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
							<h2>We couldn't find any more restaurants for this search area. Try widening your search or using less filters.</h2>
						</div>
					}
				</div>

				<MapModal 
					render={this.state.renderMapModal}
					restaurant={this.state.restaurants[0]}
					onClose={() => this.setState({renderMapModal: false})}
				/>

			{/* Sidebar with category selection */}
				{!this.state.restaurantSelected &&
					<Sidebar>
						<FiltersDashboard 
							categories={this.state.categories}
							filters={this.state.filters}
							seenCategories={this.state.seenCategories}
							price={this.state.price}
							changePrice={this.changePrice}
							removeFilter={this.removeFilter}
							removeCategory={this.removeCategory}
							addCategory={this.addCategory}
							addFilter={this.addFilter}
							saveRestaurants={this.state.savedRestaurants}
						/>
					</Sidebar>
				}
			</React.Fragment>
		);
	}
}


export default SuggestRestaurants;