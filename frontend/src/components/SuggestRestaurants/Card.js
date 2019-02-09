import React from 'react';
import styles from 'styles/Card.module.scss';
import FilterBtn from './FilterBtn';


class Card extends React.Component {

	getRatingImgPath = () => {
		const prefix = this.props.isMobile ? 'small' : 'regular';
		const rating = this.props.restaurant.rating;
		const isFloat = rating % 1 !== 0;
		const num = isFloat ? Math.floor(rating) + '_half' : rating;
		return `assets/yelp_stars/web_and_ios/${prefix}/${prefix}_${num}.png`;
	};

	render() {
		const infoClassList = [styles.info];
		if (this.props.isMobile) {
			infoClassList.push(styles.isMobile);
		}

		const categories = [this.props.restaurant.price].concat(this.props.restaurant.categories);
		const filterBtns = categories.map(category => {
			return (
				<FilterBtn
					category={category}
				/>
			)
		});

		return (
			<div className={styles.card}>
				<div className={styles.content}>
					{!this.props.isMobile &&
						<div className={styles.imgContainer}>
							<a 
								href={this.props.restaurant.image_url} 
								target="_blank"
								rel="noopener noreferrer"
							>
								<img
									src={this.props.restaurant.image_url}
									alt={this.props.restaurant.name}
								></img>
							</a>
						</div>
					}
					<div className={infoClassList.join(' ')}>
						<h1>{this.props.restaurant.name}</h1>
						<div className={styles.yelpInfo}>
							<a 
								className={styles.reviewInfo}
								href={this.props.restaurant.url}
								target="_blank"
								rel="noopener noreferrer"
								title={this.props.restaurant.rating + " star rating"}
							>
								<img src={this.getRatingImgPath()}></img>
								<p>Based on {this.props.restaurant.review_count} Reviews</p>
							</a>
							<a 
								href={this.props.restaurant.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img 
									className={styles.yelpLogo}
									src='assets/YelpLogo_Trademark/Screen(R)/Yelp_trademark_RGB_outline.png'
									title='www.yelp.com'
								></img>
							</a>
						</div>
						<div className={styles.filterBtns}>{filterBtns}</div>
					</div>
				</div>
				<div className={styles.buttons}>

				</div>
			</div>
		);
	}
}


export default Card;