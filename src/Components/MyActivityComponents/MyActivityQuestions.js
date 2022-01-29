/* eslint-disable react/prop-types */
import React from "react";
import QnVotes from "../QuestionComponents/QnVotes";

const Question = (props) => {
	return (
		<div className="post rounded mb-2 bg-white" id={"post_" + props.id}>
			<div className="row g-0">
				{/* <div className="col-1 upvote-section py-1 justify-content-center align-self-center">
					<a className="text-center d-block" id="post1-upvote"><i
						className="fas fa-caret-up text-dark fs-3"></i></a>
					<p id="post#-val" className="text-center mb-0">{props.votes}</p>
					<a className="text-center d-block" id="post1-downvote"><i
						className="fas fa-caret-down text-dark fs-3"></i></a>
				</div> */}
				<QnVotes
					key={"vote_" + props.id}
					user_id={props.user_id}
					post_id={props.id}
				/>
				<div className="col-11 p-3">
					{props.shortTitle == "" ? (
						<h5 className="text-dark clickable-link" onClick={() => { window.location.href = `/posts/${props.id}`; }} style={{ cursor: "pointer" }}> {props.title}</h5>
					) : (
						<h5 className="text-dark clickable-link" onClick={() => { window.location.href = `/posts/${props.id}`; }} style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title={props.title}> {props.shortTitle}</h5>
					)}
					<div className="d-flex flex-row align-items-baseline pt-2">
						<p className="text-secondary me-auto" id="post#_time">{props.date}</p>
						{
							props.commentCount == 0 ? (<p className="text-secondary mx-1">NO COMMENTS</p>) :
								props.commentCount == 1 ? (<p className="text-secondary mx-1">1 COMMENT</p>) :
									(<p className="text-secondary mx-1">{props.commentCount} COMMENTS</p>)
						}
						<span className="text-primary material-icons md-24 ms-3 align-self-start">chat_bubble_outline</span>
						{
							props.answerCount == 0 ? (<p className="text-secondary mx-1">NO ANSWERS</p>) :
								props.answerCount == 1 ? (<p className="text-secondary mx-1">1 ANSWER</p>) :
									(<p className="text-secondary mx-1">{props.answerCount} ANSWERS</p>)
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Question;
