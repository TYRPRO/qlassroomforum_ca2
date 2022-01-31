/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../PostComponent/Post.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../store/actions/Common";

const QnVotes = (props) => {
	const [upvoted, setUpvote] = useState(false);
	const [downvoted, setDownvote] = useState(false);
	const [votecount, setVoteCount] = useState(0);

	//login states
	const acquireData = useSelector((state) => state.Common.acquireData);
	const userDetails = useSelector((state) => state.Common.userDetails);
	const dispatch = useDispatch();

	// login functions
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
		axios.get("https://qlassroombackend.herokuapp.com/vote/post_rating?user_id=" +
			userDetails.user_id + "&post_id=" + props.post_id)
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
				console.log(err);
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
		axios.get("https://qlassroombackend.herokuapp.com/vote/posts/" + props.post_id)
			.then(response => {
				var votenum = 0;

				var data = response.data;
				for (var i = 0; i < data.length; i++) {
					if (data[i].vote_type == true) {
						votenum += 1;
					}
					else {
						votenum -= 1;
					}
				}

				setVoteCount(votenum);
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

			axios.delete("https://qlassroombackend.herokuapp.com/vote/post_rating",
				{
					data: {
						user_id: userDetails.user_id,
						post_id: props.post_id
					}
				},
				{
					headers: {
						"Authorization": "Bearer " + token
					}
				})
				.then(response => {
					console.log("Vote deleted");
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

			axios.post("https://qlassroombackend.herokuapp.com/vote/post_rating",
				{
					user_id: userDetails.user_id,
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

			axios.delete("https://qlassroombackend.herokuapp.com/vote/post_rating",
				{
					data: {
						user_id: userDetails.user_id,
						post_id: props.post_id
					}
				},
				{
					headers: {
						"Authorization": "Bearer " + token
					}
				})
				.then(response => {
					console.log("Vote deleted");
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

			axios.post("https://qlassroombackend.herokuapp.com/vote/post_rating",
				{
					user_id: userDetails.user_id,
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
		getUserDetails(dispatch);
	}, []);

	useEffect(() => {
		setVoteStatus();
		VoteCount();
	}, [acquireData]);
	
	return <div className="col-1 py-2">
		<a onClick={() => upvote()} className={"text-center d-block post-upvote " + checkUpvote()} id={"post_" + props.post_id + "_upvote"}><i
			className="fas fa-caret-up text-dark"></i></a>
		<p id={"post_" + props.post_id + "_popularity"} className="text-center mb-0">{votecount}</p>
		<a onClick={() => downvote()} className={"text-center d-block post-downvote " + checkDownvote()} id={"post_" + props.post_id + "_downvote"}><i
			className="fas fa-caret-down text-dark"></i></a>
	</div>;
};

export default QnVotes;