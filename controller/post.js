const express = require("express");

const router = express.Router();
const post = require("../model/post");
const printDebugInfo = require("./middleware/printDebugInfo");

//Imports required for media upload
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./mediaUploadTemp/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
	}
});
const upload = multer({ dest: "./mediaUploadTemp", storage: storage });
const mediaUpload = require("./mediaUpload");

//similarity
function similarity(string, string2) {
	var arr = string.split(" ");
	var arr2 = string2.split(" ");
	var checklst = [];
	//loop for number of words in input string2
	for (var count = 0; count < arr.length; count++) {
		//loop for number of words in database string
		for (var i = 0; i < arr2.length; i++) {
			var longer = arr[count];
			var shorter = arr2[i];
			if (arr[count].length < arr2[i].length) {
				longer = arr2[i];
				shorter = arr[count];
			}
			var longerLength = longer.length;
			var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
			if (num > 0.4) {
				checklst.push(num);
			}
		}
		//run one check with the whole string intact
		longer = arr[count];
		shorter = string2;
		if (arr[count].length < string2.length) {
			longer = string2;
			shorter = string;
		}
		var longerLength = longer.length;

		var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
		if (num > 0.4) {
			checklst.push(num);
		}
	}
	//run one check with the whole string2 intact
	for (var i = 0; i < arr2.length; i++) {
		var longer = string;
		var shorter = arr2[i];
		if (string.length < arr2[i].length) {
			longer = arr2[i];
			shorter = string;
		}
		var longerLength = longer.length;
		var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
		if (num > 0.4) {
			checklst.push(num);
		}
	}
	longer = string;
	shorter = string2;
	if (string.length < string2.length) {
		longer = string2;
		shorter = string;
	}
	var longerLength = longer.length;

	var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
	if (num > 0.4) {
		checklst.push(num);
	}

	var result = 0;
	for (var i = 0; i < checklst.length; i++) {
		result += checklst[i];
	}

	return (result / checklst.length);
}

//Levenshtein Distance
function editDistance(string, string2) {
	string = string.toLowerCase();
	string2 = string2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= string.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= string2.length; j++) {
			if (i == 0)
				costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (string.charAt(i - 1) != string2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue),
							costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0)
			costs[string2.length] = lastValue;
	}
	return costs[string2.length];
}

// Get All Posts
router.get("/", printDebugInfo, (req, res) => {
	post.getAllPosts((err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.status(200).send(result);
		}
	});
});

router.post("/", printDebugInfo, (req, res) => {
	var title = req.body.title;
	var content = req.body.content;
	var user_id = req.body.user_id;
	var subforum_id = req.body.subforum_id;
	var grade = req.body.grade_id;

	post.createPost(user_id, subforum_id, title, content, grade, (err, result) => {
		if (err) {
			console.log(err);
			res.status(500).send(err);

		}
		else {
			res.status(200).send(result);
			console.log(result);
			// Handle labels here...
		}
	});
});

router.get("/user/:user_id", printDebugInfo, (req, res) => {
	var user_id = req.params.user_id;
	console.log(user_id);

	post.getAllPostByUser(user_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});

});

router.get("/save/user/:user_id", printDebugInfo, (req, res) => {
	var user_id = req.params.user_id;

	post.getAllSavedPostByUser(user_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/getAllFromSubforum/:fk_subforum_id", printDebugInfo, (req, res) => {
	var fk_subforum_id = req.params.fk_subforum_id;

	post.getAllSubforumPosts(fk_subforum_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});

});

router.post("/upload_image", upload.single("file"), printDebugInfo, (req, res) => {
	var file = req.file;
	if (file != null) {

		mediaUpload(file, function (err, result) {
			if (result) {
				res.status(201).send(result);
				//result: { success: true, media_url: media_url, content_type: content_type }
			}
			else {
				res.status(500).send(err);
				//result: { success: false, message: message }
			}
		});
	}
	else {
		res.status(500).send("No file uploaded");
	}
});

router.post("/filter/home", printDebugInfo, (req, res) => {
	var subforum_id = req.body.subforum_id;
	var grade_id = req.body.grade_id;
	var isanswered = req.body.isanswered;
	if (grade_id == undefined) {
		grade_id = null;
	}
	if (isanswered == undefined) {
		isanswered = null;
	}
	if (subforum_id == undefined) {
		subforum_id = null;
	}
	post.getFilteredPost(subforum_id, grade_id, isanswered, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.status(200).send(result);
		}
	});
});

//get post searches
router.get("/search", printDebugInfo, function (req, res) {
	var query = req.query.query;

	post.searchPost(query, function (err, result) {
		if (!err) {
			res.status(200).send({ "Result": result });
		} else {
			res.status(500).send({ "message": "Error while searching for post" });
		}
	});

});

//smart search posts
router.get("/SimilarSearch", printDebugInfo, function (req, res) {
	var word = req.query.query;

	post.getAllPosts(function (result, err) {
		if (!err) {
			var newarr = [];
			for (var i = 0; i < result.length; i++) {
				if (similarity(word, result[i].post_title) > 0.4) {
					result[i].similar = parseFloat(similarity(word, result[i].post_title));
					newarr.push(result[i]);
				}
			}
			res.status(200).send(newarr);
		} else {
			res.status(500).send({ "message": err });
		}
	});
});

router.get("/:post_id", printDebugInfo, (req, res) => {
	var post_id = req.params.post_id;

	post.getPost(post_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});

});

module.exports = router;