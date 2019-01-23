import React from 'react';
import styles from 'styles/App.module.scss';
import Header from './Header';
import HomeContent from './HomeContent';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: 'home',
		}
	}

	setContent() {
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
				<Header expanded={this.state.view === 'home'}/>
				{this.setContent()}
			</div>
		);
	}
}

export default App;