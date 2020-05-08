
const express = require("express");
const favicon = require("express-favicon");
const bcrypt = require("bcrypt")
const cron = require('node-cron');
const nodemailer = require("nodemailer");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8080;
const app = express();
const AWS = require('aws-sdk');

require('dotenv').config({path: path.resolve(__dirname+'/.env')});

app.use(cors());

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

var salt =10

let transporter = nodemailer.createTransport({
  host: "mail.pappaya.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "devsign@pappaya.com",
    pass: "Pappaya@2020",
  },
});

const s3 = new AWS.S3({
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  });


const uri =
  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";


/////////////////////////////////////Common Functions//////////////////////////////////////////////

app.post("/getip", function (req, res) {
	var ip = req.ip;
	res.send(ip);
});


app.post("/login", function (req, res) {


  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  } );

  client.connect((err) => {
    var query = { UserEmail: req.body.UserEmail };
    const collection = client.db("UsersDB").collection("Users");
    //console.log(collection);

    collection.findOne(query, function (err, result) {
      if (err) throw err;
      if (result) {
		bcrypt.compare(req.body.UserPassword, result.UserPassword, function (bcrypterr, bcryptresult) {
			if (bcryptresult == true) {
				if (
					result.UserActivated === true &&
					result.SignID != ""
				  ) {
					var userdata = {
					  UserID: result.UserID,
					  UserEmail:result.UserEmail,
					  Status: "login successful",
					};
					res.send(userdata);
				  } else if (
					result.UserActivated === true &&
					result.SignID === ""
				  ) {
					var userdata = {
					  UserID: result.UserID,
					  UserEmail: result.UserEmail,
					  Status: "sign id required",
					};
					res.send(userdata);
				  } else if (
					result.UserActivated === false
				  ) {
					var userdata = {
					  UserID: result.UserID,
					  UserEmail: result.UserEmail,
					  Status: "activate account",
					};
					res.send(userdata);
				  } 
			} else {
			var userdata = {
				Status: "wrong password",
			  };
			  res.send(userdata);
			// redirect to login page
			}
			})
        
      } else {
        var userdata = {
          Status: "user not found",
        };
        res.send(userdata);
      }
      client.close();
    });
    // perform actions on the collection object
  });
});

app.post("/register", function (req, res) {
	//console.log(req.body);
	bcrypt.hash(req.body.UserPassword, salt, (bcrypterr, encrypted) => {
		req.body.UserPassword = encrypted
		
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

  client.connect((err) => {
    const collection = client.db("UsersDB").collection("Users");
    var registerUser = {
      UserID: req.body.UserID,
      UserEmail: req.body.UserEmail,
      UserPassword: req.body.UserPassword,
      UserNumber: req.body.UserNumber,
      UserFirstName: req.body.UserFirstName,
      UserLastName: req.body.UserLastName,
      UserTitle: req.body.UserTitle,
      UserCompany: req.body.UserCompany,
      UserIndustry: req.body.UserIndustry,
      UserCountry: req.body.UserCountry,
      UserReason: req.body.UserReason,
      UserThirdPartyIntegration: req.body.UserThirdPartyIntegration,
      UserSecurityQuestion: req.body.UserSecurityQuestion,
      UserSecurityAnswer: req.body.UserSecurityAnswer,
      UserActivated: req.body.UserActivated,
	  SignID: req.body.SignID,
	  Request: req.body.Requests
    };
    var query = { UserEmail: req.body.UserEmail };
    //console.log(collection);
    collection.findOne(query, function (err, result) {
      if (err) throw err;
      //console.log(result);
      if (result) {
        res.send("User already exists");
      } else {
        collection.insertOne(registerUser, function (err, result) {
          if (err) res.send(err);
          if (result) {
            res.send("registered");
          }
          //console.log("registered");
          client.close();
          // perform actions on the collection object
        });
      }
    });
  });

})
});


app.post("/resetpassword", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { UserEmail: req.body.UserEmail };
	  var newvalues = { $set: { UserPassword: req.body.UserPassword } };
	  const collection = client.db("UsersDB").collection("Users");
	  //console.log(collection);
	  collection.updateOne(query, newvalues, function (err, result) {
		if (err) res.send(err);;
		if(result){
			res.send("reset");
		}
		
		client.close();
	  });
	  // perform actions on the collection object
	});
  });

app.post("/activate", function (req, res) {
  //console.log(req);
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

  client.connect((err) => {
    var query = { UserID: req.body.UserID };
    var newvalues = { $set: { UserActivated: req.body.UserActivated } };
    const collection = client.db("UsersDB").collection("Users");
    //console.log(collection);
    collection.updateOne(query, newvalues, function (err, result) {
      if (err) throw err;
      res.send("activated");
      client.close();
    });
    // perform actions on the collection object
  });
});

app.post("/signature", function (req, res) {
  //console.log(req);
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

  client.connect((err) => {
    var query = { UserID: req.body.UserID };
    var newvalues = { $set: { 
		SignID: req.body.SignID, 
		SignImage:req.body.SignImage,
		SignImageBox:req.body.SignImageBox,
		Initials:req.body.Initials,
		InitialsBox:req.body.InitialsBox,
	 } };
    const collection = client.db("UsersDB").collection("Users");
    //console.log(collection);
    collection.updateOne(query, newvalues, function (err, result) {
	  if (err) throw err;
	  if(result){
		res.send("signed");
	  }
      else{
		res.send("not signed");
	  }
      client.close();
    });
    // perform actions on the collection object
  });
});

app.post("/profilepic", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { UserID: req.body.UserID };
	  var newvalues = { $set: { ProfileImage: req.body.ProfileImage } };
	  const collection = client.db("UsersDB").collection("Users");
	  //console.log(collection);
	  collection.updateOne(query, newvalues, function (err, result) {
		if (err) throw err;
		if(result){
		  res.send("updated");
		}
		else{
		  res.send("not updated");
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });

/////////////////////////////////////Document/Envelope Functions//////////////////////////////////////////////


app.post("/adddocumentdata", function (req, res) {
	//console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				DocumentName: req.body.DocumentName,
				DocumentID: req.body.DocumentID,
				OwnerEmail: req.body.OwnerEmail,
				DateCreated: req.body.DateCreated,
				DateStatus: req.body.DateStatus,
				Owner: req.body.Owner,
				Status: req.body.Status,
				DateSent: req.body.DateSent,
				Data: req.body.Data,
				SignOrder: req.body.SignOrder,
				Reciever: [],
				History: []

			
		}}
		var datainsert = {
				DocumentName: req.body.DocumentName,
				DocumentID: req.body.DocumentID,
				OwnerEmail: req.body.OwnerEmail,
				DateCreated: req.body.DateCreated,
				DateStatus: req.body.DateStatus,
				Owner: req.body.Owner,
				Status: req.body.Status,
				DateSent: req.body.DateSent,
				Data: req.body.Data,
				SignOrder: req.body.SignOrder,
				Reciever: [],
				History: []
			
		}
	  const collection = client.db("UsersDB").collection("Documents");

	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		//console.log(result);
		if (result) {
		  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
			if (errorupdate) res.send(errorupdate);
			if (resultupdate) {
			  res.send("update done");
			}
			else{
				//console.log('not ther');
			}
			client.close();
			
			// perform actions on the collection object
		  });
		} else {
			collection.insertOne(datainsert, function (errinsrt, resultinsert) {
				if (errinsrt) res.send(errinsrt);
				if (resultinsert) {
				  res.send("insert done");
				}
				client.close();
				// perform actions on the collection object
			  });
		}
	  });
	  
	  
  });
});


app.post("/updatedocumentdata", function (req, res) {
	//console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				DateStatus: req.body.DateStatus,
				DocumentID: req.body.DocumentID,
				Data: req.body.Data
			
		}}
	  const collection = client.db("UsersDB").collection("Documents");

	  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
		if (errorupdate) res.send(errorupdate);
		if (resultupdate) {
		  res.send("update done");
		}
		else{
			//console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/updatedocumentstatus", function (req, res) {
	//console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				Status: req.body.Status
			
		}}
	  const collection = client.db("UsersDB").collection("Documents");

	  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
		if (errorupdate) res.send(errorupdate);
		if (resultupdate) {
		  res.send("update done");
		}
		else{
			//console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/updaterecieverdata", function (req, res) {
	//console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				Reciever: req.body.Reciever			
		}}
	  const collection = client.db("UsersDB").collection("Documents");

	  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
		if (errorupdate) res.send(errorupdate);
		if (resultupdate) {
		  res.send("update reciever done");
		}
		else{
			//console.log('error');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/updaterequestdata", function (req, res) {
	//console.log(req);
	var query = { UserID: req.body.UserID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				Request: req.body.Request			
		}}
	  const collection = client.db("UsersDB").collection("Users");

	  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
		if (errorupdate) res.send(errorupdate);
		if (resultupdate) {
		  res.send("update request done");
		}
		else{
			//console.log('error');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/getdocdata", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { DocumentID: req.body.DocumentID };
	  const collection = client.db("UsersDB").collection("Documents");
	  //console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var docdata = {
				Data: result.Data,
				DocStatus: result.Status,
				Document:result,
				Status: "doc data done"
			  };
			  res.send(docdata);
		} else {
		  var docdata = {
			Status: "doc not found",
		  };
		  res.send(docdata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });



app.post("/addreciever", function (req, res) {
	//console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				Status: req.body.Status,
				SignOrder: req.body.SignOrder,
				DateSent: req.body.DateSent,
				Reciever: req.body.Reciever
			
		}}
	  const collection = client.db("UsersDB").collection("Documents");

	  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
		if (errorupdate) res.send(errorupdate);
		if (resultupdate) {
		  res.send("reciever done");
		}
		else{
			//console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/getReciever", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { DocumentID: req.body.DocumentID };
	  const collection = client.db("UsersDB").collection("Documents");
	  //console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var docdata = {
				Reciever: result.Reciever,
				DocumentName:result.DocumentName,
				OwnerEmail: result.OwnerEmail,
				DocStatus: result.Status,
				Status: "got recievers"
			  };
			  res.send(docdata);
		} else {
		  var docdata = {
			Status: "doc not found",
		  };
		  res.send(docdata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });

  app.post("/getRequests", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { UserID: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Users");
	  //console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var requestdata = {
				Request: result.Request,
				Status: "got request"
			  };
			  res.send(requestdata);
		} else {
		  var requestdata = {
			Status: "request not found",
		  };
		  res.send(requestdata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });


app.post("/getrequestuser", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { UserEmail: req.body.UserEmail };
	  const collection = client.db("UsersDB").collection("Users");
	  //console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var userdata = {
				UserID: result.UserID,
				Status: "user found",
			  };
			  res.send(userdata);
		} else {
		  var userdata = {
			Status: "user not found",
		  };
		  res.send(userdata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });


  app.post("/postrequest", function (req, res) {
	//console.log(req);
	var query = { 
		UserID: req.body.UserID
	 };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				DocumentName: req.body.DocumentName,
                DocumentID: req.body.DocumentID,
                From: req.body.From,
                FromEmail: req.body.FromEmail,
                RecepientStatus: req.body.RecepientStatus,
                RecepientDateStatus: req.body.RecepientDateStatus
			
		}}
		var datainsert = {
				DocumentName: req.body.DocumentName,
				DocumentID: req.body.DocumentID,
				From: req.body.From,
				FromEmail: req.body.FromEmail,
				RecepientStatus: req.body.RecepientStatus,
				RecepientDateStatus: req.body.RecepientDateStatus
			
		}
	  const collection = client.db("UsersDB").collection("Users");

	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		//console.log('result:'+result.UserID);
		
			var userid = req.body.UserID;
			var docid = req.body.DocumentID;

			if(result){
				collection.updateOne({ UserID: userid },{ $push: {"Request": datainsert }},{ upsert: true }, function (errinsrt, resultinsert) {
					if (errinsrt) res.send(errinsrt);
					if (resultinsert) {
					  res.send("request insert done");
					}
					client.close();
					// perform actions on the collection object
				  });
			}
			else{
				res.send('no user');
				client.close();
			}
			
		
	  });
	  
	  
  });
});




  app.post("/getuserdata", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { UserID: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Users");
	  //console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var userdata = {
				user: result,
				Status: "user found",
			  };
			  res.send(userdata);
		} else {
		  var userdata = {
			Status: "user not found",
		  };
		  res.send(userdata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });

  app.post("/getmanagedocdata", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { Owner: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Documents");
	  //console.log(collection);
  
	  collection.find(query).toArray(function (err, result) {
		if (err) throw err;
		if (result) {
				var docdata = {
				doc: result,
				Status: "doc found",
			  };
			  res.send(docdata);
		} else {
		  var docdata = {
			Status: "doc not found",
		  };
		  res.send(docdata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });


  app.post("/getmanagetemplatedata", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { Owner: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Templates");
	  //console.log(collection);
  
	  collection.find(query).toArray(function (err, result) {
		if (err) throw err;
		if (result) {
				var templatedata = {
				template: result,
				Status: "template found",
			  };
			  res.send(templatedata);
		} else {
		  var templatedata = {
			Status: "template not found",
		  };
		  res.send(templatedata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });

/////////////////////////////////////Template Functions//////////////////////////////////////////////

  app.post("/addtemplatedata", function (req, res) {
	//console.log(req);
	var query = { TemplateID: req.body.TemplateID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				TemplateName: req.body.TemplateName,
				TemplateID: req.body.TemplateID,
				OwnerEmail: req.body.OwnerEmail,
				DateCreated: req.body.DateCreated,
				DateStatus: req.body.DateStatus,
				Owner: req.body.Owner,
				Status: req.body.Status,
				DateSent: req.body.DateSent,
				Data: req.body.Data,
				Reciever: []
			
		}}
		var datainsert = {
				TemplateName: req.body.TemplateName,
				TemplateID: req.body.TemplateID,
				OwnerEmail: req.body.OwnerEmail,
				DateCreated: req.body.DateCreated,
				DateStatus: req.body.DateStatus,
				Owner: req.body.Owner,
				Status: req.body.Status,
				DateSent: req.body.DateSent,
				Data: req.body.Data,
				Reciever: []
			
		}
	  const collection = client.db("UsersDB").collection("Templates");

	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		//console.log(result);
		if (result) {
		  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
			if (errorupdate) res.send(errorupdate);
			if (resultupdate) {
			  res.send("update done");
			}
			else{
				//console.log('not ther');
			}
			client.close();
			
			// perform actions on the collection object
		  });
		} else {
			collection.insertOne(datainsert, function (errinsrt, resultinsert) {
				if (errinsrt) res.send(errinsrt);
				if (resultinsert) {
				  res.send("insert done");
				}
				client.close();
				// perform actions on the collection object
			  });
		}
	  });
	  
	  
  });
});


  app.post("/gettemplatedata", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { TemplateID: req.body.TemplateID };
	  const collection = client.db("UsersDB").collection("Templates");
	  //console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var templatedata = {
				Template: result,
				Status: "template found",
			  };
			  res.send(templatedata);
		} else {
		  var templatedata = {
			Status: "template not found",
		  };
		  res.send(templatedata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });


  app.post("/addtemplatereciever", function (req, res) {
	//console.log(req);
	var query = { TemplateID: req.body.TemplateID };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				TemplateID: req.body.TemplateID,
				Status: req.body.Status,
				DateSent: req.body.DateSent,
				Reciever: req.body.Reciever
			
		}}
	  const collection = client.db("UsersDB").collection("Templates");

	  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
		if (errorupdate) res.send(errorupdate);
		if (resultupdate) {
		  res.send("reciever done");
		}
		else{
			//console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});



/////////////////////////////////////Mail/Nodemailer Functions//////////////////////////////////////////////


app.post("/sendmail", function (req, res) {
  //console.log("req.body.to is " + req.body.to);
  //console.log("req.body.subject is " + req.body.subject);
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"Pappayasign" <devsign@pappaya.com>', // sender address
    to: req.body.to, // list of receivers
    subject: req.body.subject, // Subject line
    html: req.body.body, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send("Error sending mail: " + error);
    }
    //console.log("Message sent: " + info.response);
    res.send("Message sent: " + info.response);
  });
});

app.post("/sendmailattachments", function (req, res) {
  //console.log("req.body.to is " + req.body.to);
  //console.log("req.body.subject is " + req.body.subject);
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"Pappayasign" <devsign@pappaya.com>', // sender address
    to: req.body.to, // list of receivers
    subject: req.body.subject, // Subject line
    html: req.body.body, // html body
    attachments: req.body.attachments,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send("Error sending mail: " + error);
    }
    //console.log("Message sent: " + info.response);
  });
  res.send("Message sent");
});


/////////////////////////////////////S3 Storage Functions//////////////////////////////////////////////

app.post("/docupload", function (req, res) {
	//console.log(req);
	var key = ''+req.body.UserID+'/Documents/'+req.body.filename+'.pdf';
	try {
		var buffer = new Buffer.from(req.body.filedata.replace(/^data:application\/\w+;base64,/, ""), 'base64');	
	} catch (error) {
		var buffer = new Buffer.from(req.body.filedata, 'base64');
	}
	
	const params = {
		Bucket: 'pappayasign',
		Key: key,
		Body: buffer,
		ContentEncoding: 'base64',
    	ContentType: 'application/pdf'
	   };
	   s3.upload(params, function(err, data) {
		//console.log(err, data);
		if(data){
			res.send("document upload success");
		}
		else{
			res.send("document upload failed:"+err);
		}
	   });
	
  });

  


  app.post("/templateupload", function (req, res) {
	//console.log(req);
	var key = ''+req.body.UserID+'/Templates/'+req.body.filename+'.pdf';
	try {
		var buffer = new Buffer.from(req.body.filedata.replace(/^data:application\/\w+;base64,/, ""), 'base64');	
	} catch (error) {
		var buffer = new Buffer.from(req.body.filedata, 'base64');
	}
	const params = {
		Bucket: 'pappayasign',
		Key: key,
		Body: buffer,
		ContentEncoding: 'base64',
    	ContentType: 'application/pdf'
	   };
	   s3.upload(params, function(err, data) {
		//console.log(err, data);
		if(data){
			res.send("document upload success");
		}
		else{
			res.send("document upload failed:"+err);
		}
	   });
	
  });



  app.post("/docdownload", function (req, res) {
	//console.log(req);
	var key = ''+req.body.UserID+'/Documents/'+req.body.filename+'.pdf';

	const params = {
		Bucket: 'pappayasign',
		Key: key
	  };
	  s3.getObject(params, (err, data) => {
		if (err) console.error(err);
		if(data){
			var docdata = {
				data: data.Body,
				Status: "doc found",
			  };
			res.send(docdata);
		}
		else{
			res.send(err);
		}
		
	  });
  });

  app.post("/templatedownload", function (req, res) {
	//console.log(req);
	var key = ''+req.body.UserID+'/Templates/'+req.body.filename+'.pdf';

	const params = {
		Bucket: 'pappayasign',
		Key: key
	  };
	  s3.getObject(params, (err, data) => {
		if (err) console.error(err);
		if(data){
			var templatedata = {
				data: data.Body,
				Status: "doc found",
			  };
			res.send(templatedata);
		}
		else{
			res.send(err);
		}
		
	  });
  });


/////////////////////////////////////////Node-Cron Functions/////////////////////////////////////////////

const expiry_taskMap = {};
const reminder_taskMap = {};

app.post("/expiry", function (req, res) {
	var day = parseInt(req.body.day);
	var month = parseInt(req.body.month);
	var year = parseInt(req.body.year);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  } );
	client.connect((err) => {
	  var query = { DocumentID: req.body.DocumentID };
	  const collection = client.db("UsersDB").collection("Documents");
	  //console.log(collection);
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
			if(result.Status != 'Completed' || result.Status != 'Void' || result.Status != 'Deleted'){
				const task = cron.schedule('* * '+day+' '+month+' *',()=>{
					//Foo the bar..
					var querydoc = { DocumentID: req.body.DocumentID };
					var newvalues = { $set: { Status: 'Expiring' } };
					//console.log(collection);
					const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  } );
					client.connect((err) => {
						const collection = client.db("UsersDB").collection("Documents");
					collection.updateOne(querydoc, newvalues, function (innererr, innerresult) {
						if (innererr) console.log(innererr);
						if(innerresult){
							
							console.log('cron started expiry')
						}
					});
				});
				},{
					timezone: "Asia/Kolkata"
				});
				expiry_taskMap[result.DocumentID] = task;
			}
			else{
				// for some condition in some code
				res.send('expiry cron deleted');
				let my_job = expiry_taskMap[result.DocumentID];
				my_job.destroy();
			}
		} else {  
		 res.send('expiry cron not scheduled');
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });

  function sendEmailtoReciever(Reciever, url){
	Reciever.forEach(function (data, index) {		
		var mailOptions = {
			from: '"Pappayasign" <devsign@pappaya.com>', // sender address
			to: data.RecepientEmail,
			body:
			  `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ` +
			  data.RecepientName +
			  `</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. </p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="` +
			  url +
			  `" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
			subject: 'PappayaSign: Sign Request(Reminder)',
		  };
		
		  // send mail with defined transport object
		  transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
			}
			//console.log("Message sent: " + info.response);
		  });

	  });

  }


  app.post("/reminder", function (req, res) {
	  var date = parseInt(req.body.date);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  } );
	client.connect((err) => {
	  var query = { DocumentID: req.body.DocumentID };
	  const collection = client.db("UsersDB").collection("Documents");
	  //console.log(collection);
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
			var Reciever = result.Reciever;
			if(result.Status != 'Completed' || result.Status != 'Void' || result.Status != 'Deleted'){
				const task = cron.schedule('* * */'+date+' * *',()=>{
					sendEmailtoReciever(Reciever, req.body.url);
					res.send('reminder cron scheduled');
					console.log('cron started reminder')
				},{
					timezone: "Asia/Kolkata"
				});
				reminder_taskMap[result.DocumentID] = task;
			}
			else{
				// for some condition in some code
				res.send('reminder cron deleted');
				let my_job = reminder_taskMap[result.DocumentID];
				my_job.destroy();
			}
		} else {  
		 res.send('reminder cron not scheduled');
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });
  

////////////////////////////////////////History Functions////////////////////////////////////////////////

app.post("/posthistory", function (req, res) {
	//console.log(req);
	var query = { 
		DocumentID: req.body.DocumentID
	 };
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
		var dataupdate = {
			$set:{
				HistoryTime: req.body.HistoryTime,
                HistoryUser: req.body.HistoryUser,
                HistoryAction: req.body.HistoryAction,
                HistoryActivity: req.body.HistoryActivity,
                HistoryStatus: req.body.HistoryStatus
			
		}}
		var datainsert = {
			HistoryTime: req.body.HistoryTime,
			HistoryUser: req.body.HistoryUser,
			HistoryAction: req.body.HistoryAction,
			HistoryActivity: req.body.HistoryActivity,
			HistoryStatus: req.body.HistoryStatus
			
		}
	  const collection = client.db("UsersDB").collection("Documents");

	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		//console.log('result:'+result.UserID);
		
			var docid = req.body.DocumentID;

			if(result){
				collection.updateOne({ DocumentID: docid },{ $push: {"History": datainsert }},{ upsert: true }, function (errinsrt, resultinsert) {
					if (errinsrt) res.send(errinsrt);
					if (resultinsert) {
					  res.send("history insert done");
					}
					client.close();
					// perform actions on the collection object
				  });
			}
			else{
				res.send('no doc');
				client.close();
			}
			
		
	  });
	  
	  
  });
});


app.post("/gethistory", function (req, res) {
	//console.log(req);
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  
	client.connect((err) => {
	  var query = { DocumentID: req.body.DocumentID };
	  const collection = client.db("UsersDB").collection("Documents");
	  //console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var historydata = {
				history: result.History,
				Status: "history found",
			  };
			  res.send(historydata);
		} else {
		  var historydata = {
			Status: "history not found",
		  };
		  res.send(historydata);
		}
		client.close();
	  });
	  // perform actions on the collection object
	});
  });



 ////////////////////////////////////Boilerplate functions/////////////////////////////////////////////// 

app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));
app.get("/ping", function (req, res) {
  return res.send("pong");
});
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, function () {
  //console.log("Server is running on Port: " + port);
});
