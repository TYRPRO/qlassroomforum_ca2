/* eslint-disable react/prop-types */
import React from "react";

const SavedQuestion = (props) => {
	return (
		<div className="post rounded mb-2" id={props.id}>
			<div className="row g-0">
				<div className="col-1 upvote-section py-2 justify-content-center">
					<a className="text-center d-block py-1 post-upvote" id="post1-upvote"><i
						className="fas fa-arrow-up text-dark"></i></a>
					<p id="post#-val" className="text-center mb-0">{props.votes}</p>
					<a className="text-center d-block py-1 post-downvote" id="post1-downvote"><i
						className="fas fa-arrow-down text-dark"></i></a>
				</div>
				<div className="col-11 bg-white p-2">
					<div className="d-flex flex-row align-items-baseline">
						<h6 className="d-inline fw-bold clickable-link">r/<a href={props.post_href} className="text-dark text-decoration-none">{props.subforumName}</a></h6>
						<p className="fw-light text-secondary mx-1">•</p>
						<p className="d-inline text-secondary me-1">Posted by</p>
						<p className="d-inline text-secondary clickable-link" id="post#_user"> u/{props.username}</p>
						<p className="fw-light text-secondary mx-1">•</p>
						<p className="text-secondary" id="post#_time">{props.date}</p>
					</div>
					<h5 className="mb-3">{props.title}</h5>
					<div className="toolbar d-flex flex-row align-items-center mt-2">
						<div className="d-flex flex-row text-secondary me-4 p-1 rounded hoverable">
							<span className="material-icons md-24 ms-0 me-1">chat_bubble_outline</span>
							<p className="mb-0 fw-bold me-1" id="comment_total"></p>
							<p className="mb-0 fw-bold fs-6">Comments</p>
						</div>
						<div className="d-flex flex-row text-secondary me-4 p-1 rounded hoverable">
							<span className="material-icons md-24 ms-0 mx-1">share</span>
							<p className="mb-0 fw-bold fs-6">Share</p>
						</div>
						<div className="save d-flex flex-row text-secondary me-4 p-1 rounded hoverable" id={props.bookmark}>
							<span className="material-icons ms-0">bookmark</span>
							<p className="mb-0 fw-bold fs-6">Unsave</p>
						</div>
						<div className="d-flex flex-row text-secondary me-4 p-1 rounded hoverable">
							<span className="material-icons md-24 mx-1 ms-0">outlined_flag</span>
							<p className="mb-0 fw-bold fs-6">Report</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SavedQuestion;