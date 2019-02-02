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
			userLocation: null,
		}
	}

	componentDidMount() {
		this.mql.addListener(this.handleResize);
		window.addEventListener('popstate', this.handlePopstate)
	}

	componentWillUnmount() {
		this.mql.removeListener(this.handleResize);
	}

	handlePopstate = event => {
		if (event.state === null) {
			this.setState({userLocation: null});
		} else {
			this.setState({userLocation: event.state.userLocation});
		}
	}

	handleResize = mql => {
		if (mql.matches && !this.state.isMobile) {
			this.setState({isMobile: true});
		} else if (!mql.matches && this.state.isMobile) {
			this.setState({isMobile: false});
		}
	};

	setLocation = value => {
		window.history.pushState({userLocation: value}, '', '/suggest');
		this.setState({userLocation: value});
	}

	render() {
		return (
			<div className={styles.app}>
				<Header 
					isMobile={this.state.isMobile} 
					location={this.state.userLocation}
					setLocation={value => this.setLocation(value)}
				/>
				<Main location={this.state.userLocation} />
			</div>
		);
	}
}

export default App;