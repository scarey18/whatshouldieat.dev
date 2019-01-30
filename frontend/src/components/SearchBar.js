import React from 'react';
import styles from 'styles/SearchBar.module.scss';


class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value || '',
			suggestions: [],
			inputFocused: false,
		}
	}

	handleChange = event => {
		const value = event.target.value;
		this.setState({value});
		if (value.length >= 3) {
			this.updateSuggestions(value);
		}
	};

	updateSuggestions = value => {
		const url = `http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${value}&category=Address,Primary+Postal,City&countryCode=USA&f=json`;

	  fetch(url) 
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Server response not ok");
				}
			})
			.then(json => {
				const suggestions = json.suggestions.reduce((acc, suggestion) => {
					const trimmed = trim(suggestion.text);
					if (!acc.includes(trimmed)) {
						acc.push(trimmed);
					}
					return acc;
				}, []);
				this.setState({suggestions});
			});
	};

	renderSuggestions = () => {
		if (!this.state.inputFocused || this.state.value.length <= 3) {
			return;
		}
		return this.state.suggestions.map(suggestion => (
			<div 
				className={styles.suggestion} 
				key={suggestion} 
				onClick={this.handleSuggestionClick}
			>
				{suggestion}
			</div>
		));
	};

	handleSuggestionClick = event => {
		const value = event.target.textContent;
		this.setState({value});
	};

	onFocus = () => this.setState({inputFocused: true});
	onBlur = () => setTimeout(() => this.setState({inputFocused: false}), 200);

	render() {
		return (
			<form className={styles.searchBar} autoComplete="off" action="/api/restaurants">
				<div className={styles.suggestionsContainer}>
					<div className={styles.inputContainer}>
						<input 
							type="text" 
							name="location"
							value={this.state.value} 
							placeholder="Enter your location"
							onChange={this.handleChange}
							onFocus={this.onFocus}
							onBlur={this.onBlur}
						/>
					</div>
					{this.renderSuggestions()}
				</div>
				{this.props.isMobile ? null : <button type="submit">Find Me Food!</button>}
			</form>
		);
	}
}


const REGEX = /USA( \(.+\))?/;

function trim(text) {
	const splitString = text.split(', ');
	const filtered = splitString.filter(str => !REGEX.test(str));
	return filtered.join(', ');
}


export default SearchBar