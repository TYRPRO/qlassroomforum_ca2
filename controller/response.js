const express = require("express");

const router = express.Router();
const response = require("../model/response");
const printDebugInfo = require("./middleware/printDebugInfo");

router.post("/", printDebugInfo, (req, res) => {
	var response_value = req.body.response;
	var parent_response_id  = req.body.parent_response_id;
	var response_type = req.body.response_type;
	var post_id = req.body.post_id;
	var user_id = req.body.user_id;

	response.createResponse(response_value, parent_response_id, response_type, post_id, user_id, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			res.status(200).send(result);
			console.log(result);
		}
	});
});

router.get("/:post_id", printDebugInfo, (req, res) => {
	var post_id = req.params.post_id;

	response.getResponses(post_id, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		}
		else {
			res.status(200).send(result);
		}
	});
});

module.exports = router;