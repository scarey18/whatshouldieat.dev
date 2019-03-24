import React from 'react';
import styles from 'styles/LoadingRing.module.scss';


// Make sure to specify color and size in this component's parent container.
// Must have equal height and width to look right.

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