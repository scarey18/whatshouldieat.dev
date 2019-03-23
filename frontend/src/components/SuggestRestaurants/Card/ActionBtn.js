import React from 'react';
import styles from 'styles/ActionBtn.module.scss';


function ActionBtn(props) {
	let value;
	const classList = [styles.actionBtn];
	const faClassList = props.isMobile ? 
		"fas fa-thumbs-down fa-lg" : 
		"fas fa-thumbs-down fa-2x";
	switch (props.id) {
		case 0: {
			value = <i className={faClassList}></i>;
			classList.push(styles.reject);
			break;
		}
		case 1: {
			value = "Save and skip";
			classList.push(styles.maybe);
			break;
		}
		case 2: {
			value = <i className={faClassList}></i>;
			classList.push(styles.accept);
			break;
		}
		default: {
			break;
		}
	}

	if (props.isMobile) {
		classList.push(styles.isMobile);
	}

	return (
		<div className={classList.join(' ')} onClick={props.action}>
			{value}
		</div>
	);
}


export default ActionBtn;