import React from 'react';
import styles from 'styles/FilterBtn.module.scss';


class FilterBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			hover: false,
			showFilterText: false,
		}

	// Different filter depending on whether button is for price or food category
		this.firstFilterOption = this.props.category.title ? 
			"Don't show me any more " + this.props.category.title :
			"I'm looking for something cheaper";

		this.secondFilterOption = this.props.category.title ?
			"Only show me " + this.props.category.title : 
			"Only show me restaurants this price or cheaper";
	}

	componentDidMount() {
		window.addEventListener('click', this.handleClick);
		this.adjustEdges();
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.handleClick);
		clearTimeout(this.filterTextTimeout);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.expanded !== this.state.expanded) {
			this.startTimeout();
		}
	}

// Wait for css transition before we show text
	startTimeout = () => {
		clearTimeout(this.filterTextTimeout);
		const time = this.state.expanded ? 200 : 0;
		this.filterTextTimeout = setTimeout(() => {
			this.setState({showFilterText: this.state.expanded});
		}, time);
	};

	handleClick = event => {
		if (event.target !== this.btn && this.state.expanded) {
			this.setState({expanded: false});
		}
	};

	onClick = () => {
		this.adjustEdges();
		this.setState(prevState => ({
			expanded: !prevState.expanded,
		}));
	};

	adjustEdges = () => {
		const expandedRect = this.expandedContent.getBoundingClientRect();
		const btnRect = this.btn.getBoundingClientRect();
		if (expandedRect.width > window.screen.width) {
			this.expandedContent.style.left = `-${btnRect.left}px`;
			this.expandedContent.style.width = '100vw';
		} else if (expandedRect.left < 0) {
			this.expandedContent.style.left = `-${btnRect.left}px`;
		} else if (expandedRect.right > window.screen.width) {
			const difference = window.screen.width - btnRect.right;
			this.expandedContent.style.right = `-${difference}px`;
		}
	};

	onMouseEnter = () => this.setState({hover: true});

	onMouseLeave = () => this.setState({hover: false});

	render() {
		const classList = [styles.filterBtn];
		if (this.state.expanded) {
			classList.push(styles.focused);
		}
		if (this.props.restaurantSelected) {
			classList.push(styles.disabled);
		}

		const borderStyle = {
			width: (this.state.hover || this.state.expanded ? "100%" : 0),
		};

		const expandedStyle = {height: (this.state.expanded ? "6rem" : 0)};

		const filterOptionStyle = {
			visibility: (this.state.showFilterText ? 'visible' : 'hidden'),
		}

		const price = this.props.category.title ? null : this.props.category.length;

		return (
			<div
				className={classList.join(' ')}
				onClick={this.props.restaurantSelected ? null : this.onClick}
				onMouseEnter={this.props.restaurantSelected ? null : this.onMouseEnter}
				onMouseLeave={this.props.restaurantSelected ? null : this.onMouseLeave}
				ref={ref => this.btn = ref}
				title={this.props.restaurantSelected ? "" : "Click to filter"}
			>
				{this.props.category.title || this.props.category}

			{/* Absolute div to act as bottom border for css transition */}
				<div className={styles.border} style={borderStyle}></div>

			{/* Filter options */}
				<div 
					className={styles.expanded} 
					style={expandedStyle}
					ref={ref => this.expandedContent = ref}
				>
					<div 
						className={`${styles.filterOption} ${styles.firstOption}`}
						style={filterOptionStyle}
						onClick={price ? () => this.props.changePrice(price - 1) : 
							this.props.addFilter}
					>
						{this.firstFilterOption}
					</div>
					<div 
						className={styles.filterOption}
						style={filterOptionStyle}
						onClick={price ? () => this.props.changePrice(price) : 
							this.props.addCategory}
					>
						{this.secondFilterOption}
					</div>
				</div>
			</div>
		);
	}
}


export default FilterBtn;