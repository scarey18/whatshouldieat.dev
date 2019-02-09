import React from 'react';
import styles from 'styles/FilterBtn.module.scss';


class FilterBtn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			hover: false,
		}
	}

	onClick = () => {
		this.setState(prevState => ({
			expanded: !prevState.expanded
		}));
	};

	onMouseEnter = () => this.setState({hover: true});

	onMouseLeave = () => this.setState({hover: false});

	render() {
		return (
			<div
				className={styles.filterBtn}
				onClick={this.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
			>
				{this.state.hover &&
					<div className={styles.border}></div>}
				{this.props.category.title || this.props.category}
			</div>
		)
	}
}


export default FilterBtn;