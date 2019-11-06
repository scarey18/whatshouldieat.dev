import React from 'react';
import styles from 'styles/FiltersDashboard.module.scss';
import PriceSelection from './PriceSelection';
import ActiveItemList from './ActiveItemList';
import AddItemsList from './AddItemsList';
import { CategoryList } from 'commonUtils/CategoryClasses';


class FiltersDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			display: 'current filters',
			selectedCategories: new CategoryList(),
			selectedFilters: new CategoryList(),
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
		const items = this.props.seenCategories.filter(c => !list.contains(c));

		let toggleSelection;
		let applyChanges;
		let headerText;
		switch (selectedList) {
			case this.state.selectedCategories:
				toggleSelection = this.toggleCategory;
				applyChanges = this.addCategories;
				headerText = 'Only show me:'
				break;
			case this.state.selectedFilters:
				toggleSelection = this.toggleFilter;
				applyChanges = this.addFilters;
				headerText = "Don't show me:"
				break;
			default:
				break;
		}

		return (
			<React.Fragment>
				<div className={styles.addItemsHeader}>
					<h2>{headerText}</h2>
					<button 
						onClick={applyChanges} 
						disabled={selectedList.length === 0}
					>
						Apply Changes
					</button>
				</div>
				<AddItemsList 
					items={items} 
					selectedItems={selectedList}
					toggleSelection={toggleSelection}
				/>
			</React.Fragment>
		);
	};

	addCategories = () => {
		this.props.addCategory(this.state.selectedCategories);
		this.setState({
			selectedCategories: new CategoryList(), display: 'current filters'
		});
	};

	addFilters = () => {
		this.props.addFilter(this.state.selectedFilters);
		this.setState({
			selectedFilters: new CategoryList(), display: 'current filters'
		});
	};

	toggleCategory = category => {
		const selectedCategories = this.state.selectedCategories.toggle(category);
		this.setState({selectedCategories});
	};

	toggleFilter = filter => {
		const selectedFilters = this.state.selectedFilters.toggle(filter);
		this.setState({selectedFilters});
	};

	render() {
		const currentFiltersClassList = [styles.tab];
		const addInclusionClassList = [styles.tab];
		const addExclusionClassList = [styles.tab];
		let displayContent;

		switch (this.state.display) {
			case 'current filters':
				currentFiltersClassList.push(styles.activeTab);
				displayContent = this.getCurrentFilterList();
				break;

			case 'add inclusion':
				addInclusionClassList.push(styles.activeTab);
				displayContent = this.getAddItemsList(
					this.props.categories, this.state.selectedCategories
				);
				break;

			case 'add exclusion':
				addExclusionClassList.push(styles.activeTab);
				displayContent = this.getAddItemsList(
					this.props.filters, this.state.selectedFilters
				);
				break;

			default:
				break;
		}

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

			{/* Content determined by selected tab */}
				<div className={styles.content}>{displayContent}</div>
			</div>
		);
	}
}


export default FiltersDashboard;