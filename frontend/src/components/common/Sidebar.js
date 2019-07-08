import React from 'react';
import styles from 'styles/Sidebar.module.scss';


class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {expanded: false};
	}

	componentDidMount() {
		window.addEventListener('click', this.handleWindowClick);
		this.container.addEventListener('transitionend', this.handleTransitionEnd);
	}

	componentWillUnmount() {
		this.container.removeEventListener('transitionend', this.handleTransitionEnd);
		window.removeEventListener('click', this.handleWindowClick);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.state.expanded && prevState.expanded) {
			this.contentDiv.style.display = null;
		}
	}

	handleWindowClick = e => {
		if (this.state.expanded && !isDescendant(this.container, e.target)) {
			this.setState({expanded: false});
		}
	};

	handleTabClick = () => {
		this.setState({expanded: !this.state.expanded});
	};

	handleTransitionEnd = e => {
		if (e.target === this.container && this.state.expanded) {
			this.contentDiv.style.display = 'block';
		}
	};

	render() {
		const classList = [styles.sidebar];
		if (this.state.expanded) {
			classList.push(styles.expanded);
		}

		const fasClass = this.state.expanded ? 'fa-chevron-right' : 'fa-chevron-left';

		return (
			<div className={classList.join(' ')} ref={ref => this.container = ref}>
				<div className={styles.tab} onClick={this.handleTabClick}>
					<i className={'fas ' + fasClass + ' fa-lg'}></i>
				</div>
				<div className={styles.content} ref={ref => this.contentDiv = ref}>
					{this.props.children}
				</div>
			</div>
		)
	}
}


function isDescendant(parent, node) {
	switch (node) {
		case parent:
			return true;
		case null:
			return false;
		default:
			return isDescendant(parent, node.parentNode);
	}
}


export default Sidebar;