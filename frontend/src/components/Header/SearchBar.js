import React from 'react';
import styles from 'styles/SearchBar.module.scss';


class SearchBar extends React.Component {
	componentDidMount() {
		if (this.props.inputFocused) {
			this.input.focus();
		}
		this.input.addEventListener('keydown', this.handleEnter);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
		this.input.removeEventListener('keydown', this.handleEnter);
	}

	handleEnter = event => {
		if (event.code === 'Enter' && this.props.suggestions.length > 0) {
			const value = this.props.suggestions[0];
			this.props.setLocation(value);
		}
	};

	handleChange = event => {
		const value = event.target.value;
		this.props.updateState({searchBarValue: value});
		if (value.length >= 3) {
			this.updateSuggestions(value);
		}
	};

	updateSuggestions = async value => {
		const url = `http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${value}&category=Address,Primary+Postal,City&countryCode=USA&f=json`;
	  const resp = await fetch(url);
	  let data;
	  if (resp.ok) {
	  	data = await resp.json();
	  } else {
	  	throw new Error("Server response not ok");
	  }
	  const suggestions =  data.suggestions.reduce((acc, suggestion) => {
			const trimmed = trim(suggestion.text);
			if (!acc.includes(trimmed)) {
				acc.push(trimmed);
			}
			return acc;
		}, []);
		this.props.updateState({searchBarSuggestions: suggestions});
	};

	onFocus = () => {
		this.props.updateState({searchBarInputFocused: true});
		if (this.props.value.length >= 3 && 
				this.props.suggestions.length === 0) {
			this.updateSuggestions(this.props.value);
		}
	};

	onBlur = () => {
		this.timeout = setTimeout(() => this.props.updateState({
			searchBarInputFocused: false,
		}), 200);
	};

	btnClick = event => {
		event.preventDefault();
		clearTimeout(this.timeout);
		this.input.focus();
	};

	renderSuggestions = () => {
		if (!this.props.inputFocused || this.props.value.length <= 3) {
			return;
		}
		return this.props.suggestions.map(suggestion => (
			<div 
				className={styles.suggestion} 
				key={suggestion}
				onClick={() => this.props.setLocation(suggestion)}
			>
				{suggestion}
			</div>
		));
	};


	render() {
		const classList = [styles.searchBar];
		if (this.props.expanded) {
			classList.push(styles.expanded);
		}

		return (
			<form 
				className={classList.join(' ')} 
				autoComplete="off" 
			>
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
				{!this.props.isMobile && 
					<button onClick={this.btnClick}>Find Me Food!</button>}
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