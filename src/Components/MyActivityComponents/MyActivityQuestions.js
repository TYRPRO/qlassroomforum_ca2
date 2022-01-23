/* eslint-disable react/prop-types */
import React from "react";

const Question = (props) => {
	return (
		<div className="post rounded mb-2 bg-white" id={props.id}>
			<div className="row g-0">
				<div className="col-1 upvote-section py-1 justify-content-center align-self-center">
					<a className="text-center d-block" id="post1-upvote"><i
						className="fas fa-caret-up text-dark fs-3"></i></a>
					<p id="post#-val" className="text-center mb-0">{props.votes}</p>
					<a className="text-center d-block" id="post1-downvote"><i
						className="fas fa-caret-down text-dark fs-3"></i></a>
				</div>
				<div className="col-11 p-3">
					<h5>{props.title}</h5>
					<div className="d-flex flex-row align-items-baseline pt-2">
<<<<<<< HEAD
						<p className="text-secondary me-auto" id="post#_time">{props.date}</p>
						<p className="text-secondary mx-1">NO COMMENTS</p>
						<span className="text-primary material-icons md-24 ms-3 align-self-start">chat_bubble_outline</span>
						<p className="text-secondary mx-1">NO ANSWERS</p>
=======
						<p className="text-secondary" id="post#_time">{props.date}</p>
>>>>>>> a9a6abc16a1d021ea7c339381e85fcead72adff6
					</div>
				</div>
			</div>
		</div>
	);
};

export default Question;
