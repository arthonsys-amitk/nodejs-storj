const express = require('express');
const app = express(); 
var bodyParser  =   require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

const libstorj = require('storj');
const formidable = require('formidable');
const fs = require('fs');

app.get('/', function(req, res){

res.send('Hello World!')
});

app.get('/getBucketList', function(req, res){
		const storj = new libstorj.Environment({
		  bridgeUrl: 'https://api.storj.io',
		  bridgeUser: 'amit.kothari@arthonsys.com',
		  bridgePass: 'Amit@Storj',
		  encryptionKey: 'hotel truly worry color nice valve bracket pave size panel clog horse solve fish silly room charge sweet news before client liberty inhale danger',
		  logLevel: 0
		});

		storj.getInfo(function(err, result) {
		  if (err) {
			return console.error(err);
		  }
		  //console.log('info:', result);

		  storj.getBuckets(function(err, result) {
			if (err) {
			  return console.error(err);
			}
			//console.log('buckets:', result);
			res.json(result);
			for(i=0; i< result.length; i++){
				//console.log(result[i].name + "==>" + result[i].id);
			}
			storj.destroy();
		  });  
		});
		
});

app.post('/uploadimage', function(req, res){

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = './' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
			var result = {};
			result['error'] = err;
			res.json(result);
		} else {
			var result = {};
			result['responsemsg'] = "File uploaded successfully";
			result['error'] = "";
			res.json(result);
		}
        res.end();
      });
	});
});

app.post('/postimage', function(req, res){

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var bucketId = fields.bucketid;
	  //res.send("bucketid=" + bucketId);
	  var oldpath = files.filetoupload.path;
      var newpath = './' + files.filetoupload.name;
	  var file_name = files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
			var result = {};
			result['error'] = err;
			res.json(result);
		} else {
			const storj = new libstorj.Environment({
			  bridgeUrl: 'https://api.storj.io',
			  bridgeUser: 'amit.kothari@arthonsys.com',
			  bridgePass: 'Amit@Storj',
			  encryptionKey: 'hotel truly worry color nice valve bracket pave size panel clog horse solve fish silly room charge sweet news before client liberty inhale danger',
			  logLevel: 0
			});
			
			/*
			var result = {};
			result['responsemsg'] = "File uploaded successfully";
			result['error'] = "";
			res.json(result);
			*/
			//res.send("File uploaded successfully");
			
			storj.storeFile(bucketId, newpath, {
				filename: file_name,
				progressCallback: function(progress, uploadedBytes, totalBytes) {
					console.log('Progress: %d, uploadedBytes: %d, totalBytes: %d',
								progress, uploadedBytes, totalBytes);
				  },
				finishedCallback: function(err, fileId) {
					if (err) {
					  //return console.error(err);
					  var result = {};
					  result['error'] = err;
					  //res.json(result);
					  res.send("error: " + err);
					} else {
					  var result = {};
					  result['responsemsg'] = "File uploaded with fileid:" + fileId;
					  //res.json(result);
					  res.send("response: " + "File uploaded with fileid:" + fileId);
					}
				}				
			});			
		}
       // res.end();	   
      });
	  
	});
});
app.post('/', function(req, res){

res.json(req.body);
});

function storjStoreFile(bucketId, uploadFilePath, res) {
	
}


app.listen(3000, () => console.log('Example app listening on port 3000!'))