var varSession = require("varsession");

function getPromise( device ){
	var found = false;
	return {
			"phone"     : function(e){ if (device == "P") {found=true; e();} return this;},
			"tablet"    : function(e){ if (device == "T") {found=true; e();} return this;},
			"desktop"   : function(e){ if (device == "D") {found=true; e();} return this;},
			"otherwise" : function(e){ if (!found) e(); }
		};
}

function devicize( req , options ){
	 var device,
	 	 varsession = varSession(req), 
	 	 stored = varsession.get("devicize");

	 options = options || {"P":"P", "T":"T", "D":"D"};
	 if (stored) {
	 	device = stored;
	 }
	 else {
		var MobileDetect = require('mobile-detect');
		var md = new MobileDetect(req.headers['user-agent']);
		device = md.phone() ? "P" : (md.tablet() ? "T":"D")
		varsession.set("devicize",device);
	 }
	 if (options.promise) return getPromise(device);
	 else return options[device] || "";
	}

devicize.static = function(path, options){
	var extensions = [], handlers = {};

	if (typeof path == "object") {
		console.log("Devicize: syntax deprecated. See new documentation.");
		return new Function(); 
	}
	for(var e in options) {
		if (e.match(/\.\w+$/)) {extensions.push(e); handlers[e] = options[e];}
	}

	function sendFile( req, res, filename ){
		var onError = new Function();
		res.sendFile(filename, {}, function(err){if (err) onError(err);});
		return {error:function(e){onError=e;}};
	}

	function middleware(req, res, next){
   	  	 var filename = require("path").join( path, devicize(req ,{"P": "/phone/", "T": "/tablet/", "D": "/desktop/"}), req.url );
   	  	 var ext = filename.match(/\.\w+$/);
   	  	 if (ext && (extensions.indexOf(ext[0])>=0)) {
   	  	 	handlers[ ext[0] ](req, res, filename);
   	  	 }
   	  	 else {
   	  	 	sendFile(req , res , filename ).error( function(){res.status(404).end();});
   	  	 }
   }

   return middleware;
}

module.exports = devicize;