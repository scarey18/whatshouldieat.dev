import React from 'react';
import CardList from './CardList';
import styles from 'styles/SuggestRestaurants.module.scss';


class SuggestRestaurants extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			restaurants: [],
			index: 0,
			categories: [],
			filters: [],
		}
	}

	render() {
		return (
			<div className={styles.suggestRestaurants}>
				<CardList />
			</div>
		);
	}
}


export default SuggestRestaurants;