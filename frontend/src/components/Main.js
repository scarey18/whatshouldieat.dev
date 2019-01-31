import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import styles from 'styles/Main.module.scss';


function Main() {
	return (
		<main className={styles.main}>
			<Switch>
				<Route exact path='/' component={Home}/>
			</Switch>
		</main>
	);
}

export default Main;