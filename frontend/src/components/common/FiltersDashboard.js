import React from 'react';
import styles from 'styles/FiltersDashboard.module.scss';
import PriceSelection from './PriceSelection';
import ActiveItemList from './ActiveItemList';
import AddItemsList from './AddItemsList';
import { categoryIsIncluded, toggleItem } from 'commonUtils/categoryFunctions';


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
		return (
			<React.Fragment>
				<h2>Maximum price:</h2>
				<PriceSelection 
					price={this.props.price} 
					onPriceChange={this.props.changePrice}
				/>
				<h2>Don't show me:</h2>
				<ActiveItemList
					list={this.props.filters}
					emptyListText="You haven't made any exclusions yet."
					handleDeleteItem={this.props.removeFilter}
				/>
				<h2>Only show me:</h2>
				<ActiveItemList
					list={this.props.categories}
					emptyListText="You haven't made any inclusions yet."
					handleDeleteItem={this.props.removeCategory}
				/>			
			</React.Fragment>
		);
	};

	getAddItemsList = (list, selectedList) => {
		const items = this.props.seenCategories.filter(c => {
			return !categoryIsIncluded(list, c)
		});

		let toggleSelection;
		let applyChanges;
		switch (selectedList) {
			case this.state.selectedCategories:
				toggleSelection = this.toggleCategory;
				applyChanges = this.addCategories;
				break;
			case this.state.selectedFilters:
				toggleSelection = this.toggleFilter;
				applyChanges = this.addFilters;
				break;
			default:
				break;
		}

		return (
			<AddItemsList 
				items={items} 
				selectedItems={selectedList}
				toggleSelection={toggleSelection}
				applyChanges={applyChanges}
			/>
		);
	};

	addCategories = () => {
		this.props.addCategory(this.state.selectedCategories);
		this.setState({selectedCategories: [], display: 'current filters'});
	};

	addFilters = () => {
		this.props.addFilter(this.state.selectedFilters);
		this.setState({selectedFilters: [], display: 'current filters'});
	};

	toggleCategory = category => {
		const selectedCategories = toggleItem(this.state.selectedCategories, category);
		this.setState({selectedCategories});
	};

	toggleFilter = filter => {
		const selectedFilters = toggleItem(this.state.selectedFilters, filter);
		this.setState({selectedFilters});
	};

	render() {
		const currentFiltersClassList = [styles.tab];
		const addInclusionClassList = [styles.tab];
		const addExclusionClassList = [styles.tab];

		let activeTabClassList;
		let displayContent;

		switch (this.state.display) {
			case 'current filters':
				activeTabClassList = currentFiltersClassList;
				displayContent = this.getCurrentFilterList();
				break;

			case 'add inclusion':
				activeTabClassList = addInclusionClassList;
				displayContent = this.getAddItemsList(
					this.props.categories, this.state.selectedCategories
				);
				break;

			case 'add exclusion':
				activeTabClassList = addExclusionClassList;
				displayContent = this.getAddItemsList(
					this.props.filters, this.state.selectedFilters
				);
				break;

			default:
				break;
		}

		activeTabClassList.push(styles.activeTab);

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

				<div className={styles.content}>{displayContent}</div>
			</div>
		);
	}
}


export default FiltersDashboard;