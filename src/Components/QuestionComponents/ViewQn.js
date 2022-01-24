/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import "./viewQn/viewQn.css";

import parseTime from "../../helperFunctions/parseTime";
import Answer from "./viewQn/Answer.js";
import AnswerComment from "./viewQn/AnswerComments";
import Editor from "./Editor.js";
import QnVotes from "./QnVotes";
import EditorQuill from "./EditorQuill_FORUM/EditorQuill";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";


function ViewQn() {

	const { post_id } = useParams();

	const [post_title, set_post_title] = useState("");
	const [fk_user_id, set_fk_user_id] = useState("");
	const [first_name, set_first_name] = useState("");
	const [post_content, set_post_content] = useState("");
	const [post_created_at, set_post_created_at] = useState(parseTime("2022-01-18 "));
	const [post_accepted_response, set_post_accepted_response] = useState({ answer_is_accepted: false, response_id: 0 });
	const [activeIndex, setActiveIndex] = useState();
	const [isRemoved, setIsRemoved] = useState(false);


	const [answers, set_answers] = useState([]);
	const [postComments, set_postComments] = useState([]);

	const [tags, set_tags] = useState(["Subject", "Grade"]);

	const [answer_input, set_answer_input] = useState("");
	const [refreshAnswers, set_refreshAnswers] = useState(false);

	const [addComment, set_AddComment] = useState(false);
	const [postComment, set_postComment] = useState("");

	const [bookmarkHover, set_bookmarkHover] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		axios.get(`http://localhost:8000/posts/${post_id}`)
			.then(function (response) {
				var data = response.data;
				console.log(data);
				set_post_title(data.post_title);
				set_fk_user_id(data.fk_user_id);
				set_post_content(data.post_content);
				set_post_accepted_response({
					answer_is_accepted: data.post_is_answered,
					response_id: data.fk_response_id
				});
				set_first_name(data.User.last_name);

				let tempArr = [];
				tags.map((tag) => tempArr.push(tag));
				for (let i = 0; i < data.PostLabels.length; i++) {
					tempArr.push(data.PostLabels[i].Label.label_name);
				}
				set_tags(tempArr);

				var parsedTime = parseTime(data.post_created_at);
				set_post_created_at(parsedTime);

			}).catch(function (error) {
				console.log(error);
			});
	}, []);

	useEffect(() => {
		axios.get(`http://localhost:8000/responses/${post_id}`).then(function (response) {
			var data = response.data;
			console.log(data);
			var post_answers = [];
			var post_comments = [];
			var post_answer_comments = [];

			for (var i = 0; i < data.length; i++) {

				if (data[i].ResponseType.response_type === "answer") {
					post_answers.push(data[i]);
					continue;
				}
				else if (data[i].parent_response_id != null) {
					post_answer_comments.push(data[i]);
				}
				else {
					post_comments.push(data[i]);
				}
			}

			for (let i = 0; i < post_answer_comments.length; i++) {
				for (let j = 0; j < post_answers.length; j++) {
					if (post_answers[j].response_id === post_answer_comments[i].parent_response_id) {
						if (post_answers[j].comments == null) {
							post_answers[j].comments = [];
						}
						post_answers[j].comments.push(post_answer_comments[i]);
						break;
					}
				}
			}

			set_answers(post_answers);
			set_postComments(post_comments);

		});
	}, [refreshAnswers]);
	// useEffect(() => {
	// 	axios.get(`http://localhost:8000/answers/posts/${post_id}`)
	// 		.then(function (response) {
	// 			var data = response.data
	// 			set_answers(data);
	// 		}).catch(function (error) {
	// 			console.log(error);
	// 		})
	// }, [refreshAnswers])



	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			<div className="container-fluid">
				<div className='container'>
					<div className='row'>
						<div className='col-2  border-end'>
							<button className=' ms-4 mt-3 ps-1 py-2 w-75 btn btn-secondary d-flex align-items-center ' onClick={() => navigate(-1)}>
								<ArrowBackIosNewIcon sx={{ fontSize: 23 }} />
								<p className='mb-0 ms-4 align-middle'>Back</p>
							</button>
							<button className='ms-4 mt-3 ps-1  py-2 w-75 btn btn-secondary d-flex align-items-center ' onClick={() => navigate(-1)}>
								<EditIcon sx={{ fontSize: 23 }} />
								<p className='mb-0 ms-4 align-middle'>Edit</p>
							</button>
							<button className='ms-4 mt-3 ps-1 py-2 w-75 btn btn-secondary d-flex align-items-center ' onClick={() => navigate(-1)}>
								<DeleteIcon sx={{ fontSize: 23 }} />
								<p className='mb-0 ms-4 align-middle'>Delete</p>
							</button>
						</div>
						<div className="col-10 mt-2 mb-1">


							<div className='row mt-3'>
								<div className='col-9'>
									<div className='row'>
										<QnVotes
											key={"vote_" + post_id}
											user_id={fk_user_id}
											post_id={post_id}
										/>
										<div className='col-11'>
											{/* No worries, we do input validation for this innerhtml */}
											<div className='col-12 d-flex align-items-center'>

												<h1>{post_title}</h1>
												<div className='flex-grow-1'></div>

												<div>
													<button onMouseEnter={() => { set_bookmarkHover(true); }} onMouseLeave={() => { set_bookmarkHover(false); }} className='text-secondary anim-enter-active'>
														<BookmarkBorderIcon sx={{ fontSize: 26 }} />
														{bookmarkHover ? "Bookmark this question?" : ""}
													</button>
												</div>


											</div>


											<div className='d-flex flex-row'>
												<div className='min-profile-pic bg-secondary'>

												</div>
												<p className='ms-2'>
													{first_name}
												</p>
												<p className="fw-light text-secondary mx-2">•</p>
												<p>
													{post_created_at}
												</p>
											</div>
										</div>
										<p className='qn-content mt-3' dangerouslySetInnerHTML={{ __html: post_content }}></p>
										<div className='d-flex'>
											{tags.map((tag, index) => <Tag key={index} tag={tag}></Tag>)}
										</div>
										<div className='row text-primary'>
											<div className='col-3'>
												<div className='d-inline-block toolbar-btn px-2'>
													<div onClick={() => { set_AddComment(!addComment); }} className='d-flex flex-row align-items-center '>

														<ReplyIcon></ReplyIcon>
														<p className='px-2 py-2 mb-0'>Comment</p>
													</div>
												</div>


											</div>
											<div className='col-3 '>
												<div className='d-inline-block toolbar-btn px-2'>
													<div className='d-flex flex-row align-items-center '>

														<ModeCommentIcon></ModeCommentIcon>
														<p className='px-2 py-2 mb-0'>Answer</p>
													</div>
												</div>
											</div>
											<div className='col-3'></div>
											<div className='col-3 '>
												{/* <div className='container p-1 postedBySection rounded'>
													<small className='mb-0 text-secondary'>Posted by</small>
													<div className=' row g-0'>
														<div className='col-3 py-1'>
															<div className='min-profile-pic bg-secondary'>

															</div>
														</div>
														<div className='col-9'>
															<p className='mb-0'>Name</p>
															<p className='mb-0'>Points ###</p>
														</div>
													</div>
												</div> */}
												<div className=' text-secondary d-flex flex-row align-items-center h-100'>
													<p className='mb-0'>Edit</p>
													<p className='mb-0 ms-3'>Delete</p>
												</div>

											</div>

										</div>
										{(postComments.length > 0 ? <hr className='mb-1'></hr> : null)}
										{postComments.map((comment, index) => <AnswerComment key={index} comment={comment} />)}
										{addComment ?
											<div className=' input-group'>
												<input onChange={(e) => { set_postComment(e.target.value); }} value={postComment} className='form-control' placeholder='Comment on this answer?'></input>
												<button onClick={submitPostComment} className='btn btn-outline-secondary'>Submit</button>
											</div>
											:
											null
										}
									</div>
									{(postComments.length > 0 ? <hr className='mb-1'></hr> : null)}
									{postComments.map((comment, index) => <AnswerComment key={index} comment={comment} />)}
									{addComment ?
										<div className=' input-group'>
											<input onChange={(e) => { set_postComment(e.target.value); }} value={postComment} className='form-control' placeholder='Comment on this answer?'></input>
											<button onClick={submitPostComment} className='btn btn-outline-secondary'>Submit</button>
										</div>
										:
										null
									}
								</div>
							</div >
							<hr></hr>
							<div className='mt-1'>
								<p className='mb-3'>{answers.length} Answers</p>
								<div>
									{answers.map((answer, index) =>
										<Answer
											refreshAnswers={refreshAnswersFunction}
											isAccepted={activeIndex === index}
											isRemoved={isRemoved}
											isAlrdAccepted={post_accepted_response.answer_is_accepted && post_accepted_response.response_id === answer.response_id ? true : false}
											key={index}
											answer={answer}
											index={index}
											setAsAcceptedAnswer={setAsAcceptedAnswer}
										/>)}
								</div>
								<div>
									<p>Your Answer</p>
									<EditorQuill customToolbarId={"editor_toolbar"} contentHTML={answer_input} handleContentChange={set_answer_input}></EditorQuill>
									<button onClick={submitAnswer} className='btn btn-primary my-2'>Post Your Answer</button>
								</div>


							</div>
							<div className='col-3'>
								<div className=' container'>
									WIP
								</div>
							</div>
						</div >

					</div >

				</div >
			</div >
		</React.Fragment >
	);

	function refreshAnswersFunction() {
		set_refreshAnswers(!refreshAnswers);
	}

	function Tag(props) {
		return (
			<div>
				<small className="d-flex tag-name me-2 my-1 py-1 rounded" >
					<p className=' mb-0 px-2 d-inline text-nowrap'>{props.tag}</p>
				</small>
			</div>
		);
	}

	function submitAnswer() {

		// Temp User ID
		var user_id = "16f59363-c0a4-406a-ae65-b662c6b070cd";
		var answer_content = DOMPurify.sanitize(answer_input);
		var response_type = "answer";


		axios.post("http://localhost:8000/responses/", {
			user_id: user_id,
			post_id: post_id,
			response_type: response_type,
			response: answer_content
		}).then(function (response) {
			console.log(response);
			set_refreshAnswers(!refreshAnswers);
		}).catch(function (error) {
			console.log(error);
		});

	}

	function submitPostComment() {
		// Temp User ID
		var user_id = "16f59363-c0a4-406a-ae65-b662c6b070cd";
		var response_type = "comment";

		axios.post("http://localhost:8000/responses/", {
			user_id: user_id,
			post_id: post_id,
			response_type: response_type,
			response: postComment
		}).then(function (response) {
			console.log(response);
			refreshAnswersFunction();
		}).catch(function (error) {
			console.log(error);
		});
	}

	function setAsAcceptedAnswer(index, response_id, post_id) {
		toast.info("Setting as Accepted Answer...");

		if (!(post_accepted_response.response_id === response_id)) {
			axios.put("http://localhost:8000/posts/correctAnswer",
				{
					answer_id: response_id,
					post_id: post_id
				})
				.then(res => {
					console.log(res.data);
					setActiveIndex(index);
					setIsRemoved(false);
					set_post_accepted_response({ answer_is_accepted: true, response_id: response_id });
					toast.success("Answer Accepted!");
				})
				.catch((err) => {
					console.log(err);
					toast.error("Error Setting Answer as Correct Answer");
				});
		} else {
			console.log("Already Accepted");
			toast.error("Answer Already Accepted!");
		}
	}

}

export default ViewQn;