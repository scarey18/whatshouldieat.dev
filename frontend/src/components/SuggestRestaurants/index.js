import React from 'react';
import Card from './Card';
import styles from 'styles/SuggestRestaurants.module.scss';
import data from './test.json';


const devState = {
	restaurants: data.businesses,
	index: 0,
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: false,
}

const prodState = {
	restaurants: [],
	index: 0,
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: true,
}


class SuggestRestaurants extends React.Component {
	constructor(props) {
		super(props);
		this.state = devState;
	}

	componentDidMount() {
		// this.getRestaurants();
	}

	componentDidUpdate(prevProps) {
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
		const index = this.state.index + 1;
		const history = this.state.history.slice();
		history.push(this.state);
		const restaurants = this.state.restaurants.slice();
		if (saveRestaurant) {
			restaurants.push(this.state.restaurants[this.state.index]);
		}
		this.setState({history, index, restaurants});
	};

	render() {
		let i = -1;
		const restaurants = this.state.restaurants.slice(this.state.index);

	{/* Render maximum of 9 stacked cards */}
		const stackedCards = restaurants.map(r => {
			if (i < 9) {
				i++;
				return (
					<Card
						renderContent={i === 0}
						restaurant={r}
						isMobile={this.props.isMobile}
						nextRestaurant={this.nextRestaurant}
						key={r.id}
					/>
				)
			}
		});

		return (
			<div className={styles.suggestRestaurants}>
				{!this.state.loading &&
					<div className={styles.cardStack}>
						{stackedCards}
					</div>
				}
			</div>
		);
	}
}


export default SuggestRestaurants;