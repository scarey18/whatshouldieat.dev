import React from 'react';
import CardList from './CardList';
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
		return (
			<div className={styles.suggestRestaurants}>
				{!this.state.loading &&
					<CardList />}
			</div>
		);
	}
}


export default SuggestRestaurants;