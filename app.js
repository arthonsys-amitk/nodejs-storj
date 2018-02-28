const express = require('express');
const app = express(); 
var bodyParser  =   require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

app.get('/', function(req, res){

res.send('Hello World!')
});

app.post('/', function(req, res){

res.json(req.body);
});

 app.listen(3000, () => console.log('Example app listening on port 3000!'))