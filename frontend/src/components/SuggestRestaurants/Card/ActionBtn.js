import React from 'react';
import styles from 'styles/ActionBtn.module.scss';


function ActionBtn(props) {
	let value;
	const classList = [styles.actionBtn];
	let faClassList;
	const faSize = props.isMobile ? "fa-lg" : "fa-2x";
	let title;

	switch (props.id) {
		case 0: {
			faClassList = `fa fa-thumbs-down ${faSize}`;
			value = <i className={faClassList}></i>;
			classList.push(styles.reject);
			title = "Click to reject restaurant"
			break;
		}
		case 1: {
			value = "Save and skip";
			classList.push(styles.maybe);
			title = "Click to skip but save restaurant"
			break;
		}
		case 2: {
			faClassList = `fa fa-thumbs-up ${faSize}`;
			value = <i className={faClassList}></i>;
			classList.push(styles.accept);
			title = "Click to select restaurant"
			break;
		}
		default: {
			break;
		}
	}

	return (
		<button 
			className={classList.join(' ')} 
			onClick={props.action}
			title={title}
		>
			{value}
		</button>
	);
}


export default ActionBtn;