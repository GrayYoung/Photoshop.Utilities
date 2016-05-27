/**
 * Marching Util
 * Version: 0.0.3
 * Author: Gray Young
 * 
 * Copyright 2016 Released under the MIT license.
 */

var Marching = {
	isEmptyObject: function(obj) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},
};

(function(globalContext, noGlobal){
	var _Marching = globalContext.Marching,  _M = globalContext.M;

	Marching.noConflict = function(deep) {
		if (app.M === Marching) {
			app.M = _M;
		}

		if (deep && globalContext.Marching === Marching) {
			globalContext.Marching = _Marching;
		}

		return Marching;
	};

	if (!noGlobal) {
		globalContext.Marching = globalContext.M = Marching;
	}
})(app, false);
