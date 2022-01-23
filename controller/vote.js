const express = require("express");
const router = express.Router();
const vote  = require("../model/vote.js");
const { verifySameUserId } = require("./middleware/verify.js");

router.get("/subforum", (req,res) => {
	var subforum_id = req.query.subforum_id;
	var user_id = req.query.user_id;
	vote.getUserSubforumPostVotes(user_id, subforum_id, (result,err) => {
		if(err) {
			res.status(500).send({"message": "Internal Server Error"});
		} else {
			res.status(200).send(result);
		}
	});
});

router.post("/post_rating", verifySameUserId, (req,res) => {
	var user_id = req.body.user_id;
	var post_id = req.body.post_id;
	var vote_type = req.body.vote_type;

	// Find the user's standing on Post
	vote.getUserPostVotes(user_id, post_id, (result, err) => {
		if(err) {
			console.log(err);
			res.status(500).send({"message": "Internal Server Error"});
		}
		else {
			if(result.length == 0) {
				vote.createPostVote(vote_type, post_id, user_id, (result,err) => {
					if(err) {
						res.status(500).send({"message": "Internal Server Error"});
					}
					else {
						res.status(201).send({"message": "Vote Created"});
					}
				});
			}
			else {
				var requested_vote;
				if(vote_type == 0) {
					requested_vote = false;
				} else {
					requested_vote = true;
				}


				if(requested_vote == result[0].vote_type) {
					res.status(409).send({"message": "You have already voted on this post"});
				}
				else if (requested_vote != result[0].vote_type) {
					vote.updatePostVote(vote_type, post_id, user_id, (result,err) => {
						if(err) {
							res.status(500).send({"message": "Internal Server Error"});
						}
						else {
							res.status(200).send({"message": "Vote Updated"});
						}
					});
				}
                
			}
            
		}
	});

});

router.delete("/post_rating", (req,res) => {
	var user_id = req.body.user_id;
	var post_id = req.body.post_id;

	vote.deletePostVote(post_id, user_id, (result,err) => {
		if(err) {
			res.sendStatus(500).send(err);
		}
		else {
			res.sendStatus(200);
		}
	});
});

router.get("/all", (req,res) => {
	var user_id = req.query.user_id;
	vote.getUserVotes(user_id, (result,err) => {
		if(err) {
			res.status(500).send({"message": "Internal Server Error"});
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/post_rating", (req,res) => {
	var user_id = req.query.user_id;
	var post_id = req.query.post_id;
	vote.getUserPostVotes(user_id, post_id, (result,err) => {
		if(err) {
			res.status(500).send({"message": "Internal Server Error"});
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/posts/:post_id", (req,res) => {
	var post_id = req.params.post_id;
	vote.getPostVotes(post_id, (result,err) => {
		if(err) {
			res.status(500).send({"message": "Internal Server Error"});
		}
		else {
			res.status(200).send(result);
		}
	});
});


module.exports = router;