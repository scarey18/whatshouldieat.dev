/* Used for Yelp category objects, which contain name and alias properties */


import { biSort } from './miscFunctions';


export class CategoryList extends Array {
	contains(item) {
		for (const c of this) {
			if (c.alias === item.alias) return true;
		}
	}

	hasCommon(items) {
		for (const item of items) {
			if (this.contains(item)) return true;
		}
	}

	isEqualTo(items) {
		if (this.length !== items.length) return false;
		for (const item of items) {
			if (!this.contains(item)) return false;
		}
		return true;
	}

	add(items) {
		if (!Array.isArray(items)) {
			items = [items];
		}
		return this.concat(items.filter(item => !this.contains(item)));
	}

	remove(item) {
		for (let i = 0; i < this.length; i++) {
			if (this[i].alias === item.alias) {
				return this.slice(0, i).concat(this.slice(i + 1));
			}
		}
	}

	toggle(item) {
		return this.remove(item) || this.concat([item]);
	}

	get sortedAliases() {
		return this.map(c => c.alias).sort();
	}
}


export class Categories extends CategoryList {
	hasCommon(items) {
		return this.length === 0 || super.hasCommon(items);
	}
	
	discard(restaurants) {
		return biSort(r => this.hasCommon(r.categories), restaurants);
	}
}


export class Filters extends CategoryList {
	discard(restaurants) {
		return biSort(r => !this.hasCommon(r.categories), restaurants);
	}
}


export class SeenCategories extends CategoryList {
	addUnseen(restaurants) {
		const reducerCallback = (categoryList, restaurant) => categoryList.concat(
			restaurant.categories.filter(c => !categoryList.contains(c))
		);
		return restaurants.reduce(reducerCallback, this);
	}
}