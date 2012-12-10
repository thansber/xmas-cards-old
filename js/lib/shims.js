(function() {
	if ( !Array.prototype.forEach ) {
		Array.prototype.forEach = function(fn, scope) {
			for(var i = 0, len = this.length; i < len; ++i) {
				fn.call(scope, this[i], i, this);
		    }
		}
	}
	
	if(typeof String.prototype.trim !== 'function') {
	  String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, ''); 
	  }
	}
	
	if (!Date.now) {
	  Date.now = function() {
	    return new Date().valueOf();
	  }
	}
})();