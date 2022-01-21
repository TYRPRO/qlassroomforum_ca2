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

router.post("/", printDebugInfo, (req, res) => {
	var title = req.body.title;
	var content = req.body.content;
	var user_id = req.body.user_id;
	var subforum_id = req.body.subforum_id;

	post.createPost(user_id, subforum_id, title, content, (err, result) => {
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

router.post("/upload_image", upload.single("image"), printDebugInfo, (req, res) => {

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

router.put("/correctAnswer", printDebugInfo, (req, res) => {
	var post_id = req.body.post_id;
	var answer_id = req.body.answer_id;

	post.setCorrectAnswer(post_id, answer_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.status(200).send(result);
		}
	});
});

module.exports = router;