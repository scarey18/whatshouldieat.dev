import React from 'react';
import styles from 'styles/Card.module.scss';
import FilterBtn from './FilterBtn';
import ActionBtn from './ActionBtn';
import FlexibleImg from 'components/common/FlexibleImg';


class Card extends React.Component {
	componentDidMount() {
		if (this.props.renderContent) {
			this.card.addEventListener('mousedown', this.handleTouchStart);
			this.card.addEventListener('touchstart', this.handleTouchStart);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.renderContent && 
					(!prevProps.renderContent || 
					 !this.props.restaurantSelected && prevProps.restaurantSelected)
				) {
			this.card.addEventListener('mousedown', this.handleTouchStart);
			this.card.addEventListener('touchstart', this.handleTouchStart);
		} else if (!this.props.renderContent && prevProps.renderContent ||
								this.props.restaurantSelected && !prevProps.restaurantSelected) {
			this.card.removeEventListener('mousedown', this.handleTouchStart);
			this.card.removeEventListener('touchstart', this.handleTouchStart);
		}
	}

	componentWillUnmount() {
		this.rotationRatio = null;
		clearTimeout(this.transitionTimeout);
		this.card.removeEventListener('mousedown', this.handleMouseDown);
		window.removeEventListener('mouseup', this.handleMouseUp);
		this.card.removeEventListener('touchstart', this.handleTouchStart);
		window.removeEventListener('touchend', this.handleTouchEnd);
		window.removeEventListener('mousemove', this.moveCard);
		window.removeEventListener('touchmove', this.moveCard);
	}

	handleTouchStart = e => {
		const event = e.targetTouches ? e.targetTouches[0] : e;
		this.initialTouchX = event.screenX;
		this.initialTouchY = event.screenY;
		window.addEventListener('mousemove', this.moveCard);
		window.addEventListener('touchmove', this.moveCard);
		window.addEventListener('mouseup', this.handleTouchEnd);
		window.addEventListener('touchend', this.handleTouchEnd);
	};

	handleTouchEnd = () => {
		if (!this.props.renderContent) {
			return;
		}
		window.removeEventListener('mousemove', this.moveCard);
		window.removeEventListener('touchmove', this.moveCard);
		window.removeEventListener('mouseup', this.handleTouchEnd);
		window.removeEventListener('touchend', this.handleTouchEnd);
		this.card.style.transform = null;
		this.card.style.transition = null;
		document.querySelector('body').style.overflowY = null;
		if (this.rotationRatio <= -0.15) {
			this.props.nextRestaurant(false);
		}
	};

	moveCard = e => {
		if (!this.props.renderContent) {
			return;
		}
		const event = e.touches ? e.touches[0] : e;
		const differenceX = event.screenX - this.initialTouchX;
		const differenceY = event.screenY - this.initialTouchY;
		const maxRotation = 60;
		const rotation = maxRotation / (window.innerWidth / differenceX);
		this.rotationRatio = rotation / maxRotation;
		document.querySelector('body').style.overflowY = 'hidden';
		this.card.style.transition = 'none';
		this.card.style.transform = `translate(${differenceX}px, ${differenceY}px) rotate(${rotation}deg)`;
	};

	getRatingImgPath = () => {
		const prefix = this.props.isMobile ? 'small' : 'regular';
		const rating = this.props.restaurant.rating;
		const isFloat = rating % 1 !== 0;
		const num = isFloat ? Math.floor(rating) + '_half' : rating;
		return `static/media/yelp_stars/web_and_ios/${prefix}/${prefix}_${num}.png`;
	};

	render() {
		const cardClassList = [styles.card];
		if (this.props.isStacked) {
			cardClassList.push(styles.stackedCard);
		} else if (this.props.restaurantSelected) {
			cardClassList.push(styles.selectedCard);
		}

		return (
			<div 
				className={cardClassList.join(' ')} 
				ref={ref => this.card = ref}
			>
			{this.props.renderContent &&
				<React.Fragment>
					<div className={styles.content}>

					{/* Restaurant image */}
						{!this.props.isMobile &&
							<div className={styles.imgContainer}>
								{!this.props.restaurant.image_url ? 
									<p>This restaurant has no uploaded pictures.</p>
									:
									<a 
										href={this.props.restaurant.image_url} 
										target="_blank"
										rel="noopener noreferrer"
									>
										<FlexibleImg 
											src={this.props.restaurant.image_url}
											alt={this.props.restaurant.name}
											parentDepth={2}
											delay={500}
											restyleTriggers={[[this.props.restaurantSelected, 200]]}
											fitParentToImg={true}
										/>
									</a>
								}
							</div>
						}

					{/* Restaurant info and Yelp rating/logo */}
						<div className={styles.info}>
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
										src='static/media/YelpLogo_Trademark/Screen(R)/Yelp_trademark_RGB_outline.png'
										title='www.yelp.com'
										alt="Yelp logo"
									></img>
								</a>
							</div>

						{/* Filter buttons */}
							<div className={styles.filterBtns}>
								{this.props.restaurant.price &&
									<FilterBtn
										category={this.props.restaurant.price}
										restaurantSelected={this.props.restaurantSelected}
										changePrice={this.props.changePrice}
										key={0}
									/>
								}

								{this.props.restaurant.categories.map(category => {
									return (
										<FilterBtn
											category={category}
											restaurantSelected={this.props.restaurantSelected}
											addCategory={() => this.props.addCategory(category)}
											addFilter={() => this.props.addFilter(category)}
											key={category.alias}
										/>
									);
								})}
							</div>

						{/* Address info and "Show on Map" link */}
							<div className={styles.addressInfo}>
								<div className={styles.fullAddress}>
									{this.props.restaurant.location.display_address.map(str => (
										 <p key={str}>{str}</p>
									))}
								</div>
								<button onClick={this.props.showOnMap}>
									Show on Map
								</button>
							</div>

						{/* Contact info shown when restaurant is selected */}
							{this.props.restaurantSelected && 
								<div className={styles.contactInfo}>
									<h2>Contact</h2>
									{this.props.restaurant.display_phone &&
										<p>Phone: {this.props.restaurant.display_phone}</p>
									}
									<p>
										Find more info on&nbsp;
										<a 
											href={this.props.restaurant.url} 
											target="_blank"
											rel="noopener noreferrer"
										>
											the {this.props.restaurant.name} Yelp page
										</a>
										.
									</p>
								</div>
							}

						</div>
					</div>


				{/* Bottom action buttons */}
					{!this.props.restaurantSelected &&
						<div className={styles.actionBtns}>
							<ActionBtn id={0} action={() => this.props.nextRestaurant(false)} />
							<ActionBtn id={1} action={() => this.props.nextRestaurant(true)} />
							<ActionBtn id={2} action={this.props.selectRestaurant} />
						</div>
					}
				</React.Fragment>}
			</div>
		);
	}
}


export default Card;