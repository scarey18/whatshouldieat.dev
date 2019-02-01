import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import SuggestRestaurants from './SuggestRestaurants';
import styles from 'styles/Main.module.scss';


function Main() {
	return (
		<main className={styles.main}>
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/suggest/:location' component={SuggestRestaurants}/>
			</Switch>
		</main>
	);
}


export default Main;