/* eslint-disable react/prop-types */
import React, { useState } from "react";
import QnVotes from "../QuestionComponents/QnVotes";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useSelector } from "react-redux";

const SavedQuestion = (props) => {

	const userDetails = useSelector((state) => state.Common.userDetails);
	const [bookmarkHover, setBookmarkHover] = useState(false);

	return (
		<div className="div-shadow rounded mb-2 bg-white" id={"post_" + props.id}>
			<div className="row g-0">
				<QnVotes
					key={"vote_" + props.id}
					user_id={props.user_id}
					post_id={props.id}
				/>
				<div className="col-11 p-3">
					<div className="d-flex flex-row">
						{props.shortTitle == "" ? (
							<h5 className="text-dark clickable-link" onClick={() => { window.location.href = `/posts/${props.id}`; }} style={{ cursor: "pointer" }}> {props.title}</h5>
						) : (
							<h5 className="text-dark clickable-link" onClick={() => { window.location.href = `/posts/${props.id}`; }} style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title={props.title}> {props.shortTitle}</h5>
						)}
						<div className="d-flex ms-auto">
							<button onMouseEnter={() => { setBookmarkHover(true); }} onMouseLeave={() => { setBookmarkHover(false); }} onClick={() => { props.removeBookmarkSavedQuestion(userDetails.user_id, props.id); }} className='text-success'>
								<BookmarkIcon sx={{ fontSize: 26 }} />
								{bookmarkHover ? "Bookmarked" : ""}
							</button>
						</div>
					</div>
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

export default SavedQuestion;