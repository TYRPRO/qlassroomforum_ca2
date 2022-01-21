/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import "./viewQn.css";
import { useState } from "react";
function Answer(props) {

	console.log(props);

	const [addComment, setAddComment] = useState(false);
	var answer_info = props.answer;

	var AnswerComments = ["something cool", "another comment"];
	return (
		<div className="qn-answer">
			<div className="row">
				<div className="col-2">
					<a className="text-center d-block py-1 post-upvote" id="post_upvote"><i className="fas fa-arrow-up text-dark" /></a>
					<p id="post_rating" className="text-center mb-0">####</p>
					<a className="text-center d-block py-1 post-downvote" id="post_downvote"><i className="fas fa-arrow-down text-dark" /></a>
				</div>
				<div className="col-10">
					<p className='qn-content' dangerouslySetInnerHTML={{__html: answer_info.answer}}></p>
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
										<small className='mb-0'>{answer_info.User.first_name} {answer_info.User.last_name}</small>
										<br></br>
										<small className='mb-0 text-secondary'>Points ###</small>
									</div>
								</div>
							</div>
						</div>

					</div>
					{AnswerComments.length > 0 ? <hr className='mb-1'></hr> : null}
					{AnswerComments.map((comment,index) => <AnswerComment key={index} comment={comment} />)}
					{addComment ?
						<div className=' input-group'>
							<input className='form-control' placeholder='Comment on this answer?'></input>
							<button className='btn btn-outline-secondary'>Submit</button>
						</div>
						:
						<button className='btn btn-light text-primary' onClick={() => setAddComment(true)}>Add Comment</button>
					}


				</div>
			</div>
			<hr></hr>
		</div>
	);



}

function AnswerComment(props) {
	return (
		<div>
			<small>{props.comment} - <span className='text-primary'>Name </span></small>
			<hr className='mb-1'></hr>
		</div>
	);
}


export default Answer;