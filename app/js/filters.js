'use strict';

function hashRipper(hash) {
	var arr = []
	if (typeof hash !== 'object') {
		arr.push(hash.toString());
		return arr;
	}
	Object.keys(hash).forEach(function(key) {
		var val = hash[key];
		arr = arr.concat(hashRipper(val));
	});
	return arr;
}

/* Filters */
angular.module('phonecatFilters', []).filter('ripper', function() {
  return function(items, filter) {
      if (!filter) {
          return items;
      }  
      var result = {};
      angular.forEach(items, function(item, itemKey) {
      	var arr = hashRipper(item);
      	for(var i = 0; i < arr.length; ++i) {
      		var fieldVal = arr[i];
          	if (fieldVal && fieldVal.toLowerCase().indexOf(filter.toLowerCase()) > -1){
				result[itemKey] = item;
			}
		}
      });
      console.log('done');
      return result;
    };
});
