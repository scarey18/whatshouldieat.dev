import React from 'react';
import styles from 'styles/AddItemsList.module.scss';
import categoryIsIncluded from 'commonUtils/categoryIsIncluded';


function AddItemsList(props) {
	const items = props.items.map(item => {
		const bulletClassList = [styles.bullet];
		if (categoryIsIncluded(props.selectedItems, item)) {
			bulletClassList.push(styles.selected);
		}
		return (
			<div className={styles.item}>
				<div className={bulletClassList.join(' ')}></div>
				<span>{item.title}</span>
			</div>
		)
	});

	return (
		<React.Fragment>
			<div className={styles.container}>
				{items}
			</div>
		</React.Fragment>
	);
}


export default AddItemsList;