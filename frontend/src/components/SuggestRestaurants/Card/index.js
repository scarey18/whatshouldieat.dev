import React from 'react';
import styles from 'styles/Card.module.scss';
import FilterBtn from './FilterBtn';
import ActionBtn from './ActionBtn';
import FlexibleImg from 'components/common/FlexibleImg';


class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			renderContent: props.renderContent,
		}
	}

	componentDidMount() {
		if (this.props.renderContent) {
			this.card.addEventListener('mousedown', this.handleTouchStart);
			this.card.addEventListener('touchstart', this.handleTouchStart);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Wait for animation before rendering new restaurant
		if (this.props.renderContent && !this.state.renderContent) {
			this.transitionTimeout = setTimeout(
				() => this.setState({renderContent: true}), 
				300
			);
			this.card.addEventListener('mousedown', this.handleTouchStart);
			this.card.addEventListener('touchstart', this.handleTouchStart);
		} else if (!this.props.renderContent && this.state.renderContent) {
			this.setState({renderContent: false});
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
		if (!this.state.renderContent) {
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
		if (!this.state.renderContent) {
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
		return `assets/yelp_stars/web_and_ios/${prefix}/${prefix}_${num}.png`;
	};

	render() {
		const cardClassList = [styles.card];
		if (!this.state.renderContent) {
			cardClassList.push(styles.stackedCard);
		}

		const categories = [this.props.restaurant.price].concat(this.props.restaurant.categories);

		return (
			<div 
				className={cardClassList.join(' ')} 
				ref={ref => this.card = ref}
			>
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
									<FlexibleImg 
										src={this.props.restaurant.image_url}
										alt={this.props.restaurant.name}
										parentDepth={2}
										delay={315}
									/>
								</a>
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
											key={filterValue}
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
						<ActionBtn id={0} action={() => this.props.nextRestaurant(false)} />
						<ActionBtn id={1} action={() => this.props.nextRestaurant(true)} />
						<ActionBtn id={2} />
					</div>
				</React.Fragment>}
			</div>
		);
	}
}


export default Card;