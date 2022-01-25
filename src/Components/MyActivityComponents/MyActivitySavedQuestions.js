/* eslint-disable react/prop-types */
import React from "react";

const SavedQuestion = (props) => {
	return (
		<div className="post rounded mb-2" id={props.id}>
			<div className="row g-0">
				<div className="col-1 upvote-section py-1 justify-content-center align-self-center">
					<a className="text-center d-block" id="post1-upvote"><i
						className="fas fa-caret-up text-dark fs-3"></i></a>
					<p id="post#-val" className="text-center mb-0">{props.votes}</p>
					<a className="text-center d-block" id="post1-downvote"><i
						className="fas fa-caret-down text-dark fs-3"></i></a>
				</div>
				<div className="col-11 bg-white p-2">
					{props.shortTitle == "" ? (
						<h5 className="text-dark clickable-link mb-3" style={{ cursor: "pointer" }}> {props.title}</h5>
					) : (
						<h5 className="text-dark clickable-link mb-3" style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title={props.title}> {props.shortTitle}</h5>
					)}
					<div className="toolbar d-flex flex-row align-items-center mt-2">
						<p className="text-secondary me-auto" id="post#_time">{props.date}</p>
						<p className="text-secondary mx-1">NO COMMENTS</p>
						<span className="text-primary material-icons md-24 ms-3 align-self-start">chat_bubble_outline</span>
						<p className="text-secondary mx-1">NO ANSWERS</p>
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