import React from 'react';
import styles from 'styles/SearchBar.module.scss';


class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value || '',
			suggestions: [],
			inputFocused: false,
			isMobile: false,
		}
		this.mql = window.matchMedia('(max-width: 650px)');
	}

	componentDidMount() {
		this.mql.addListener(this.handleResize);
	}

	componentWillUnmount() {
		this.mql.removeListener(this.handleResize);
	}

	handleResize = event => {
		if (event.matches && !this.state.isMobile) {
			this.setState({isMobile: true});
		} else if (!event.matches && this.state.isMobile) {
			this.setState({isMobile: false});
		}
	}

	handleChange = event => {
		const value = event.target.value;
		this.setState({value});
		if (value.length >= 3) {
			this.updateSuggestions(value);
		}
	};

	updateSuggestions(value) {
		const url = `http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${value}&countryCode=USA&f=json`;

	  fetch(url) 
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Server response not ok");
				}
			})
			.then(json => {
				const suggestions = json.suggestions.map(s => trim(s.text));
				this.setState({suggestions});
			});
	}

	renderSuggestions() {
		if (this.state.inputFocused && this.state.value.length >= 3) {
			return this.state.suggestions.map(suggestion => {
				return (
					<div className={styles.suggestion} key={suggestion}>
						{suggestion}
					</div>
				);
			});
		}
	}

	onFocus = () => this.setState({inputFocused: true});
	onBlur = () => this.setState({inputFocused: false});

	render() {
		return (
			<form className={styles.searchBar} autoComplete="off">
				<div className={styles.suggestionsContainer}>
					<div className={styles.inputContainer}>
						<input 
							type="text" 
							name="search"
							value={this.state.value} 
							placeholder="Enter your location"
							onChange={this.handleChange}
							onFocus={this.onFocus}
							onBlur={this.onBlur}
						/>
					</div>
					{this.renderSuggestions()}
				</div>
				{this.state.isMobile ? null : <button type="submit">Find Me Food!</button>}
			</form>
		);
	}
}


function trim(text) {
	const splitString = text.split(', ');
	const filtered = splitString.filter(str => str !== 'USA');
	return filtered.join(', ');
}


export default SearchBar