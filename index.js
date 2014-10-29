module.exports = function( req , options ){
	 var device;

	 options = options || {"M":"M", "T":"T", "D":"D"};
	 if (!req.session || !req.session["devicize"]) {
		var MobileDetect = require('mobile-detect');
		var md = new MobileDetect(req.headers['user-agent']);
		device = md.phone() ? "P" : (md.tablet() ? "T":"D")

		if (req.session) req.session["devicize"] = device;
	 }
	 else device = req.session["devicize"]; 
	 return options[device] || "";
	}