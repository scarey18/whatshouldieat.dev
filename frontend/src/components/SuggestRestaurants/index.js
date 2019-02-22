import React from 'react';
import Card from './Card';
import styles from 'styles/SuggestRestaurants.module.scss';
import data from './test.json';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


const devState = {
	restaurants: data.businesses,
	index: 0,
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: false,
	savedRestaurants: [],
}

const prodState = {
	restaurants: [],
	index: 0,
	offset: 0,
	history: [],
	categories: [],
	filters: [],
	loading: true,
	savedRestaurants: [],
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
		const index = this.state.index + 1;
		const history = this.state.history.slice().concat([this.state]);
		const restaurants = this.state.restaurants.slice();
		const savedRestaurants = this.state.savedRestaurants.slice();
		if (saveRestaurant) {
			savedRestaurants.push(this.state.restaurants[this.state.index]);
		}
		this.setState({history, index, restaurants, savedRestaurants});
	};

	undo = () => {
		const historyState = this.state.history[this.state.history.length - 1];
		this.setState(historyState);
	};

	render() {
		let i = -1;
		const restaurants = this.state.restaurants.slice(this.state.index);
		const stackedCards = restaurants.map(r => {
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