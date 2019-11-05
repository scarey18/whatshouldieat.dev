import React from 'react';
import styles from 'styles/PriceSelection.module.scss';


class PriceSelection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPrice: props.price,
			hoveredPrice: null,
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.price !== prevProps.price) {
			this.setState({selectedPrice: this.props.price});
		}
	}

	handleMouseEnter = i => {
		if (i !== this.state.hoveredPrice) {
			this.setState({hoveredPrice: i});
		}
	};

	handleMouseLeave = () => {
		this.setState({hoveredPrice: null});
	};

	render() {
		const pricePoints = [];
		for (let i = 1; i <= 4; i++) {
			const priceClassList = [styles.priceSign];
			if (this.state.hoveredPrice && i <= this.state.hoveredPrice) {
				priceClassList.push(styles.activePricePoint);
			} else if (!this.state.hoveredPrice && i <= this.state.selectedPrice) {
				priceClassList.push(styles.activePricePoint);
			}
			pricePoints.push(
				<span
					key={i}
					className={priceClassList.join(' ')}
					onMouseEnter={() => this.handleMouseEnter(i)}
					onClick={() => this.setState({selectedPrice: i})}
					title={`Set maximum price to ${'$'.repeat(i)}`}
				>$</span>
			);
		}

		return (
			<div className={styles.container}>
				<div onMouseLeave={this.handleMouseLeave}>{pricePoints}</div>
				<button
					disabled={this.state.selectedPrice === this.props.price}
					onClick={() => this.props.onPriceChange(this.state.selectedPrice)}
				>
					Apply Change
				</button>
			</div>
		)
	}
}


export default PriceSelection;