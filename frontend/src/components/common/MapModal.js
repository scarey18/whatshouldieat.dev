import React from 'react';
import styles from 'styles/MapModal.module.scss';
import LoadingRing from './LoadingRing';


class MapModal extends React.Component {
	componentDidUpdate(prevProps) {
		if (this.props.render && !prevProps.render) {
			window.addEventListener('keydown', this.handleKeyDown);
		} else if (!this.props.render && prevProps.render) {
			window.removeEventListener('keydown', this.handleKeyDown);
		}
	}

	getSrc = () => {
		const restaurant = this.props.restaurant;
		if (this.props.render && (!this.restaurant || this.restaurant !== restaurant)) {
			this.restaurant = restaurant;
			const urledAddress = restaurant.location.address1.replace(/ /g, '+');
			const urledCity = restaurant.location.city.replace(/ /g, '+');
			const state = restaurant.location.state;
			const location = `${urledAddress},${urledCity}+${state}`;
			this.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDKqk8m58bRFV5vCV5Wf-lPdzCfZtYZlcE&q=${location}`;
		}
		return this.src;
	};

	handleKeyDown = e => {
		if (e.key === "Escape") {
			this.props.onClose();
		}
	};

	handleClick = () => {
		this.props.onClose();
	}

	render() {
		const classList = [styles.modal];
		if (!this.props.render) {
			classList.push(styles.hidden);
		}

		return (
			<div className={classList.join(' ')} onClick={this.handleClick}>
				<i 
					className="fas fa-times fa-2x"
					onClick={this.props.onClose}
				></i>
				<div className={styles.loadingRingContainer}>
					<LoadingRing />
				</div>
				<iframe 
					src={this.getSrc()} 
					title="Google Map centered on current restaurant"
				>
				</iframe>
			</div>
		);
	}
}


export default MapModal;