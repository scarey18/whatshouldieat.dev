import React from 'react';
import styles from 'styles/SearchBar.module.scss';


class SearchBar extends React.Component {
	render() {
		return (
			<form className={styles.searchBar} method="get" autocomplete="off">
				<div className={styles.autocompleteContainer}>
					<div className={styles.inputContainer}>
						<input type="text" name="search" placeholder="Enter your location"/>
					</div>
				</div>
				<button type="submit">Find Me Food!</button>
			</form>
		);
	}
}


export default SearchBar