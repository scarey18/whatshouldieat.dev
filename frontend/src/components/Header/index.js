import React from 'react';
import SearchBar from './SearchBar';
import styles from 'styles/Header.module.scss';
import sadPlate from 'static/media/sad-plate.png';
import logo from 'static/media/wsie_logo.png';
import { scrollToForm } from 'commonUtils/miscFunctions';


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
			document.addEventListener('scroll', this.toggleExpand);
		}
		this.initialState = this.state;
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.toggleExpand);
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.handleLocationChange();
		}
	}

	handleLocationChange = () => {
		if (this.props.location === null) {
			document.addEventListener('scroll', this.toggleExpand);
			this.setState(this.initialState);
		} else {
			document.removeEventListener('scroll', this.toggleExpand);
			this.setState({
				searchBarValue: this.props.location, 
				expanded: false,
				searchBarInputFocused: false,
				focusedSuggestion: null,
			});
		}
	};

	toggleExpand = () => {
		if (window.scrollY === 0 && !this.state.expanded) {
			this.setState({expanded: true});
		} else if (window.scrollY > 0 && this.state.expanded) {
			this.setState({expanded: false});
		}
	};

	render() {
		const classList = [styles.header];
		if (this.state.expanded) {
			classList.push(styles.expanded);
		}

		return (
			<header className={classList.join(' ')}>

				{/* Unexpanded or permanent content */}
				<div className={styles.permanentContent}>
					<img src={logo} onClick={this.props.goHome} alt="Site Logo" title="Go to home page"></img>
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

			{/* Expanded content for home page */}
				{this.state.expanded &&
					(<div className={styles.expandedContent}>
						<div className={styles.expandedMain}>
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
						</div>
						<button 
							className={styles.scrollBtn} 
							onClick={scrollToForm}
							title="Collapse Header"
						>
							<i className="fas fa-chevron-down"></i>
						</button>
					</div>)
				}
			</header>
		);
	}
}


export default Header;