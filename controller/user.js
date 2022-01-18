const express = require("express");
const router = express.Router();
const user = require("../model/user");
const verify = require("./middleware/verify.js");
const printDebugInfo = require("./middleware/printDebugInfo");

router.get("/verify", printDebugInfo, verify.checkAdmin, function(req,res) { 
	res.status(200).send({"Results":"Verified"}); 
});

router.get("/userData", printDebugInfo, verify.extractUserData, function(req,res) { 
	res.status(200).send({"Results":"Verified"}); 
});

//login
router.post("/api/login", printDebugInfo, function (req, res) {

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