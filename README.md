devicize
========

*devicize* is a very simple node.js package that analyses the user agent of the browser and gives a one letter describing the device type :

 D : Desktop
 
 T : Tablet
 
 P : Phone
 
It uses another package named "mobile-detect". The main reason I wrote it is that when device size is needed intensively like in big muti-device applications, you can store this value in a session variable and read it each time instead of analyzing constantly the user agent and losing precious machine cycles.


You should then use the session middleware with Express :


app.use( express.session({secret:'mySecretKeyz'}));

app.get( '/size', showDeviceSize );

function showDeviceSize(req,res){

  console.log("Devicize : " , require("devicize")(req));

}
