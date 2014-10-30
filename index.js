function getPromise( device ){
	var found = false;
	return {
			"phone"     : function(e){ if (device == "P") {found=true; e();} return this;},
			"tablet"    : function(e){ if (device == "T") {found=true; e();} return this;},
			"desktop"   : function(e){ if (device == "D") {found=true; e();} return this;},
			"otherwise" : function(e){ if (!found) e(); }
		};
}

module.exports = function( req , options ){
	var device;

	options = options || {"P":"P", "T":"T", "D":"D"};
	if (!req.session || !req.session["devicize"]) {
		var MobileDetect = require('mobile-detect');
		var md = new MobileDetect( req.headers['user-agent']);
		device = md.phone() ? "P" : (md.tablet() ? "T":"D")

		if (req.session) req.session["devicize"] = device;
	}
	else device = req.session["devicize"];
	if (options.promise) return getPromise(device);
	else return options[device] || "";
}