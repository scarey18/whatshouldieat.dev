import React from 'react';
import styles from 'styles/AddItemsList.module.scss';
import { categoryIsIncluded } from 'commonUtils/categoryFunctions';


function AddItemsList(props) {
	const items = props.items.map(item => {
		const bulletClassList = [styles.bullet];
		if (categoryIsIncluded(props.selectedItems, item)) {
			bulletClassList.push(styles.selected);
		}
		return (
			<div 
				key={item.alias}
				className={styles.item} 
				onClick={() => props.toggleSelection(item)}
			>
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
			<div className={styles.footer}>
				<button 
					onClick={props.applyChanges} 
					disabled={props.selectedItems.length === 0}
				>
					Apply Changes
				</button>
			</div>
		</React.Fragment>
	);
}


export default AddItemsList;