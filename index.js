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

devicize.static = function(options){
	var extensions = [], handlers = {};
	var src = options.src;
	src = (src.slice(0,1)=="/" ? "":"/" ) + src ;
	src = src + (src.slice(-1)=="/" ? "":"/" );
	for(var e in options) {
		if (e.match(/\.\w+$/)) {extensions.push(e); handlers[e] = options[e];}
	}

	function sendFile( req, res, filename ){
		var onError = new Function();
		console.log("sendFile:",filename);
		res.sendFile(filename, {root:require("path").join(__dirname,"../../")},function(err){if (err) onError(err);});
		return {error:function(e){onError=e;}};
	}

	function middleware(req, res, next){
   	  if (req.url.indexOf(src) !== 0) next();
   	  else {
   	  	 path = {};
   	  	 var filename = devicize(req , { 
   	  	 	 "P": (options.P || ((options.dst|| "")+"phone/")), 
   	  	 	 "T": (options.T || ((options.dst|| "")+"tablet/")),
   	  	 	 "D": (options.D || ((options.dst|| "")+"desktop/"))
   	  	 	  }) + req.url.slice( src.length );
   	  	 var ext = filename.match(/\.\w+$/);
   	  	 if (ext && (extensions.indexOf(ext[0])>=0)) {
   	  	 	handlers[ ext[0] ](req, res, filename);
   	  	 }
   	  	 else {
   	  	 	sendFile(req , res , filename ).error( function(){res.status(404).end();});
   	  	 }
   	  	}
   }

   return middleware;
}

module.exports = devicize;