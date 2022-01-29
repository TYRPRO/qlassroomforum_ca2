/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./viewQn.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

import AnswerComment from "./AnswerComments";
import AnswerVote from "./AnswerVote";
import parseTime from "../../../helperFunctions/parseTime";

function Answer(props) {

	const [addComment, set_AddComment] = useState(false);
	const [answerComment, set_answerComment] = useState("");
	const [loggedInUser, set_loggedInUser] = useState({});
	const [answerComments, set_AnswerComments] = useState([]);

	var answer_info = props.answer;
	console.log(answer_info);

	useEffect(() => acquireUserData(), []);

	useEffect(() => {
		if (answer_info.comments) {
			var answer_comments = answer_info.comments;
			for (let i = 0; i < answer_comments.length; i++) {

				if (i == answer_comments.length - 1) {
					break;
				}

				var date1 = new Date(answer_comments[i].response_created_at);
				var date2 = new Date(answer_comments[i + 1].response_created_at);
				if (date2.getTime() < date1.getTime()) {
					let tmp = answer_comments[i];
					answer_comments[i] = answer_comments[i + 1];
					answer_comments[i + 1] = tmp;

					i = -1;
				}
			}
			set_AnswerComments(answer_comments);
		}

	}, [answer_info]);


	return (
		<div className="qn-answer">
			<div className="row">
				<AnswerVote response_id={answer_info.response_id} post_id={answer_info.fk_post_id} />
				<div className="col-10">

					<button className={
						props.isAlrdAccepted ?
							props.isRemoved ? ("btn btn-outline-secondary btn-sm text-center")
								: ("btn btn-outline-success btn-sm text-center")
							: props.isRemoved ? ("btn btn-outline-secondary btn-sm text-center")
								: ("btn btn-outline-secondary btn-sm text-center")
					} onClick={() => props.setAsAcceptedAnswer(props.index, answer_info.response_id, answer_info.fk_post_id)} >
						<span className="material-icons-outlined">mark_chat_read</span> {
							props.isAlrdAccepted ?
								props.isRemoved ? ("Set as Answer Accepted")
									: ("Answer Accepted")
								: props.isRemoved ? ("Set as Answer Accepted")
									: ("Set as Answer Accepted")
						}
					</button>


					<p className='qn-content mt-2' dangerouslySetInnerHTML={{ __html: answer_info.response }}></p>
					{/* <div className="row">
						<div className="col-7"></div>
						<div className='col-5'>
							<div className='p-1 postedBySection rounded'>
								<small className='mb-0 text-secondary'>Answered by</small>
								<div className=' row g-0'>
									<div className='col-3 py-1'>
										<div className='min-profile-pic bg-secondary'>

										</div>
									</div>
									<div className='col-9'>
										<small className='mb-0'>{"Jack"} {"Mamba"}</small>
										<br></br>
										<small className='mb-0 text-secondary'>Points ###</small>
									</div>
								</div>
							</div>
						</div>
					</div> */}
					<div className='d-flex flex-row mt-2 align-items-center'>
						<div className='min-profile-pic bg-secondary'></div>
						<small className='ms-2 mb-0 fw-bold'>
							{answer_info.User.first_name}
						</small>
						{/* <p className="fw-light text-secondary mx-2 mb-0">•</p> */}
						<small className="mb-0 mx-2 text-secondary">
							about {parseTime(answer_info.response_created_at)}
						</small>
					</div>
					{answerComments ? (answerComments.length > 0 ? <hr className='mb-1 hr-color'></hr> : null) : null}
					{answerComments ? (answerComments.map((comment, index) => <AnswerComment key={index} comment={comment} />)) : null}
					{addComment ?
						<div className=' input-group mt-2'>
							<input onChange={(e) => { set_answerComment(e.target.value); }} value={answerComment} className='form-control' placeholder='Comment on this answer?'></input>
							<button onClick={submitAnswerComment} className='btn btn-outline-secondary'>Submit</button>
						</div>
						:
						<button className='btn btn-light text-primary mt-1' onClick={() => set_AddComment(true)}>Add Comment</button>
					}
				</div>
			</div>
			<hr></hr>
		</div>
	);

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}

	function acquireUserData() {

		var token = findCookie("token");
		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				var data = response.data;
				set_loggedInUser({
					user_id: data.user_id,
					first_name: data.first_name,
					last_name: data.last_name,
					role: data.roles,
				});
			})
			.catch((err) => {
				console.log(err);
				window.location.assign("/login");
			});
	}

	function submitAnswerComment() {


		let comment_pattern = /^[a-zA-Z0-9#$.?! ()%,]*$/;
		let comment_accepted = comment_pattern.test(answerComment);

		if (answerComment.length < 1 || answerComment.length > 85) {
			comment_accepted = false;
		}

		var token = findCookie("token");
		var response_type = "comment";


		if (comment_accepted) {
			axios.post("http://localhost:8000/responses/", {
				user_id: loggedInUser.user_id,
				post_id: answer_info.fk_post_id,
				parent_response_id: answer_info.response_id,
				response_type: response_type,
				response: answerComment
			}, {
				headers: { "Authorization": "Bearer " + token }
			}).then(function (response) {
				console.log(response);
				set_answerComment("");
				set_AddComment(false);
				props.refreshAnswers();
			}).catch(function (error) {
				console.log(error);
			});
		}
		else {
			props.toastify.error("Comment must be less than 85 characters long and contain only letters, numbers, and the following symbols: $#.?! ()%,");

		}

	}
}




export default Answer;