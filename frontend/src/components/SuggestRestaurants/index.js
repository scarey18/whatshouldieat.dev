import React from 'react';
import Card from './Card';
import styles from 'styles/SuggestRestaurants.module.scss';
import data from './test.json';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


const prodState = {
	restaurants: [],
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: true,
	savedRestaurants: [],
}

const devState = {
	...prodState,
	restaurants: data.businesses,
	loading: false,
}


class SuggestRestaurants extends React.Component {
	constructor(props) {
		super(props);
		this.state = devState;
	}

	componentDidMount() {
		// this.getRestaurants();
	}

	componentDidUpdate(prevProps, prevState) {
		// if (this.props.location !== prevProps.location) {
		// 	this.setState({loading: true});
		// 	this.getRestaurants();
		// }
	}

	getRestaurants = async () => {
		const params = [
			'location='+this.props.location,
			'offset='+this.state.offset,
		];
		const resp = await fetch('/api/restaurants?'+params.join('&'));
		const data = await resp.json();
		this.setState({restaurants: data.businesses, loading: false});
	};

	nextRestaurant = saveRestaurant => {
		const history = this.state.history.slice().concat([this.state]);
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
			const restaurants = this.eliminateThroughCategories(categories);
			const history = this.state.history.slice().concat([this.state]);
			this.setState({categories, restaurants, history});
		}
	};

	addFilter = filter => {
		const filters = this.state.filters.slice();
		if (!filters.includes(filter)) {
			filters.push(filter);
			const restaurants = this.eliminateThroughFilters(filters);
			const history = this.state.history.slice().concat([this.state]);
			this.setState({filters, restaurants, history});
		}
	};

	eliminateThroughFilters = filters => {
		return this.state.restaurants.slice().filter(r => {
			const restaurantCategories = r.categories.map(c => c.alias);
			for (const filter of filters) {
				const isPrice = filter.includes('$');
				if (isPrice && filter.length > 1 && r.price.length >= filter.length) {
					return false;
				} else if (!isPrice && restaurantCategories.includes(filter)) {
					return false;
				}
			}
			return true;
		});
	};

	eliminateThroughCategories = categories => {
		return this.state.restaurants.slice().filter(r => {
			const restaurantCategories = r.categories.map(c => c.alias);
			for (const category of categories) {
				const isPrice = category.includes('$');
				if (isPrice && r.price.length !== category.length) {
					return false;
				} else if (!isPrice && !restaurantCategories.includes(category)) {
					return false;
				}
			}
			return true;
		});
	};

	render() {
		let i = -1;
		const stackedCards = this.state.restaurants.map(r => {
			i++;
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
						renderContent={i === 0}
						restaurant={r}
						isMobile={this.props.isMobile}
						nextRestaurant={this.nextRestaurant}
						addCategory={this.addCategory}
						addFilter={this.addFilter}
					/>
				</CSSTransition>
			);
		});

		return (
			<div className={styles.suggestRestaurants}>
				{!this.state.loading && 
					<TransitionGroup className={styles.cardStack}>
						{stackedCards}
					</TransitionGroup>
				}
				{this.state.history.length > 0 &&
					<div 
						className={styles.undoBtn} 
						onClick={this.undo}
						title="Undo"
					>
						<i className="fas fa-undo fa-lg"></i>
					</div>
				}
			</div>
		);
	}
}


export default SuggestRestaurants;