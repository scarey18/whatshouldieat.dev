import React from 'react';
import styles from 'styles/LoadingRing.module.scss';


function LoadingRing(props) {
	return (
		<div className={styles.ldsRing}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}


export default LoadingRing;