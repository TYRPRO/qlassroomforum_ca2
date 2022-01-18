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
const subforum = require("./subforum");
const user = require("./user.js");

//-----------------------------------
// Middleware functions
//-----------------------------------
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var cors = require("cors");

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

app.use("/posts", post);
app.use("/answers", answer);
app.use("/subforum", subforum);
app.use("/user", user);

//-----------------------------------
// exports
//-----------------------------------
module.exports = app;