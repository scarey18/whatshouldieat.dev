import React from 'react';
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
		window.addEventListener('popstate', this.handlePopstate);
		const userLocation = localStorage.getItem('userLocation');
		if (userLocation !== null) {
			window.history.replaceState({userLocation: userLocation}, '', '/suggest');
			this.setState({userLocation});
		} else {
			window.history.replaceState({userLocation: null}, '', '/');
		}
	}

	componentWillUnmount() {
		this.mql.removeListener(this.handleResize);
		window.removeEventListener('popstate', this.handlePopstate);
	}

// On page change store and retrieve userLocation in localStorage
	handlePopstate = event => {
		const value = event.state === null ? null : event.state.userLocation;
		this.setState({userLocation: value});
		if (value === null) {
			localStorage.removeItem('userLocation');
		} else {
			localStorage.setItem('userLocation', value);
		}
	};

	handleResize = mql => {
		if (mql.matches && !this.state.isMobile) {
			this.setState({isMobile: true});
		} else if (!mql.matches && this.state.isMobile) {
			this.setState({isMobile: false});
		}
	};

	goHome = () => {
		if (this.state.userLocation === null) {
			return;
		}
		window.history.pushState({userLocation: null}, '', '/');
		localStorage.removeItem('userLocation');
		this.setState({userLocation: null});
	};

	setLocation = value => {
		window.history.pushState({userLocation: value}, '', '/suggest');
		this.setState({userLocation: value});
		localStorage.setItem('userLocation', value);
	};

	render() {
		return (
			<div>
				<Header 
					isMobile={this.state.isMobile} 
					location={this.state.userLocation}
					setLocation={value => this.setLocation(value)}
					goHome={this.goHome}
				/>
				<Main 
					location={this.state.userLocation}
					isMobile={this.state.isMobile}
				/>
			</div>
		);
	}
}

export default App;