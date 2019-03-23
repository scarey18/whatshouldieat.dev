import React from 'react';
import styles from 'styles/ActionBtn.module.scss';


function ActionBtn(props) {
	let value;
	const classList = [styles.actionBtn];
	let faClassList;
	const faSize = props.isMobile ? "fa-lg" : "fa-2x";
	switch (props.id) {
		case 0: {
			faClassList = `fa fa-thumbs-down ${faSize}`;
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
			faClassList = `fa fa-thumbs-up ${faSize}`;
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