import React from 'react';
import styles from 'styles/ActionBtn.module.scss';


function ActionBtn(props) {
	let value;
	const classList = [styles.actionBtn];
	switch (props.id) {
		case 0: {
			value = "Nope";
			classList.push(styles.reject);
			break;
		}
		case 1: {
			value = "Save this but show me other options";
			classList.push(styles.maybe);
			break;
		}
		case 2: {
			value = "This is it!";
			classList.push(styles.accept);
			break;
		}
		default: {
			break;
		}
	}

	return (
		<div className={classList.join(' ')} onClick={props.action}>
			{value}
		</div>
	);
}


export default ActionBtn;