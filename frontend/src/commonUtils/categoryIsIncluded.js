function categoryIsIncluded(list, item) {
	for (const c of list) {
		if (c.alias === item.alias) {
			return true;
		}
	}
	return false;
}


export default categoryIsIncluded;