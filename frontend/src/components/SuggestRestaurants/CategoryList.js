import React from 'react';
import styles from 'styles/CategoryList.module.scss';


class CategoryList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: props.categories.map(c => [c, true]),
		}
	}

	render() {
		return (
			<div>
				
			</div>
		)
	}
}


export default CategoryList;