import React from 'react';
import styles from 'styles/Card.module.scss';
import FilterBtn from './FilterBtn';
import ActionBtn from './ActionBtn';


class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			renderContent: props.renderContent,
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Wait for animation before rendering new restaurant
		if (this.props.renderContent && !this.state.renderContent) {
			this.transitionTimeout = setTimeout(
				() => this.setState({renderContent: true}), 
				300
			);
		} else if (!this.props.renderContent && this.state.renderContent) {
			this.setState({renderContent: false});
		}
	}

	componentWillUnmount() {
		clearTimeout(this.transitionTimeout);
	}

	getRatingImgPath = () => {
		const prefix = this.props.isMobile ? 'small' : 'regular';
		const rating = this.props.restaurant.rating;
		const isFloat = rating % 1 !== 0;
		const num = isFloat ? Math.floor(rating) + '_half' : rating;
		return `assets/yelp_stars/web_and_ios/${prefix}/${prefix}_${num}.png`;
	};

	render() {
		const cardClassList = [styles.card];
		if (!this.state.renderContent) {
			cardClassList.push(styles.stackedCard);
		}

		const infoClassList = [styles.info];
		if (this.props.isMobile) {
			infoClassList.push(styles.isMobile);
		}

		const categories = [this.props.restaurant.price].concat(this.props.restaurant.categories);

		return (
			<div className={cardClassList.join(' ')}>
			{this.state.renderContent &&
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
									<img 
										src={this.props.restaurant.image_url}
										alt={this.props.restaurant.name}
									></img>
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
								{categories.map(category => {
									const filterValue = category.alias || category;
									return (
										<FilterBtn
											category={category}
											addCategory={() => this.props.addCategory(filterValue)}
											addFilter={() => this.props.addFilter(filterValue)}
											key={category.alias}
										/>
									);
								})}
							</div>

							<div className={styles.addressInfo}>
								<div className={styles.fullAddress}>
									<p>{this.props.restaurant.location.address1}</p>
									{this.props.restaurant.location.address2 &&
										<p>{this.props.restaurant.location.address2}</p>}
									{this.props.restaurant.location.address3 &&
										<p>{this.props.restaurant.location.address3}</p>}
									<p>
										{`${this.props.restaurant.location.city}, 
											${this.props.restaurant.location.state} 
											${this.props.restaurant.location.zip_code}`}
									</p>
								</div>
								<a onClick={this.props.showOnMap}>
									Show on Map
								</a>
							</div>
						</div>
					</div>

				{/* Bottom action buttons */}
					<div className={styles.actionBtns}>
						<ActionBtn 
							id={0} 
							action={() => this.props.nextRestaurant(false)}
							isMobile={this.props.isMobile}
						/>
						<ActionBtn 
							id={1} 
							action={() => this.props.nextRestaurant(true)}
							isMobile={this.props.isMobile}
						/>
						<ActionBtn 
							id={2}
							isMobile={this.props.isMobile}
						/>
					</div>
				</React.Fragment>}
			</div>
		);
	}
}


export default Card;