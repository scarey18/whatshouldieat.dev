class CategoryList extends Array {
	contains(item) {
		for (const c of this) {
			if (c.alias === item.alias) {
				return true;
			}
		}
		return false;
	}

	hasCommon(items) {
		for (const item of items) {
			if (this.contains(item)) {
				return true;
			}
		}
		return false;
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
		const removed = this.remove(item);
		return removed ? removed : this.concat([item]);
	}
}


class Categories extends CategoryList {
	discard(restaurants) {
		const discarded = [];
		const kept = [];
		restaurants.forEach(r => {
			if (this.hasCommon(r.categories)) {
				kept.push(r);
			} else {
				discarded.push(r);
			}
		});
		return [kept, discarded];
	}
}


class Filters extends CategoryList {
	discard(restaurants) {
		const discarded = [];
		const kept = [];
		restaurants.forEach(r => {
			if (this.hasCommon(r.categories)) {
				discarded.push(r);
			} else {
				kept.push(r);
			}
		});
		return [kept, discarded];
	}
}


class SeenCategories extends CategoryList {
	addUnseen(restaurants) {
		const newCategories = [];
		restaurants.forEach(r => {
			r.categories.forEach(c => {
				if (!this.contains(c)) {
					newCategories.push(c);
				}
			});
		});
		return this.concat(newCategories);
	}
}


export { CategoryList, Categories, Filters, SeenCategories }