import React from 'react';
import styles from 'styles/Sidebar.module.scss';


class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {expanded: false};
	}

	handleTabClick = () => {
		this.setState({expanded: !this.state.expanded});
	};

	render() {
		const classList = [styles.sidebar];
		if (this.state.expanded) {
			classList.push(styles.expanded);
		}

		const fasClass = this.state.expanded ? 'fa-chevron-right' : 'fa-chevron-left';

		const contentStyle = {};
		if (!this.state.expanded) {
			contentStyle.display = 'none';
		}

		return (
			<div className={classList.join(' ')}>
				<div className={styles.tab} onClick={this.handleTabClick}>
					<i className={'fas ' + fasClass + ' fa-lg'}></i>
				</div>
				<div className={styles.content} style={contentStyle}>
					{this.props.children}
				</div>
			</div>
		)
	}
}


export default Sidebar;