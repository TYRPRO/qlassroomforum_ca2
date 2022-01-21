/* eslint-disable react/prop-types */
import React from "react";
import "./search.css";

const Post = (props) => {
	console.log(props);
	return (
		<div className="post rounded mb-2" id="post_${posts[i].post_id}">
			<div className="row g-0 rounded">
				<div className="col-1 upvote-section py-2 justify-content-center voteDiv">
					<a className="text-center d-block py-1" id="post1-upvote"><i
						className="fas fa-arrow-up text-dark"></i></a>
					<p id="post#-val" className="text-center mb-0">{props.post_rating}</p>
					<a className="text-center d-block py-1" id="post1-downvote"><i
						className="fas fa-arrow-down text-dark"></i></a>
				</div>
				<div className="col-11 bg-white rounded p-2">
					<div className="d-flex flex-row align-items-baseline">
						<h6 className="d-inline fw-bold clickable-link">{props.subforum_name}</h6>
						<p className="fw-light text-secondary mx-1">•</p>
						<p className="d-inline text-secondary me-1">Posted by</p>
						<p className="d-inline text-secondary clickable-link" id="post#_user"> {props.first_name + " " + props.last_name}</p>
						<p className="fw-light text-secondary mx-1">•</p>
						<p className="text-secondary" id="post#_time">{props.post_created_at}</p>
					</div>
					<h5>{props.post_title}</h5>

				</div>
			</div>
		</div>
	);
};

export default Post;