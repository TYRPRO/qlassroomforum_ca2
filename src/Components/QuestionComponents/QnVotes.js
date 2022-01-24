/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../PostComponent/Post.css";
import axios from "axios";

const QnVotes = (props) => {
	const [upvoted, setUpvote] = useState(false);
	const [downvoted, setDownvote] = useState(false);
	const [votecount, setVoteCount] = useState(0);
	//login info
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [user_id, setUserID] = useState(0);
	const [role, setRole] = useState("");

	const [acquireData, setAcquireData] = useState(false);

	// login functions
	function acquireUserData() {
		var token = findCookie("token");

		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				var data = response.data;
				setFirstname(data.first_name);
				setLastname(data.last_name);
				setUserID(data.user_id);
				setRole(data.roles);

				setAcquireData(true);
			})
			.catch((err) => {
				console.log(err);
				window.location.assign("/login");
			});
	}

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}

	function setVoteStatus() {
		if (acquireData != true) {
			return;
		}
		axios.get("http://localhost:8000/vote/post_rating?user_id=" +
			user_id + "&post_id=" + props.post_id)
			.then(response => {
				var data = response.data;
				if (data.length >= 1) {
					var vote_type = data[0].vote_type;
					if (vote_type) {
						setUpvote(true);
						setDownvote(false);
					}
					else {
						setDownvote(true);
						setUpvote(false);
					}
				}
			})
			.catch((err) => {
				console.log(err.response.data.message);
			});
	}

	function checkUpvote() {
		if (upvoted) {
			return ("upvoted");
		}
		else {
			return ("");
		}
	}

	function checkDownvote() {
		if (downvoted) {
			return ("downvoted");
		}
		else {
			return ("");
		}
	}

	function VoteCount() {
		setVoteCount(0);
		axios.get("http://localhost:8000/vote/posts/" + props.post_id)
			.then(response => {
				var data = response.data;
				for (var i = 0; i < data.length; i++) {
					if (data[0].vote_type == true) {
						setVoteCount(votecount + 1);
					}
					else {
						setVoteCount(votecount - 1);
					}
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function upvote() {
		var token = findCookie("token");
		if (upvoted) {
			setUpvote(false);
			setVoteCount(votecount - 1);

			axios.delete("http://localhost:8000/vote/post_rating",
				{
					data:{					
						user_id: user_id,
						post_id: props.post_id
					}
				},
				{
					headers: {
						"Authorization": "Bearer " + token
					}
				})
				.then(response => {
					console.log(response);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		else {
			setUpvote(true);
			if (downvoted) {
				setDownvote(false);
				setVoteCount(votecount + 2);
			}
			else {
				setVoteCount(votecount + 1);
			}

			axios.post("http://localhost:8000/vote/post_rating",
				{					
					user_id: user_id,
					post_id: props.post_id,
					vote_type: true
				},
				{
					headers: {
						"Authorization": "Bearer " + token
					}
				})
				.then(response => {
					console.log("Vote created");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	function downvote() {
		var token = findCookie("token");
		if (downvoted) {
			setDownvote(false);
			setVoteCount(votecount + 1);

			axios.delete("http://localhost:8000/vote/post_rating",
				{
					data:{					
						user_id: user_id,
						post_id: props.post_id
					}
				},
				{
					headers: {
						"Authorization": "Bearer " + token
					}
				})
				.then(response => {
					console.log(response);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		else {
			setDownvote(true);
			if (upvoted) {
				setUpvote(false);
				setVoteCount(votecount - 2);
			}
			else {
				setVoteCount(votecount - 1);
			}

			axios.post("http://localhost:8000/vote/post_rating",
				{					
					user_id: user_id,
					post_id: props.post_id,
					vote_type: false
				},
				{
					headers: {
						"Authorization": "Bearer " + token
					}
				})
				.then(response => {
					console.log("Vote created");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	useEffect(() => {
		acquireUserData();
	}
	, []);
	useEffect(() => {
		setVoteStatus();
		VoteCount();
	}
	, [acquireData]);
	return <div className="col-1 py-2">
		<a onClick={() => upvote()} className={"text-center d-block py-3 post-upvote " + checkUpvote()} id={"post_" + props.post_id + "_upvote"}><i
			className="fas fa-caret-up text-dark fs-3"></i></a>
		<p id={"post_" + props.post_id + "_popularity"} className="text-center mb-0">{votecount}</p>
		<a onClick={() => downvote()} className={"text-center d-block py-3 post-downvote " + checkDownvote()} id={"post_" + props.post_id + "_downvote"}><i
			className="fas fa-caret-down text-dark fs-3"></i></a>
	</div>;
};

export default QnVotes;