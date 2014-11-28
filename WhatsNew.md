#devicize - What's new#

## v 0.2.0  ##
Old syntax deprecated. Now, middleware should be mounted on an url:

```
app.use( url , devicize.static( path , {options} ));
```
or
```
app.use( devicize.static(path, {options} ));
```

## v 0.1.0  ##
We added dest option and added "varsession" dependency to handle session variables with this package. We now ensure full Express 4 compliance.

## v 0.0.5 Express 4 compatibility fix ##
**devicize** is now compatible with ExpressJs v4 and produce no warnings about depricated syntax.

##v 0.0.4 Middleware added##
**devicize** can be used now as a middleware to serve files from different diretory depending on device.

## v 0.0.3 Promise-like syntax
**devicize** can be used in a more convinient way, with a promise-like syntax.
