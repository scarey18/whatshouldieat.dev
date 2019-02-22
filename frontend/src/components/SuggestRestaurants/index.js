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
	retrievedFromHistory: false,
}

const prodState = {
	restaurants: [],
	index: 0,
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: true,
	retrievedFromHistory: false,
}


class SuggestRestaurants extends React.Component {
	constructor(props) {
		super(props);
		this.state = devState;
		this.retrievedFromHistory = false;
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
		const index = this.state.index + 1;
		const history = this.state.history.slice();
		history.push(this.state);
		const restaurants = this.state.restaurants.slice();
		if (saveRestaurant) {
			restaurants.push(this.state.restaurants[this.state.index]);
		}
		this.setState({history, index, restaurants, retrievedFromHistory: false});
	};

	undo = () => {
		const historyState = this.state.history[this.state.history.length - 1];
		this.setState({...historyState, retrievedFromHistory: true});
	};

	render() {
		let i = -1;
		const restaurants = this.state.restaurants.slice(this.state.index);
		const stackedCards = restaurants.map(r => {
			if (i < 15) {
				i++;
				return (
					<Card
						renderContent={i === 0}
						restaurant={r}
						isMobile={this.props.isMobile}
						nextRestaurant={this.nextRestaurant}
						retrievedFromHistory={this.state.retrievedFromHistory && i === 0}
						key={r.id}
					/>
				);
			}
		});

		return (
			<div className={styles.suggestRestaurants}>
				{!this.state.loading &&
					<div className={styles.cardStack}>
						{stackedCards}
					</div>
				}
				{this.state.index > 0 &&
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