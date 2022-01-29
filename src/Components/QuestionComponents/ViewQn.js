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
import BookmarkIcon from "@mui/icons-material/Bookmark";


function ViewQn() {

	const { post_id } = useParams();

	const [post_title, set_post_title] = useState("");
	const [fk_user_id, set_fk_user_id] = useState("");
	const [first_name, set_first_name] = useState("");
	const [last_name, set_last_name] = useState("");
	const [post_content, set_post_content] = useState("");
	const [post_created_at, set_post_created_at] = useState(parseTime("2022-01-18 "));

	const [post_accepted_response, set_post_accepted_response] = useState({});
	const [activeIndex, setActiveIndex] = useState();
	const [isRemoved, setIsRemoved] = useState(false);
	const [isAccepted, setIsAccepted] = useState(false);

	const [answers, set_answers] = useState([]);
	const [postComments, set_postComments] = useState([]);

	const [tags, set_tags] = useState(["Subject", "Grade"]);

	const [answer_input, set_answer_input] = useState("");
	const [refreshAnswers, set_refreshAnswers] = useState(false);

	const [addComment, set_AddComment] = useState(false);
	const [postComment, set_postComment] = useState("");

	const [isBookmarked, setIsBookmarked] = useState(false);
	const [bookmarkHover, set_bookmarkHover] = useState(false);

	const [loggedInUser, set_loggedInUser] = useState({});

	const [acquireData, setAcquireData] = useState(false);

	const navigate = useNavigate();

	useEffect(() => acquireUserData(), []);

	useEffect(() => {
		if (!acquireData) {
			return;
		}
		toast.info("Retreiving post...");

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
				set_first_name(data.User.first_name);
				set_last_name(data.User.last_name);

				let tempArr = [];
				tags.map((tag) => tempArr.push(tag));

				tempArr[0] = data.Subforum.subforum_name;
				tempArr[1] = data.Grade.grade_name;
				for (let i = 0; i < data.PostLabels.length; i++) {
					tempArr.push(data.PostLabels[i].Label.label_name);
				}
				set_tags(tempArr);

				for (let i = 0; i < data.SavedPosts.length; i++) {
					var savePostData = data.SavedPosts[i];

					if (savePostData.fk_user_id === loggedInUser.user_id) {
						setIsBookmarked(true);
					}
				}

				var parsedTime = parseTime(data.post_created_at);
				set_post_created_at(parsedTime);

			}).catch(function (error) {
				console.log(error);
			});
	}, [acquireData]);

	useEffect(() => {
		if (!acquireData || Object.keys(post_accepted_response).length === 0) {
			return;
		}

		toast.info("Retreiving answers...");

		axios.get(`http://localhost:8000/responses/${post_id}`)
			.then(function (response) {
				console.log("getting answers in axios");
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

				console.log(post_comments);

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

				console.log(post_accepted_response);

				var acceptedAnswer;
				for (let i = 0; i < post_answers.length; i++) {
					var postAnswer = post_answers[i];

					if (post_accepted_response.answer_is_accepted && post_accepted_response.response_id === postAnswer.response_id) {
						acceptedAnswer = post_answers.splice(i, 1);
						console.log(acceptedAnswer);
					}
				}
				for (let i = 0; i < post_answers.length; i++) {
					if (i == post_answers.length - 1) {
						break;
					}
					if (post_answers[i].response_votes_count < post_answers[i + 1].response_votes_count) {
						var tmp = post_answers[i];
						post_answers[i] = post_answers[i + 1];
						post_answers[i + 1] = tmp;
						i = -1;
					}
				}

				if (acceptedAnswer) {
					post_answers.unshift(acceptedAnswer[0]);
				}



				set_answers(post_answers);
				set_postComments(post_comments);

			});
	}, [refreshAnswers, acquireData, post_accepted_response]);

	useEffect(() => formatAnswers(), [isAccepted]);

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			<div className="container-fluid">
				<div className='container'>
					<div className='row'>
						<div className='col-2 '>
							{/* <button className=' ms-4 mt-3 ps-1 py-2 w-75 btn btn-secondary d-flex align-items-center ' onClick={() => navigate(-1)}>
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
							</button> */}
						</div>
						<div className="col-8 mt-2 mb-1">


							<div className='row mt-3'>
								<div className='col-11'>
									<div className='row'>
										<QnVotes
											key={"vote_" + post_id}
											user_id={fk_user_id}
											post_id={post_id}
										/>
										<div className='col-11'>
											{/* we do input validation for this innerhtml */}
											<div className='col-12 d-flex align-items-center'>

												<h4 className="fw-bold">{post_title}</h4>
												<div className='flex-grow-1'></div>

												<div>
													{
														!(loggedInUser.user_id === fk_user_id) ?
															(isBookmarked ? (
																<button onMouseEnter={() => { set_bookmarkHover(true); }} onMouseLeave={() => { set_bookmarkHover(false); }} onClick={() => { bookmarkPost(); }} className='text-success anim-enter-active'>
																	<BookmarkIcon sx={{ fontSize: 26 }} />
																	{bookmarkHover ? "Bookmarked" : ""}
																</button>
															) : (
																<button onMouseEnter={() => { set_bookmarkHover(true); }} onMouseLeave={() => { set_bookmarkHover(false); }} onClick={() => { bookmarkPost(); }} className='text-secondary anim-enter-active text-nowrap'>
																	<BookmarkBorderIcon sx={{ fontSize: 26 }} />
																	{bookmarkHover ? "Bookmark this question?" : ""}
																</button>
															))
															: ("")
													}

												</div>


											</div>


											<div className='d-flex flex-row align-items-center'>
												<div className='min-profile-pic bg-secondary'>

												</div>
												<small className='ms-2 fw-bold'>
													{first_name} {last_name}
												</small>
												{/* <p className="fw-light text-secondary mx-2">•</p> */}
												<small className="text-secondary mx-2">
													about {post_created_at}
												</small>
											</div>
											<p className='qn-content mt-3' dangerouslySetInnerHTML={{ __html: post_content }}></p>
											<div className='d-flex'>
												{tags.map((tag, index) => <Tag key={index} tag={tag}></Tag>)}
											</div>

											{(postComments.length > 0 ? <hr className='mb-1 hr-color'></hr> : null)}
											{postComments.map((comment, index) => <AnswerComment key={index} comment={comment} />)}
											{addComment ?
												<div className=' input-group'>
													<input onChange={(e) => { set_postComment(e.target.value); }} value={postComment} className='form-control' placeholder='Comment on this answer?'></input>
													<button onClick={submitPostComment} className='btn btn-outline-secondary'>Submit</button>
												</div>
												:
												null
											}
											<div className='row text-primary mt-2'>
												<div className='col-2'>
													<div className='d-inline-block toolbar-btn px-2'>
														<div onClick={() => { set_AddComment(!addComment); }} className='d-flex flex-row align-items-center '>

															<ReplyIcon></ReplyIcon>
															<p className='px-2 mb-0'>Comment</p>
														</div>
													</div>


												</div>
												<div className='col-2 '>
													<div className='d-inline-block toolbar-btn px-2'>
														<div className='d-flex flex-row align-items-center '>

															<ModeCommentIcon></ModeCommentIcon>
															<p className='px-2 mb-0'>Answer</p>
														</div>
													</div>
												</div>
												<div className='col-5'></div>
												<div className='col-3 '>
													{!(loggedInUser.user_id === fk_user_id) ? (
														<div className=' text-secondary d-flex flex-row-reverse align-items-center h-100'>
															<p className='mb-0' style={{ cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#exampleModal">REPORT</p>
														</div>
													) : (
														<div className=' text-secondary d-flex  flex-row-reverse align-items-center h-100'>
															<a href={`http://localhost:3000/posts/editQn/${post_id}`} className=' text-decoration-none mb-0 text-secondary fw-bold'>EDIT</a>
															<button className=' text-decoration-none mb-0 me-3 text-secondary fw-bold'>DELETE</button>
														</div>
													)}
												</div>

											</div>

										</div>


									</div>


								</div>
								<hr className="mt-3"></hr>
								<div className='mt-1'>
									<p className='mb-3'>{answers.length} Answers</p>
									<div>
										{answers.map((answer, index) =>
											<Answer
												refreshAnswers={refreshAnswersFunction}
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
										<div className="col-11">
											<EditorQuill customToolbarId={"editor_toolbar"} contentHTML={answer_input} handleContentChange={set_answer_input}></EditorQuill>
											<button onClick={submitAnswer} className='btn btn-primary my-2'>Post Your Answer</button>
										</div>

									</div>


								</div>
							</div >

						</div >
						<div className='col-2'>
						</div>
					</div >

				</div >
			</div >
		</React.Fragment >
	);

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

				setAcquireData(true);

			})
			.catch((err) => {
				console.log(err);
				window.location.assign("/login");
			});
	}

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}

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


		var token = findCookie("token");
		var answer_content = DOMPurify.sanitize(answer_input);
		var response_type = "answer";


		axios.post("http://localhost:8000/responses/", {
			user_id: loggedInUser.user_id,
			post_id: post_id,
			response_type: response_type,
			response: answer_content
		}, {
			headers: { authorization: "Bearer " + token }
		}).then(function (response) {
			console.log(response);
			set_refreshAnswers(!refreshAnswers);
		}).catch(function (error) {
			console.log(error);
		});

	}

	function submitPostComment() {

		var token = findCookie("token");
		var response_type = "comment";

		axios.post("http://localhost:8000/responses/", {
			user_id: loggedInUser.user_id,
			post_id: post_id,
			response_type: response_type,
			response: postComment
		}, {
			headers: { authorization: "Bearer " + token }
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
					setIsAccepted(true);
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

	function formatAnswers() {
		if (!isAccepted) {
			console.log("Formatting Answers Nope");
			return;
		}

		var answersArray = answers;
		var acceptedAnswer = answersArray.splice(activeIndex, 1);
		answersArray.unshift(acceptedAnswer[0]);
		console.log(acceptedAnswer);
		console.log(answersArray);

		set_answers(answersArray);
		setIsAccepted(false);
	}

	function bookmarkPost() {
		// Temp User ID
		// var user_id = "16f59363-c0a4-406a-ae65-b662c6b070cd";
		var user_id = loggedInUser.user_id;
		var answer_content = DOMPurify.sanitize(answer_input);
		var response_type = "answer";

		if (!isBookmarked) {
			toast.info("Bookmarking Post...");

			axios.post("http://localhost:8000/posts/save", {
				user_id: user_id,
				post_id: post_id,
			}).then(function (response) {
				console.log(response);
				setIsBookmarked(true);
				toast.success("Post Bookmarked!");
			}).catch(function (error) {
				console.log(error);
				toast.error("Error Bookmarking Post");
			});
		} else {
			toast.info("Removing Bookmark...");

			axios.delete("http://localhost:8000/posts/remove", {
				data: {
					user_id: user_id,
					post_id: post_id,
				}
			}).then(function (response) {
				console.log(response);
				setIsBookmarked(false);
				toast.success("Bookmark Removed!");
			}).catch(function (error) {
				console.log(error);
				toast.error("Error Removing Bookmark");
			});
		}
	}

}

export default ViewQn;