# devicize #

**devicize** is a *node.js* package that analyses the user agent of the browser and gives information about device type (desktop, tablet or phone).

## Using sessions ##
When you are using express.session middleware, the information about device is stored as a session variable to avoid re-analyzing the user agent and lose precious machine cycles, which make it suitable for big multi-device applications.

```javascript
app.use( express.cookieParser() );
app.use( express.session({secret:'mySecretKeyz'}));
```
The module can be used in many ways, listed below.

## Simple syntax ##
The simplest way to use it is to get a different string depending on the defice type. For example:

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
The most interesting use of the module is as a **middleware** to serve different static code depending on the device type:

```javascript
function renderJade(req, res, filename){
    filename = filename.slice(0,-4)+".jade";
    require("jade").renderFile(filename , function(err,html){if (err) {res.send(500);} else {res.send(200,html);}});
}

app.use( devicize.static({
     src:"/public",
     D:"desktop/", T:"tablet/", P:"phone/" ,
     ".htm":renderJade,
     ".jade":new Function()
    }) );
```

The code above permits to serve static files `/public/...` fom different directories.
In addition, the *url* with `.htm` extension is served from a `.Jade` compiled file and `.jade` files are excluded from visualisation.