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

		this.firstFilterOption = this.props.category.title ? 
			"I don't want " + this.props.category.title :
			"I'm looking for something cheaper";

		this.secondFilterOption = this.props.category.title ?
			"Only show me " + this.props.category.title : 
			"Only show me restaurants around this price";
	}

	componentDidMount() {
		window.addEventListener('click', this.handleClick);
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

	startTimeout = () => {
		clearTimeout(this.filterTextTimeout);
		const time = this.state.expanded ? 200 : 0;
		this.filterTextTimeout = setTimeout(() => {
			this.setState({showFilterText: this.state.expanded});
		}, time);
	};

	handleClick = event => {
		if (event.target !== this.ref && this.state.expanded) {
			this.setState({expanded: false});
		}
	};

	onClick = () => {
		this.setState(prevState => ({
			expanded: !prevState.expanded,
		}));
	};

	onMouseEnter = () => this.setState({hover: true});

	onMouseLeave = () => this.setState({hover: false});

	render() {
		const classList = [styles.filterBtn];
		if (this.state.expanded) {
			classList.push(styles.focused);
		}
		const borderStyle = {width: (this.state.hover || this.state.expanded ? "100%" : 0)};
		const expandedStyle = {height: (this.state.expanded ? "6rem" : 0)};
		const filterOptionStyle = {
			visibility: (this.state.showFilterText ? 'visible' : 'hidden'),
		}

		return (
			<div
				className={classList.join(' ')}
				onClick={this.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				ref={ref => this.ref = ref}
				title="Click to filter"
			>
				{this.props.category.title || this.props.category}
				<div className={styles.border} style={borderStyle}></div>
				<div className={styles.expanded} style={expandedStyle}>
					<div 
						className={`${styles.filterOption} ${styles.firstOption}`}
						style={filterOptionStyle}
						onClick={() => console.log('nah')}
					>
						{this.firstFilterOption}
					</div>
					<div 
						className={styles.filterOption}
						style={filterOptionStyle}
					>
						{this.secondFilterOption}
					</div>
				</div>
			</div>
		)
	}
}


export default FilterBtn;