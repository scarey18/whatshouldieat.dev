import React from 'react';
import styles from 'styles/SearchBar.module.scss';


function trim(text) {
	const splitString = text.split(', ');
	const regex = /USA( \(.+\))?/;
	const filtered = splitString.filter(str => !regex.test(str));
	return filtered.join(', ');
}


class SearchBar extends React.Component {
	componentDidMount() {
		if (this.props.inputFocused) {
			this.input.focus();
		}
		this.input.addEventListener('keydown', this.handleKeyDown);
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
		this.input.removeEventListener('keydown', this.handleKeyDown);
	}

	handleKeyDown = event => {
		if (event.code === 'Enter' && this.props.suggestions.length > 0) {
			const i = this.props.focusedSuggestion || 0;
			const value = this.props.suggestions[i];
			this.props.setLocation(value);
		} else if (event.code === 'ArrowDown' && this.props.suggestions.length > 0) {
			event.preventDefault();
			let i = this.props.focusedSuggestion;
			if (i === null) {
				i = 0;
			} else if (i < 4) {
				i++;
			}
			this.props.updateState({focusedSuggestion: i});
		} else if (event.code === 'ArrowUp' && this.props.suggestions.length > 0) {
			event.preventDefault();
			let i = this.props.focusedSuggestion;
			if (i !== null && i > 0) {
				i--;
			}
			this.props.updateState({focusedSuggestion: i});
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
		this.input.setSelectionRange(0, this.input.value.length);
		{/* Update suggestions if they get lost on a page change */}
		if (this.props.value.length >= 3 && 
					this.props.suggestions.length === 0) {
			this.updateSuggestions(this.props.value);
		}
	};

	onBlur = () => {
		this.timeout = setTimeout(() => {
			this.props.updateState({
				searchBarInputFocused: false,
				focusedSuggestion: null,
			});
		}, 200);
	};

	btnClick = event => {
		event.preventDefault();
		clearTimeout(this.timeout);
		if (this.props.suggestions.length > 0) {
			const i = this.props.focusedSuggestion || 0;
			const value = this.props.suggestions[i];
			this.props.setLocation(value);
		} else {
			this.input.focus();
		}
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

					{/* Suggestions */}
					{this.props.inputFocused && 
						this.props.value.length >= 3 &&
						this.props.suggestions.map((suggestion, i) => {
							const suggestionClassList = [styles.suggestion];
							if (this.props.focusedSuggestion === i) {
								suggestionClassList.push(styles.focused);
							}
							return (
								<div 
									className={suggestionClassList.join(' ')} 
									key={suggestion}
									onMouseEnter={() => this.props.updateState({focusedSuggestion: i})}
									onClick={() => this.props.setLocation(suggestion)}
								>
									{suggestion}
								</div>
							);
						})
					}
						
				</div>

				{!this.props.isMobile && 
					<button onClick={this.btnClick}>Find Me Food!</button>}
			</form>
		);
	}
}


export default SearchBar