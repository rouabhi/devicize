function deviceType(req){
 var type = req.session["devicize"];

 if (type.phone) return "P";
 if (type.tablet) return "T";
 return "D"; 
}

module.exports = function( req ){
	 if (!req.session || !req.session["devicize"]) {
		var MobileDetect = require('mobile-detect');
		var md = new MobileDetect(req.headers['user-agent']);
		var device = md.phone() ? "P" : (md.tablet() ? "T":"D")

		if (req.session) req.session["devicize"] = device;
	 }
	 else device = req.session["devicize"]; 
	 return device;
	}