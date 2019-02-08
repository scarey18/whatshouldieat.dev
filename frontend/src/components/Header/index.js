import React from 'react';
import SearchBar from './SearchBar';
import styles from 'styles/Header.module.scss';
import sadPlate from 'assets/sad-plate.png';


class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: props.location === null,
			// SearchBar states kept here to keep state when Header expands/contracts.
			searchBarValue: props.location || '',
			searchBarSuggestions: [],
			searchBarInputFocused: false,
		}
	}

	componentDidMount() {
		if (this.props.location === null) {
			window.addEventListener('scroll', this.toggleExpand);
		}
		this.initialState = this.state;
		window.addEventListener('popstate', this.handlePopstate);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.toggleExpand);
		window.removeEventListener('popstate', this.handlePopstate);
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.handleLocationChange();
		}
	}

	handleLocationChange = () => {
		if (this.props.location === null) {
			window.addEventListener('scroll', this.toggleExpand);
			this.setState(this.initialState)
		} else {
			window.removeEventListener('scroll', this.toggleExpand);
			this.setState({
				searchBarValue: this.props.location, 
				expanded: false,
				searchBarInputFocused: false,
			});
		}
	};

	toggleExpand = () => {
		if (window.scrollY <= 150 && !this.state.expanded) {
			this.setState({expanded: true});
		} else if (window.scrollY > 150 && this.state.expanded) {
			this.setState({expanded: false});
		}
	};

	updateState = state => this.setState(state);

	renderExpandedContent = () => {
		if (this.state.expanded) {
			return (
				<div className={styles.expandedContent}>
					<div className={styles.searchContainer}>
						<h1>Hungry?</h1>
						<SearchBar
							expanded={this.state.expanded}
							isMobile={this.props.isMobile}
							value={this.state.searchBarValue}
							suggestions={this.state.searchBarSuggestions}
							inputFocused={this.state.searchBarInputFocused}
							updateState={state => this.updateState(state)}
							setLocation={value => this.props.setLocation(value)}
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
				<div className={styles.permanentContent}>
					<p>TODO: Logo</p>
					{!this.state.expanded &&
						<SearchBar
							expanded={this.state.expanded}
							isMobile={this.props.isMobile}
							value={this.state.searchBarValue}
							suggestions={this.state.searchBarSuggestions}
							inputFocused={this.state.searchBarInputFocused}
							updateState={state => this.updateState(state)}
							setLocation={value => this.props.setLocation(value)}
						/>
					}
					<p>TODO: Links</p>
				</div>
				{this.renderExpandedContent()}
			</div>
		);
	}
}


export default Header;