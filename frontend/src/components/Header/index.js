import React from 'react';
import SearchBar from './SearchBar';
import styles from 'styles/Header.module.scss';
import sadPlate from 'assets/sad-plate.png';
import logo from 'assets/wsie_logo.png';


class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: props.location === null,
			// SearchBar states kept here to keep state when Header expands/contracts.
			searchBarValue: props.location || '',
			searchBarSuggestions: [],
			focusedSuggestion: null,
			searchBarInputFocused: false,
		}
	}

	componentDidMount() {
		if (this.props.location === null) {
			window.addEventListener('scroll', this.toggleExpand);
		}
		this.initialState = this.state;
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.toggleExpand);
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.handleLocationChange();
		}
	}

	handleLocationChange = () => {
		if (this.props.location === null) {
			window.addEventListener('scroll', this.toggleExpand);
			this.setState(this.initialState);
		} else {
			window.removeEventListener('scroll', this.toggleExpand);
			this.setState({
				searchBarValue: this.props.location, 
				expanded: false,
				searchBarInputFocused: false,
				focusedSuggestion: null,
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

	render() {
		const classList = [styles.header];
		if (this.state.expanded) {
			classList.push(styles.expanded);
		}

		return (
			<div className={classList.join(' ')}>

				{/* Upper, permanent links */}
				<div className={styles.permanentContent}>
					<img src={logo} onClick={this.props.goHome} alt="Site Logo"></img>
					{!this.state.expanded &&
						<SearchBar
							expanded={this.state.expanded}
							isMobile={this.props.isMobile}
							value={this.state.searchBarValue}
							suggestions={this.state.searchBarSuggestions}
							inputFocused={this.state.searchBarInputFocused}
							updateState={state => this.setState(state)}
							setLocation={value => this.props.setLocation(value)}
							focusedSuggestion={this.state.focusedSuggestion}
						/>
					}
				</div>

			{/* Home content */}
				{this.state.expanded &&
					(<div className={styles.expandedContent}>
						<div className={styles.searchContainer}>
							<h1>Hungry?</h1>
							<SearchBar
								expanded={this.state.expanded}
								isMobile={this.props.isMobile}
								value={this.state.searchBarValue}
								suggestions={this.state.searchBarSuggestions}
								inputFocused={this.state.searchBarInputFocused}
								updateState={state => this.setState(state)}
								setLocation={value => this.props.setLocation(value)}
								focusedSuggestion={this.state.focusedSuggestion}
							/>
						</div>
						<img src={sadPlate} alt="Sad, empty plate :("></img>
					</div>)
				}
			</div>
		);
	}
}


export default Header;