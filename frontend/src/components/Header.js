import React from 'react';
import SearchBar from './SearchBar';
import styles from 'styles/Header.module.scss';
import sadPlate from 'assets/sad-plate.png';


class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shouldExpand: window.location.pathname === '/',
			expanded: window.location.pathname === '/',
			searchBarValue: '',
			searchBarSuggestions: [],
			searchBarInputFocused: false,
		}
	}

	updateState = state => this.setState(state);

	renderExpandedContent = () => {
		if (this.state.expanded) {
			return (
				<div className={`${styles.container} ${styles.expandedContent}`}>
					<div className={styles.searchContainer}>
						<h1>Hungry?</h1>
						<SearchBar 
							isMobile={this.props.isMobile}
							value={this.state.searchBarValue}
							suggestions={this.state.searchBarSuggestions}
							inputFocused={this.state.searchBarInputFocused}
							updateState={state => this.updateState(state)}
						/>
					</div>
					<img src={sadPlate} alt="Sad, empty plate :("></img>
				</div>
			);
		}
	};

	render() {
		const classList = [styles.header];
		if (this.state.expanded) {
			classList.push(styles.expanded);
		}

		return (
			<div className={classList.join(' ')}>
				<div className={`${styles.container} ${styles.permanentContent}`}>
					<p>TODO: Logo</p>
					{!this.state.expanded &&
						<SearchBar
							isMobile={this.props.isMobile}
							value={this.state.searchBarValue}
							suggestions={this.state.searchBarSuggestions}
							inputFocused={this.state.searchBarInputFocused}
							updateState={state => this.updateState(state)}
						/>
					}
					<p>TODO: Links</p>
					<button onClick={() => this.setState({expanded: !this.state.expanded})}>
						Toggle Expand
					</button>
				</div>
				{this.renderExpandedContent()}
			</div>
		);
	}
}


export default Header;