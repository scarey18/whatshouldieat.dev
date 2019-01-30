import React from 'react';
import styles from 'styles/App.module.scss';
import Header from './Header';
import HomeContent from './HomeContent';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.mql = window.matchMedia('(max-width: 650px)');
		this.state = {
			view: 'home',
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


	renderContent = () => {
		switch (this.state.view) {
			case 'home': {
				return <HomeContent />
			}
			default: {
				break;
			}
		}
	}

	render() {
		return (
			<div className={styles.app}>
				<Header 
					shouldExpand={this.state.view === 'home'}
					isMobile={this.state.isMobile}
				/>
				{this.renderContent()}
			</div>
		);
	}
}

export default App;