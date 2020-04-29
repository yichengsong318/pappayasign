const express = require("express");
const favicon = require("express-favicon");
const nodemailer = require("nodemailer");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8080;
const app = express();

app.use(cors());

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

let transporter = nodemailer.createTransport({
  host: "mail.pappaya.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "devsign@pappaya.com",
    pass: "Pappaya@2020",
  },
});

const uri =
  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

app.post("/login", function (req, res) {
  console.log(req);
  const uri =
    "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    var query = { UserEmail: req.body.UserEmail };
    const collection = client.db("UsersDB").collection("Users");
    console.log(collection);

    collection.findOne(query, function (err, result) {
      if (err) throw err;
      if (result) {
        if (
          req.body.UserPassword === result.UserPassword &&
          result.UserActivated === true &&
          result.SignID != ""
        ) {
          var userdata = {
            UserID: result.UserID,
            Status: "login successful",
          };
          res.send(userdata);
        } else if (
          req.body.UserPassword === result.UserPassword &&
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
          req.body.UserPassword === result.UserPassword &&
          result.UserActivated === false
        ) {
          var userdata = {
			UserID: result.UserID,
			UserEmail: result.UserEmail,
            Status: "activate account",
          };
          res.send(userdata);
        } else if (req.body.UserPassword != result.UserPassword) {
          var userdata = {
            Status: "wrong password",
          };
          res.send(userdata);
        }
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
  console.log(req.body);
  const uri =
    "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });

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
    console.log(collection);
    collection.findOne(query, function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result) {
        res.send("User already exists");
      } else {
        collection.insertOne(registerUser, function (err, result) {
          if (err) res.send(err);
          if (result) {
            res.send("registered");
          }
          console.log("registered");
          client.close();
          // perform actions on the collection object
        });
      }
    });
  });
});


app.post("/resetpassword", function (req, res) {
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { UserEmail: req.body.UserEmail };
	  var newvalues = { $set: { UserPassword: req.body.UserPassword } };
	  const collection = client.db("UsersDB").collection("Users");
	  console.log(collection);
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
  console.log(req);
  const uri =
    "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    var query = { UserID: req.body.UserID };
    var newvalues = { $set: { UserActivated: req.body.UserActivated } };
    const collection = client.db("UsersDB").collection("Users");
    console.log(collection);
    collection.updateOne(query, newvalues, function (err, result) {
      if (err) throw err;
      res.send("activated");
      client.close();
    });
    // perform actions on the collection object
  });
});

app.post("/signature", function (req, res) {
  console.log(req);
  const uri =
    "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect((err) => {
    var query = { UserID: req.body.UserID };
    var newvalues = { $set: { SignID: req.body.SignID } };
    const collection = client.db("UsersDB").collection("Users");
    console.log(collection);
    collection.updateOne(query, newvalues, function (err, result) {
      if (err) throw err;
      res.send("signed");
      client.close();
    });
    // perform actions on the collection object
  });
});

app.post("/addtemplatedata", function (req, res) {
	console.log(req);
	var query = { TemplateID: req.body.TemplateID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
		console.log(result);
		if (result) {
		  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
			if (errorupdate) res.send(errorupdate);
			if (resultupdate) {
			  res.send("update done");
			}
			else{
				console.log('not ther');
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


app.post("/adddocumentdata", function (req, res) {
	console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
				Reciever: []
			
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
				Reciever: []
			
		}
	  const collection = client.db("UsersDB").collection("Documents");

	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		console.log(result);
		if (result) {
		  collection.updateOne(query, dataupdate, function (errorupdate, resultupdate) {
			if (errorupdate) res.send(errorupdate);
			if (resultupdate) {
			  res.send("update done");
			}
			else{
				console.log('not ther');
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
	console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
			console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/updatedocumentstatus", function (req, res) {
	console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
			console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/updaterecieverdata", function (req, res) {
	console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
			console.log('error');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/updaterequestdata", function (req, res) {
	console.log(req);
	var query = { UserID: req.body.UserID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
			console.log('error');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/getdocdata", function (req, res) {
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { DocumentID: req.body.DocumentID };
	  const collection = client.db("UsersDB").collection("Documents");
	  console.log(collection);
  
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
	console.log(req);
	var query = { DocumentID: req.body.DocumentID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
			console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/getReciever", function (req, res) {
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { DocumentID: req.body.DocumentID };
	  const collection = client.db("UsersDB").collection("Documents");
	  console.log(collection);
  
	  collection.findOne(query, function (err, result) {
		if (err) throw err;
		if (result) {
				var docdata = {
				Reciever: result.Reciever,
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
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { UserID: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Users");
	  console.log(collection);
  
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
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { UserEmail: req.body.UserEmail };
	  const collection = client.db("UsersDB").collection("Users");
	  console.log(collection);
  
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
	console.log(req);
	var query = { 
		UserID: req.body.UserID
	 };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
		console.log('result:'+result.UserID);
		
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


app.post("/addtemplatereciever", function (req, res) {
	console.log(req);
	var query = { TemplateID: req.body.TemplateID };
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
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
			console.log('not ther');
		}
		client.close();
		
		// perform actions on the collection object
	  });
	  
	  
  });
});

app.post("/gettemplatedata", function (req, res) {
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { TemplateID: req.body.TemplateID };
	  const collection = client.db("UsersDB").collection("Templates");
	  console.log(collection);
  
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



  app.post("/getuserdata", function (req, res) {
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { UserID: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Users");
	  console.log(collection);
  
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
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { Owner: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Documents");
	  console.log(collection);
  
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
	console.log(req);
	const uri =
	  "mongodb+srv://prashanth:cn@users-dppv1.mongodb.net/UsersDB?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
  
	client.connect((err) => {
	  var query = { Owner: req.body.UserID };
	  const collection = client.db("UsersDB").collection("Templates");
	  console.log(collection);
  
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





app.post("/sendmail", function (req, res) {
  console.log("req.body.to is " + req.body.to);
  console.log("req.body.subject is " + req.body.subject);
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
    console.log("Message sent: " + info.response);
    res.send("Message sent: " + info.response);
  });
});

app.post("/sendmailattachments", function (req, res) {
  console.log("req.body.to is " + req.body.to);
  console.log("req.body.subject is " + req.body.subject);
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
    console.log("Message sent: " + info.response);
    res.send("Message sent: " + info.response);
  });
});

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
  console.log("Server is running on Port: " + port);
});
