/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./viewQn.css";
import React, { useState } from "react";
import axios from "axios";

import AnswerComment from "./AnswerComments";
import AnswerVote from "./AnswerVote";

function Answer(props) {

	const [addComment, set_AddComment] = useState(false);
	const [answerComment, set_answerComment] = useState("");

	var answer_info = props.answer;

	return (
		<div className="qn-answer">
			<div className="row">
				<AnswerVote response_id={answer_info.response_id} post_id={answer_info.fk_post_id}/>
				<div className="col-10">
					<button className={
						props.isAlrdAccepted ?
							props.isRemoved ? ("btn btn-outline-secondary btn-sm text-center")
								: ("btn btn-outline-success btn-sm text-center")
							: props.isRemoved ? ("btn btn-outline-secondary btn-sm text-center")
								: ("btn btn-outline-secondary btn-sm text-center")
					}
					onClick={() => props.setAsAcceptedAnswer(props.index, answer_info.response_id, answer_info.fk_post_id)} >
						<span className="material-icons-outlined">mark_chat_read</span> {
							props.isAlrdAccepted ?
								props.isRemoved ? ("Set as Answer Accepted")
									: ("Answer Accepted")
								: props.isRemoved ? ("Set as Answer Accepted")
									: ("Set as Answer Accepted")
						}
					</button>
					<p className='qn-content' dangerouslySetInnerHTML={{ __html: answer_info.response }}></p>
					<div className="row">
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

					</div>
					{answer_info.comments ? (answer_info.comments.length > 0 ? <hr className='mb-1'></hr> : null) : null}
					{answer_info.comments ? (answer_info.comments.map((comment, index) => <AnswerComment key={index} comment={comment} />)) : null}
					{addComment ?
						<div className=' input-group'>
							<input onChange={(e) => { set_answerComment(e.target.value); }} value={answerComment} className='form-control' placeholder='Comment on this answer?'></input>
							<button onClick={submitAnswerComment} className='btn btn-outline-secondary'>Submit</button>
						</div>
						:
						<button className='btn btn-light text-primary' onClick={() => set_AddComment(true)}>Add Comment</button>
					}


				</div>
			</div>
			<hr></hr>
		</div>
	);

	function submitAnswerComment() {
		// Temp User ID
		var user_id = "16f59363-c0a4-406a-ae65-b662c6b070cd";
		var response_type = "comment";



		axios.post("http://localhost:8000/responses/", {
			user_id: user_id,
			post_id: answer_info.fk_post_id,
			parent_response_id: answer_info.response_id,
			response_type: response_type,
			response: answerComment
		}).then(function (response) {
			console.log(response);
			props.refreshAnswers();
		}).catch(function (error) {
			console.log(error);
		});
	}



}




export default Answer;