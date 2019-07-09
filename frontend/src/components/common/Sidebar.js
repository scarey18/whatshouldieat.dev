import React from 'react';
import styles from 'styles/Sidebar.module.scss';
import { isDescendant } from 'commonUtils/miscFunctions';


class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.mql = window.matchMedia('(min-width: 1840px)');
		this.state = {expanded: this.mql.matches}
	}

	componentDidMount() {
		window.addEventListener('click', this.handleWindowClick);
		this.container.addEventListener('transitionend', this.handleTransitionEnd);
		if (!this.state.expanded) {
			this.contentDiv.style.display = 'none';
		}
	}

	componentWillUnmount() {
		this.container.removeEventListener('transitionend', this.handleTransitionEnd);
		window.removeEventListener('click', this.handleWindowClick);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.state.expanded && prevState.expanded) {
			this.contentDiv.style.display = 'none';
		}
	}

	handleWindowClick = e => {
		if (this.mql.matches || !this.state.expanded) {
			return;
		} else if (!isDescendant(this.container, e.target)) {
			this.setState({expanded: false});
		}
	};

	handleTabClick = () => {
		this.setState({expanded: !this.state.expanded});
	};

	handleTransitionEnd = e => {
		if (e.target === this.container && this.state.expanded) {
			this.contentDiv.style.display = null;
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


export default Sidebar;