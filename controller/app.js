//Qlassroom Forums

//-----------------------------------
// imports
//-----------------------------------

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const verify = require("./middleware/verify.js");
const post = require("./post");
const answer = require("./answer");
const user = require("../model/user.js");

//-----------------------------------
// Middleware functions
//-----------------------------------
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const printDebugInfo = require("./middleware/printDebugInfo");
var jsonParser = bodyParser.json();
var cors = require("cors");
const subforum = require("./subforum");
//-----------------------------------
// MF configurations
//-----------------------------------
app.use(urlencodedParser);
app.use(jsonParser);

app.options("*", cors());
app.use(cors());

//-----------------------------------
// endpoints
//-----------------------------------

//default endpoint
app.get("/", (req, res) => {
	console.log("GET > " / " > Qlassroom Active");

	res.status(200).send({
		"Result": "GET > " / " > Qlassroom Active"
	});
	res.end();
});

app.get("/verify", printDebugInfo, verify.checkAdmin, function(req,res) { 
	res.status(200).send({"Results":"Verified"}); 
});

app.get("/userData", printDebugInfo, verify.extractUserData, function(req,res) { 
	res.status(200).send({"Results":"Verified"}); 
});

//login
app.post("/api/login", printDebugInfo, function (req, res) {

	var email = req.body.email;
	var password = req.body.password;
    
	user.login(email, password, function (err, token, result) {
		if (!err) {
			if (!result) {
				// this is matched to callback(null, null, null)
				var message = {"message":"Invalid Credentials"};

				res.status(401).send(message);
			}
			else {
				// this is matched to callback(null, not null)  
				var msg = {
					"token": token
				};
				res.status(200).send(msg);
			}

		} else {
			// this is matched to callaback(not null, null)
			res.status(500).send({"message":"Error authenticating user."});
		}

	});
});


app.use("/subforum", subforum);
app.use("/posts", post);
app.use("/answers", answer);



//-----------------------------------
// exports
//-----------------------------------
module.exports = app;