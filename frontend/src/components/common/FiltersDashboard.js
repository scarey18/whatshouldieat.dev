import React from 'react';
import styles from 'styles/FiltersDashboard.module.scss';
import PriceSelection from './PriceSelection';


class FiltersDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			display: 'current filters',
			selectedCategories: [],
			selectedFilters: [],
			selectedPrice: props.price,
		}
	}

	getCurrentFilterList = () => {
		const filters = this.props.filters.length === 0 ? 
			<p>You haven't made any exclusions yet.</p> :
			<ul>
				{this.props.filters.map(f => (
					<li>{f.title}</li>
				))}
			</ul>;

		const categories = this.props.categories.length === 0 ?
			<p>You haven't made any inclusions yet.</p> :
			<ul>
				{this.props.categories.map(c => (
					<li>{c.title}</li>
				))}
			</ul>;

		return (
			<React.Fragment>
				<h2>Maximum price:</h2>
				<PriceSelection 
					price={this.props.price} 
					onPriceChange={this.props.changePrice}
				/>
				<h2>Don't show me:</h2>
				{filters}
				<h2>Only show me:</h2>
				{categories}				
			</React.Fragment>
		);
	};

	render() {
		const currentFiltersClassList = [styles.tab];
		const addInclusionClassList = [styles.tab];
		const addExclusionClassList = [styles.tab];

		const activeTabMap = {
			'current filters': currentFiltersClassList,
			'add inclusion': addInclusionClassList,
			'add exclusion': addExclusionClassList
		}
		activeTabMap[this.state.display].push(styles.activeTab);

		return (
			<div className={styles.dashboardContainer}>

			{/* Tabs at top that select what content is shown */}
				<div className={styles.tabs}>
					<div 
						className={currentFiltersClassList.join(' ')}
						onClick={() => this.setState({display: 'current filters'})}
					>
						Current Filters
					</div>
					<div className={styles.addTabs}>
						<div 
							className={addInclusionClassList.join(' ')}
							onClick={() => this.setState({display: 'add inclusion'})}
						>
							Add Inclusions
						</div>
						<div 
							className={addExclusionClassList.join(' ')}
							onClick={() => this.setState({display: 'add exclusion'})}
						>
							Add Exclusions
						</div>
					</div>
				</div>

				<div className={styles.content}>
					{this.state.display === 'current filters' &&
						this.getCurrentFilterList()}
				</div>

				<div className={styles.footer}>

				</div>
			</div>
		);
	}
}


export default FiltersDashboard;