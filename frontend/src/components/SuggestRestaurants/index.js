import React from 'react';
import Card from './Card';
import styles from 'styles/SuggestRestaurants.module.scss';
import data from './test.json';


const devState = {
	restaurants: data.businesses,
	index: 0,
	categories: [],
	filters: [],
	loading: false,
}

const prodState = {
	restaurants: [],
	index: 0,
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
		const resp = await fetch('/api/restaurants?location='+this.props.location);
		const data = await resp.json();
		this.setState({restaurants: data.businesses, loading: false});
	};

	render() {
		let i = 0;
		const stackedCards = this.state.restaurants.map(r => {
			if (i < 9) {
				i++;
				return <div className={styles.stackedCard} key={r.id}></div>
			}
		});

		return (
			<div className={styles.suggestRestaurants}>
				{!this.state.loading &&
					<div className={styles.cardStack}>
						<Card 
							restaurant={this.state.restaurants[this.state.index]}
							isMobile={this.props.isMobile}
						/>
						{stackedCards}
					</div>
				}
			</div>
		);
	}
}


export default SuggestRestaurants;