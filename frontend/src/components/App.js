import React from 'react';
import styles from 'styles/App.module.scss';
import Header from './Header';
import Main from './Main';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.mql = window.matchMedia('(max-width: 650px)');
		this.state = {
			isMobile: this.mql.matches,
		}
	}

	componentDidMount() {
		this.mql.addListener(this.handleResize);
	}

	componentWillUnmount() {
		this.mql.removeListener(this.handleResize);
	}

	handleResize = mql => {
		if (mql.matches && !this.state.isMobile) {
			this.setState({isMobile: true});
		} else if (!mql.matches && this.state.isMobile) {
			this.setState({isMobile: false});
		}
	};

	render() {
		return (
			<div className={styles.app}>
				<Header isMobile={this.state.isMobile} />
				<Main />
			</div>
		);
	}
}

export default App;