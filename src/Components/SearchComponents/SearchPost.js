/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./search.css";
import parseTime from "../../helperFunctions/parseTime";
import AnswersPill from "../PostComponent/AnswersPill";
import PostVotes from "../PostComponent/PostVotes";
import Toolbar from "../ToolbarComponents/Toolbar";

const SearchPost = (props) => {
	const [votecount, setVoteCount] = useState(0);

	function redirect(post_id) {
		window.location.href = `/posts/${post_id}`;
	}

	function extractContent(post_content) {
		let extractedContent = "";
		let skip = false;
		for (let i = 0; i < post_content.length; i++) {
			if (post_content[i] == "<") {
				skip = true;
			}
			else if (post_content[i] == ">") {
				skip = false;
			}
			else if (!skip == true) {
				extractedContent += post_content[i];
			}
		}

		return extractedContent;
	}

	function extractImages(post_content) {
		let current_image_url = "";
		let record = false;
		let image_link_array = [];
		for (var i = 0; i < post_content.length; i++) {
			if (post_content.slice(i, i + 10) == "<img src=\"") {
				i += 9;
				record = true;
				console.log("True recorded");
			}
			else if (post_content[i] == "\"" && record == true) {
				record = false;
				image_link_array.push(current_image_url);
				current_image_url = "";
			}
			else if (record) {
				current_image_url += post_content[i];
			}
		}
		return image_link_array;
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


	useEffect(() => {
		VoteCount();
	}
	, []);
	return (
		<div className="post rounded mb-2 border-top border-bottom" id={"post_" + props.post_id}>
			<div className="row g-0">
				<div className="col-1 py-2">
					<a className={"text-center d-block py-3 post-upvote"} id={"post_" + props.post_id + "_upvote"}><i
						className="fas fa-caret-up text-dark fs-3"></i></a>
					<p id={"post_" + props.post_id + "_popularity"} className="text-center mb-0">{votecount}</p>
					<a className={"text-center d-block py-3 post-downvote"} id={"post_" + props.post_id + "_downvote"}><i
						className="fas fa-caret-down text-dark fs-3"></i></a>
				</div>;

				<div className="col-9 bg-white p-2">
					<div className="position-relative" onClick={() => redirect(props.post_id)}>
						<a style={{ textDecoration: "none" }} href={props.fk_subforum_id + "/" + props.post_id} className="d-flex flex-row">
							<h5 style={{ color: "black" }} id={"post_" + props.post_id + "_content"} className="mb-0">{props.post_title}</h5>
							<div className="d-flex flex-row">

							</div>
						</a>
						<div className="d-flex flex-row align-items-baseline">
							<span className="Add Profile Picture Here"></span><p className="d-inline text-secondary me-1">Posted by <a>{props.first_name}</a></p>
							<p className="d-inline text-secondary clickable-link" id={"post_" + props.fk_user_id}></p>
							<p className="fw-light text-secondary mx-1">•</p>
							<p className="text-secondary" id={"post_" + props.post_id + "_time"}>{parseTime(props.post_created_at)}</p>
						</div>
						{/* <p className="mt-2 PostBody">{extractContent(props.post_content)}</p>
						<div id={"post_media_" + props.post_id} className="d-flex flex-row mediaDiv pb-3">
							{extractImages(props.post_content).map((image_url, index) => {
								if (index < 2) {
									return (
										<img key={image_url + Math.random(1000)} src={`${image_url}`} className="img-fluid px-1 w-25" style={{ objectFit: "contain" }}></img>);
								}
								else if (index == 2) {
									return <p key={`${props.post_id}_more_images`} className="align-self-end">More Images</p>;
								}

							})}
						</div> */}
						<div className="d-flex flex-row align-items-baseline">
							<h6 className="Tags">
								<a href={`/subforum/${props.fk_subforum_id}`} className="text-dark text-decoration-none">{props.subforum_name}</a>
							</h6>
							<p className="fw-light text-secondary mx-1">•</p>
							<h6 className="Tags">
								<a href={`/subforum/${props.fk_subforum_id}`} className="text-dark text-decoration-none">{props.grade_name}</a>
							</h6>
						</div>
					</div>
					<Toolbar />
				</div>
				<div className="col-1 d-flex p-2" onClick={() => redirect(props.post_id)}><AnswersPill answers={props.post_answers_count} isAnswered={props.post_is_answered} /> </div>
			</div>
		</div>
	);
};

export default SearchPost;