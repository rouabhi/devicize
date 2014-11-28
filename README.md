# devicize #

**devicize** is a *node.js* package that analyses the user agent of the browser and gives information about device type (desktop, tablet or phone).

## Using sessions ##
If you are using express-session middleware, the information about device is stored as a session variable to avoid re-analyzing the user agent and lose precious machine cycles, which make it suitable for big multi-device applications.

```javascript
var expressSession = require('express-session');

app.use( expressSession({secret:'mySecretKey', cookie: { maxAge: 60000 }, resave:false, saveUninitialized:true}) );
```
The **devicize** package can be used in many ways, listed below.

## Simple syntax ##
The simplest way to use it is to get a different string depending on the device type. For example:

```javascript
app.get( '/size', showDeviceSize );

function showDeviceSize(req,res){
  console.log("Devicize : " , require("devicize")(req , { "M":"mobile/" , "T":"tablet/" , "P":"phone/" }));
}
```

When no strings specified, default information given is 1 letter:
  - D : Desktop 
  - T : Tablet
  - P : Phone

## Promise syntax ##

Another possibility is a promise-like syntax :

```javascript
require("devicize")(req , { "promise" : true } ).phone( itsPhone ).tablet( itsTablet ).desktop( itsDesktop );
require("devicize")(req , { "promise" : true } ).desktop( itsDesktop ).otherwise( itsNotDesktop );
```

## Middleware ##
The most interesting use of the package is as a **middleware** to serve different files depending on the device type:

```javascript
function renderJade(req, res, filename){
    filename = filename.slice(0,-4)+".jade";
    require("jade").renderFile(filename , function(err,html){if (err) {res.send(500);} else {res.send(200,html);}});
}

function page404(req, res, filename){
    res.send(404);
}

app.use( "/pub", devicize.static( __dirname+"/public/",{
     ".htm":renderJade,
     ".jade":page404
    }) );
```

The code above permits to serve static files fom different directories when *url* starting with `/pub/...` : files are served from `/public/desktop/`, `/public/tablet/` and `/public/phone/`.

In addition, the *url* with `.htm` extension is served from a `.jade` compiled file and `.jade` files are excluded from visualisation.
