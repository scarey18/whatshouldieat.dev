import React from 'react';
import styles from 'styles/FiltersDashboard.module.scss';


class FiltersDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			display: 'current filters',
			selectedCategories: [],
			selectedFilters: [],
		}
	}

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

				</div>

				<div className={styles.footer}>

				</div>
			</div>
		);
	}
}


export default FiltersDashboard;