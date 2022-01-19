var config = require("../config.js");
var jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

var sequelize = require("./sequelize/databaseModel.js");
const e = require("express");
const { User, User_Type, Authenticate } = sequelize.models;

//-----------------------------------
// objects / functions
//-----------------------------------
var user = {

	login: function (email, password, callback) {
		User.findAll({
			attributes: ["user_id", "first_name", "last_name", "roles"],
			where: {
				email: email
			},
			include: [
				{
					model: Authenticate,
					where: {
						password: password
					},
				},
			]
		})
			.then(function (result) {
				if (result.length == 0) {
					return callback(null, null, null);
				}
				// it must be that we have ONE result here,
				// since the email is Unique
				else {
					//confirm if we have the key
					console.log("Secret Key: " + config.key);
					console.log("Result[0] userid: " + result[0].user_id);
					console.log("Result: " + result);
					//generate the token

					var token = jwt.sign(
						// (1) Payload
						{
							userData: result[0]
						},
						// (2) Secret Key
						config.key,
						// (3) Lifretime of token
						{
							//expires in 24 hrs
							expiresIn: 86400
						}
					);
					return callback(null, token, result[0]);
				}
			});
	},
};

//-----------------------------------
// exports
//-----------------------------------
module.exports = user;