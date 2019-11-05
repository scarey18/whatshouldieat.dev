import React from 'react';
import styles from 'styles/ActiveItemList.module.scss';


function ActiveItemList(props) {
	return (
		props.list.length === 0 ? 
			<p>{props.emptyListText}</p> :
			<ul>
				{props.list.map((item, i) => (
					<div className={styles.item} key={i}>
						<li>{item.title}</li>
						<button onClick={() => props.handleDeleteItem(item)}>
							Delete
						</button>
					</div>
				))}
			</ul>
	);
}


export default ActiveItemList;