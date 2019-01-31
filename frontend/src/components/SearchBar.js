import React from 'react';
import styles from 'styles/SearchBar.module.scss';


class SearchBar extends React.Component {
	componentDidMount() {
		if (this.props.inputFocused) {
			this.input.focus();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	handleChange = event => {
		const value = event.target.value;
		this.props.updateState({searchBarValue: value});
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
				this.props.updateState({searchBarSuggestions: suggestions});
			});
	};

	renderSuggestions = () => {
		if (!this.props.inputFocused || this.props.value.length <= 3) {
			return;
		}
		return this.props.suggestions.map(suggestion => (
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
		this.props.updateState({searchBarValue: value});
	};

	onFocus = () => this.props.updateState({searchBarInputFocused: true});
	onBlur = () => {
		this.timeout = setTimeout(() => this.props.updateState({
			searchBarInputFocused: false
		}), 200)
	};

	render() {
		return (
			<form className={styles.searchBar} autoComplete="off" action="/api/restaurants">
				<div className={styles.suggestionsContainer}>
					<div className={styles.inputContainer}>
						<input 
							type="text" 
							name="location"
							value={this.props.value} 
							placeholder="Enter your location"
							onChange={this.handleChange}
							onFocus={this.onFocus}
							onBlur={this.onBlur}
							ref={input => this.input = input}
						/>
					</div>
					{this.renderSuggestions()}
				</div>
				{!this.props.isMobile && <button type="submit">Find Me Food!</button>}
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