import React from 'react';
import Home from './Home';
import SuggestRestaurants from './SuggestRestaurants';
import styles from 'styles/Main.module.scss';


function Main(props) {
	return (
		<main className={styles.main}>
			{props.location === null ?
				<Home /> :
				<SuggestRestaurants 
					location={props.location}
					isMobile={props.isMobile}
				/>
			}
		</main>
	);
}


export default Main;