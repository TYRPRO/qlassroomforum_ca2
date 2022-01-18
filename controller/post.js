const express = require("express");

const router = express.Router();
const post = require("../model/post");
const printDebugInfo = require("./middleware/printDebugInfo");

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

<<<<<<< HEAD
    post.getPost(post_id, (err, result) => {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        }
        else {
            res.status(200).send(result)
        }
    })

})

router.get('/user/:user_id', printDebugInfo, (req, res) => {
    var user_id = req.params.user_id;
    console.log(user_id);

    post.getAllPostByUser(user_id, (err, result) => {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        }
        else {
            res.status(200).send(result)
        }
    })

})

router.get('/save/user/:user_id', printDebugInfo, (req, res) => {
    var user_id = req.params.user_id;

    post.getAllSavedPostByUser(user_id, (err, result) => {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        }
        else {
            res.status(200).send(result)
        }
    })
=======
	post.getPost(post_id, (err, result) => {
		if(err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});
>>>>>>> e311f55d4a1de88325c4f0e55b01f0410a0ec5d4

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

module.exports = router;