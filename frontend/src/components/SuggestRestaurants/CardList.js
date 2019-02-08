import React from 'react';
import styles from 'styles/CardList.module.scss';
import Card from './Card';


class CardList extends React.Component {
	stackedCards = () => {
		const restaurants = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		let i = 0;
		return restaurants.map(r => {
			if (i < 7) {
				i++;
				return <div className={styles.stackedCard} key={i}></div>
			}
		});
	}

	render() {
		return (
			<div className={styles.cardList}>
				<div className={styles.cardStack}>
					<Card />
					{this.stackedCards()}
				</div>
			</div>
		);
	}
}


export default CardList;