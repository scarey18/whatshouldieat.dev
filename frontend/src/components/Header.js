import React from 'react';
import SearchBar from './SearchBar';
import styles from 'styles/Header.module.scss';
import sadPlate from 'assets/sad-plate.png';


class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldExpand: props.shouldExpand,
			expanded: props.shouldExpand,
		}
	}

	renderExpandedContent = () => {
		if (this.state.expanded) {
			return (
				<div className={`${styles.container} ${styles.expandedContent}`}>
					<div className={styles.searchContainer}>
						<h1>Hungry?</h1>
						<SearchBar isMobile={this.props.isMobile}/>
					</div>
					<img src={sadPlate} alt="Sad, empty plate :("></img>
				</div>
			);
		}
	}

	render() {
		const classList = [styles.header];
		if (this.state.expanded) {
			classList.push(styles.expanded);
		}

		return (
			<div className={classList.join(' ')}>
				<div className={`${styles.container} ${styles.permanentContent}`}>
					<p>TODO: Logo</p>
					<p>TODO: Links</p>
				</div>
				{this.renderExpandedContent()}
			</div>
		);
	}
}


export default Header;