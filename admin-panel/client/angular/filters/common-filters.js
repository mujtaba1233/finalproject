vulusionApp.filter('highlight', function () {
	return function (text, phrase) {
		return phrase ?
			text.replace(new RegExp('(' + phrase + ')', 'gi'), '<kbd>$1</kbd>') :
			text;
	};
});
vulusionApp.filter('orderStatusFilter', function ($filter) {
	return function (input, predicate) {
		return $filter('filter')(input, predicate, true);
	}
});
vulusionApp.filter('unique', function () {
	return function (arr, field) {
		if (arr) {
			var o = {},
				i, l = arr.length,
				r = [];
			for (i = 0; i < l; i += 1) {
				o[arr[i][field]] = arr[i];
			}
			for (i in o) {
				r.push(o[i]);
			}
			return r;
		}
	};
})

vulusionApp.filter('customFilter', function ($filter) {
	return function customFilter(array, query) {
		console.log(query, array);
		console.log(query, array.length);
		console.log(query.from);
		if (array.length && (query.from || query.to || query.OrderStatus === 'open')) {
			if (query.from) {
				var lowerLimit = new Date(query.from);
				array = $filter('filter')(array, function (order) {
					return new Date(order.OrderDate) >= lowerLimit;
				});
			}
			if (query.to) {
				var higherLimit = new Date(query.to);
				array = $filter('filter')(array, function (order) {
					return new Date(order.OrderDate) <= higherLimit;
				});
			}
			if (query.OrderStatus) {
				var statuses = ['shipped', 'cancelled']
				array = $filter('filter')(array, function (order) {
					var check = true;
					for (let i = 0; i < statuses.length; i++) {
						if (check)
							check = order.OrderStatus.toLowerCase() !== statuses[i];
					}
					return check
				});
			}
		}else {
			console.log(array);
			// array = $filter('filter')(array, query, false);
			array = $filter('orderBy')(array, "array.length", true);
		}
		console.log(array);
		return array;
	}
});
vulusionApp.filter('customActivityLogFilter', function ($filter) {
	return function customFilter(array, query) {
		console.log(query, array);
		// console.log(query, array.length);
		// console.log(moment(query.from).format("MM/DD/YY"));
		if (array.length && (query.from || query.to || query.type)) {
			if (query.from) {
				var lowerLimit = moment(query.from).format("MM/DD/YY");
				array = $filter('filter')(array, function (record) {
					return moment(record.lastModifyOn).format("MM/DD/YY") >= lowerLimit;
				});
			}
			if (query.to) {
				var higherLimit = moment(query.to).format("MM/DD/YY");
				array = $filter('filter')(array, function (record) {
					return moment(record.lastModifyOn).format("MM/DD/YY") <= higherLimit;
				});
			}
			if (query.type) {
				// console.log(query.type);
				var type = query.type
				array = $filter('filter')(array, function (record) {
					if(type == 'all'){
						return record
					}
					return record.type == type;
				});
			}
		}else {
			console.log(array);
			// array = $filter('filter')(array, query, false);
			array = $filter('orderBy')(array, "array.length", true);
		}
		console.log(array);
		return array;
	}
});