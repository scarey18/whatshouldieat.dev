import React from 'react';
import styles from 'styles/Card.module.scss';
import FilterBtn from './FilterBtn';
import ActionBtn from './ActionBtn';
import FlexibleImg from 'components/common/FlexibleImg';


class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			transitionOut: false,
			saveRestaurant: false,
		}
	}

	componentWillUnmount() {
		if (this.transitionTimeout) {
			clearTimeout(this.transitionTimeout);
			this.props.nextRestaurant(this.state.saveRestaurant);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.transitionOut && !prevState.transitionOut) {
			this.transitionTimeout = setTimeout(
				() => this.props.nextRestaurant(this.state.saveRestaurant),
				200
			);
		}
	}

	getRatingImgPath = () => {
		const prefix = this.props.isMobile ? 'small' : 'regular';
		const rating = this.props.restaurant.rating;
		const isFloat = rating % 1 !== 0;
		const num = isFloat ? Math.floor(rating) + '_half' : rating;
		return `assets/yelp_stars/web_and_ios/${prefix}/${prefix}_${num}.png`;
	};

	nextRestaurant = saveRestaurant => {
		this.setState({transitionOut: true, saveRestaurant});
	};

	render() {
		const cardClassList = [styles.card];
		if (!this.props.renderContent) {
			cardClassList.push(styles.stackedCard);
		}
		if (this.state.transitionOut) {
			cardClassList.push(styles.transitionOut);
		}

		const infoClassList = [styles.info];
		if (this.props.isMobile) {
			infoClassList.push(styles.isMobile);
		}
		
		const categories = [this.props.restaurant.price].concat(this.props.restaurant.categories);

		return (
			<div className={cardClassList.join(' ')}>
			{this.props.renderContent &&
				<React.Fragment>
					<div className={styles.content}>

					{/* Restaurant image */}
						{!this.props.isMobile &&
							<div className={styles.imgContainer}>
								<a 
									href={this.props.restaurant.image_url} 
									target="_blank"
									rel="noopener noreferrer"
								>
									<FlexibleImg
										src={this.props.restaurant.image_url}
										alt={this.props.restaurant.name}
									/>
								</a>
							</div>
						}

					{/* Restaurant info and Yelp rating/logo */}
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
									<img 
										src={this.getRatingImgPath()}
										alt={this.props.restaurant.rating + " star rating"}
									></img>
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
										alt="Yelp logo"
									></img>
								</a>
							</div>

						{/* Category buttons */}
							<div className={styles.filterBtns}>
								{categories.map(category => (
									<FilterBtn
										category={category}
									/>
								))}
							</div>
						</div>
					</div>

				{/* Bottom action buttons */}
					<div className={styles.actionBtns}>
						<ActionBtn id={0} action={() => this.nextRestaurant(false)}/>
						<ActionBtn id={1} action={() => this.nextRestaurant(true)}/>
						<ActionBtn id={2} />
					</div>
				</React.Fragment>}
			</div>
		);
	}
}


export default Card;