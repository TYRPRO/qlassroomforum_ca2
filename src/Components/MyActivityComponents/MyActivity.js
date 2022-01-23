/* eslint-disable no-unused-vars */
// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios"; //npm i axios
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./activity.css";

//Child Imports
import Question from "./MyActivityQuestions";
import Answer from "./MyActivityAnswers";
import SavedQuestion from "./MyActivitySavedQuestions";

//Component Creation
const MyActivity = () => {

	const baseUrl = ["https://readdit-backend.herokuapp.com", "https://readdit-sp.herokuapp.com"];

	// State Creation

	// const [updatesreceived, setUpdatesReceived] = useState(0);
	// const [answersposted, setAnswersPosted] = useState(0);
	// const [answersaccepted, setAnswersAccepted] = useState(0);
	// const [upvotesgiven, setUpvotesGiven] = useState(0);

	const [tabselected, setTabSelected] = useState("questions");

	const [questions, setQuestions] = useState([]);
	const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
	const [questionToDisplay, setQuestionToDisplay] = useState([]);
	const [questionTotalPages, setQuestionTotalPages] = useState(0);
	const [questionCurrentPage, setQuestionCurrentPage] = useState(0);

	const [answers, setAnswers] = useState([]);
	const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
	const [answersToDisplay, setAnswersToDisplay] = useState([]);
	const [answerTotalPages, setAnswerTotalPages] = useState(0);
	const [answerCurrentPage, setAnswerCurrentPage] = useState(0);

	const [savedquestions, setSavedQuestions] = useState([]);
	const [isLoadingSavedQuestions, setIsLoadingSavedQuestions] = useState(true);
	const [savedQuestionToDisplay, setSavedQuestionToDisplay] = useState([]);
	const [savedQuestionTotalPages, setSavedQuestionTotalPages] = useState(0);
	const [savedQuestionCurrentPage, setSavedQuestionCurrentPage] = useState(0);

	//login info
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [user_id, setUserID] = useState(0);
	const [role, setRole] = useState("");
	const [acquireData, setAcquireData] = useState(false);

	// function getUpdatesReceived() { }

	// function getAnswersPosted() { }

	// function getAnswersAccepted() { }

	// function getUpvotesGiven() { }

	// Login Functions
	function acquireUserData() {
		var token = findCookie("token");

		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				var data = response.data;
				setFirstname(data.first_name);
				setLastname(data.last_name);
				setUserID(data.user_id);
				setRole(data.roles);

				setAcquireData(true);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				console.log(err.response.data.message);
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

	// Retrieve Tab Content Functions

	function handleTabSelection(tab) {
		console.log("Tab Selected: " + tab);
		if (tab == "questions") {
			document.getElementById(tab).classList.add("active");
			document.getElementById("answers").classList.remove("active");
			document.getElementById("savedquestions").classList.remove("active");

		} else if (tab == "answers") {
			document.getElementById(tab).classList.add("active");
			document.getElementById("questions").classList.remove("active");
			document.getElementById("savedquestions").classList.remove("active");
		} else {
			document.getElementById(tab).classList.add("active");
			document.getElementById("questions").classList.remove("active");
			document.getElementById("answers").classList.remove("active");
		}
		setTabSelected(tab);
	}

	function getQuestions() {
		if (!acquireData) {
			return;
		}
		toast.info("Retrieving Questions...");

		axios.get("http://localhost:8000/posts/user/16f59363-c0a4-406a-ae65-b662c6b070cd")
			.then((data) => {
				console.log(data.data);
				var questions = data.data;
				var questionDetails = [];
				var totalQuestions = Math.ceil(questions.length / 4);
				var dispQuestions = [];

				for (let i = 0; i < questions.length; i++) {
					var post = questions[i];

					// Calculates Time
					var date = new Date(post.post_created_at);
					var date_now = new Date();

					var seconds_between_dates = Math.floor((date_now - date) / 1000);
					var minutes_between_dates = Math.floor((date_now - date) / (60 * 1000));
					var hours_between_dates = Math.floor((date_now - date) / (60 * 60 * 1000));
					var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000));
					var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000));

					var post_date_output;
					if (seconds_between_dates < 60) {
						post_date_output = `${seconds_between_dates} seconds ago`;
					} else if (minutes_between_dates < 60) {
						post_date_output = `${minutes_between_dates} minutes ago`;
					}
					else if (hours_between_dates < 24) {
						post_date_output = `${hours_between_dates} hours ago`;
					} else if (days_between_dates <= 7) {
						if (days_between_dates == 1) {
							post_date_output = `${days_between_dates} day ago`;
						} else {
							post_date_output = `${days_between_dates} days ago`;
						}
					} else {
						post_date_output = `${weeks_between_dates} weeks ago`;
					}

					questionDetails.push({
						post_id: `post_${post.post_id}_${post.Subforum.subforum_name}`,
						question_id: post.post_id,
						post_href: `/r/${post.Subforum.subforum_name}`,
						post_subforumName: post.Subforum.subforum_name,
						post_votes: post.post_rating,
						post_username: post.User.first_name,
						post_date: post_date_output,
						post_title: post.post_title
					});

				}

				for (let i = 0; i < 4; i++) {
					if (questionDetails[i] != undefined) {
						dispQuestions.push(questionDetails[i]);
					}
				}

				console.log(dispQuestions);
				setQuestions(questionDetails);
				setQuestionToDisplay(dispQuestions);
				setQuestionTotalPages(totalQuestions);
				setIsLoadingQuestions(false);

				toast.success("Questions Successfully Loaded");
			})
			.catch((err) => {
				console.log(err);
				toast.error("Error Retrieving Questions");
			});
	}

	function getAnswers() {
		if (!acquireData) {
			return;
		}
		toast.info("Retrieving Answers...");

		axios.get("http://localhost:8000/answers/user/16f59363-c0a4-406a-ae65-b662c6b070cd")
			.then((data) => {
				console.log(data.data);
				var answers = data.data;
				var answerDetails = [];
				var totalAnswers = Math.ceil(answers.length / 5);
				var dispAnswers = [];

				for (let i = 0; i < answers.length; i++) {
					var comment = answers[i];
					var post_shortTitle = "";

					if (comment.Post.post_title.length > 30) {
						post_shortTitle = comment.Post.post_title.substring(0, 30) + "...";
					}

					answerDetails.push({
						answer_id: i,
						answer_username: comment.User.first_name,
						answer_post_username: comment.User.first_name,
						answer_title: comment.Post.post_title,
						answer_post_shortTitle: post_shortTitle,
						answer_value: comment.response
					});
				}

				for (let i = 0; i < 5; i++) {
					if (answerDetails[i] != undefined) {
						dispAnswers.push(answerDetails[i]);
					}
				}

				setAnswers(answerDetails);
				setAnswersToDisplay(dispAnswers);
				setAnswerTotalPages(totalAnswers);
				setIsLoadingAnswers(false);

				toast.success("Answers Successfully Loaded");
			})
			.catch((err) => {
				console.log(err);
				toast.error("Error Retrieving Answers");
			});
	}

	function getSavedQuestions() {
		if (!acquireData) {
			return;
		}
		toast.info("Retrieving Saved Questions...");

		axios.get("http://localhost:8000/posts/save/user/16f59363-c0a4-406a-ae65-b662c6b070cd")
			.then((data) => {
				console.log(data.data);
				var savedQuestions = data.data;
				var savedQuestionDetails = [];
				var totalSavedQuestions = Math.ceil(savedQuestions.length / 4);
				var dispSavedQuestions = [];

				for (let i = 0; i < savedQuestions.length; i++) {
					var post = savedQuestions[i];

					// Calculates Time
					var date = new Date(post.post_created_at);
					var date_now = new Date();

					var seconds_between_dates = Math.floor((date_now - date) / 1000);
					var minutes_between_dates = Math.floor((date_now - date) / (60 * 1000));
					var hours_between_dates = Math.floor((date_now - date) / (60 * 60 * 1000));
					var days_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 1000));
					var weeks_between_dates = Math.floor((date_now - date) / (60 * 60 * 24 * 7 * 1000));

					var post_date_output;
					if (seconds_between_dates < 60) {
						post_date_output = `${seconds_between_dates} seconds ago`;
					} else if (minutes_between_dates < 60) {
						post_date_output = `${minutes_between_dates} minutes ago`;
					}
					else if (hours_between_dates < 24) {
						post_date_output = `${hours_between_dates} hours ago`;
					} else if (days_between_dates <= 7) {
						if (days_between_dates == 1) {
							post_date_output = `${days_between_dates} day ago`;
						} else {
							post_date_output = `${days_between_dates} days ago`;
						}
					} else {
						post_date_output = `${weeks_between_dates} weeks ago`;
					}

					savedQuestionDetails.push({
						post_id: `post_${post.post_id}`,
						question_id: post.post_id,
						post_votes: post.post_rating,
						post_href: `/r/${post.Subforum.subforum_name}`,
						post_subforumName: post.Subforum.subforum_name,
						post_username: post.User.first_name,
						post_date: post_date_output,
						post_title: post.post_title,
						post_bookmarkId: `post_bookmark_${post.post_id}`
					});
				}

				for (let i = 0; i < 4; i++) {
					if (savedQuestionDetails[i] != undefined) {
						dispSavedQuestions.push(savedQuestionDetails[i]);
					}
				}

				setSavedQuestions(savedQuestionDetails);
				setSavedQuestionToDisplay(dispSavedQuestions);
				setSavedQuestionTotalPages(totalSavedQuestions);
				setIsLoadingSavedQuestions(false);

				toast.success("Saved Questions Successfully Loaded");
			})
			.catch((err) => {
				console.log(err);
				toast.error("Error Retrieving Saved Questions");
			});
	}

	// Pagination Functions

	function getDisplayQuestions() {

		if (tabselected == "questions") {
			var dispQuestions = [];

			for (let i = 0; i < 4; i++) {
				if (questions[i + (questionCurrentPage * 4)] != undefined) {
					dispQuestions.push(questions[i + (questionCurrentPage * 4)]);
				}
			}

			setQuestionToDisplay(dispQuestions);

		} else if (tabselected == "answers") {
			var dispAnswers = [];

			for (let i = 0; i < 5; i++) {
				if (answers[i + (answerCurrentPage * 5)] != undefined) {
					dispAnswers.push(answers[i + (answerCurrentPage * 5)]);
				}
			}

			setAnswersToDisplay(dispAnswers);
		} else {
			var dispSavedQuestions = [];

			for (let i = 0; i < 4; i++) {
				if (savedquestions[i + (savedQuestionCurrentPage * 4)] != undefined) {
					dispSavedQuestions.push(savedquestions[i + (savedQuestionCurrentPage * 4)]);
				}
			}

			setSavedQuestionToDisplay(dispSavedQuestions);
		}
	}

	function handlePageNext() {
		console.log("Next Page");
		if (tabselected == "questions") {
			if (questionCurrentPage + 1 < questionTotalPages) {
				setQuestionCurrentPage(questionCurrentPage + 1);
			}

		} else if (tabselected == "answers") {
			if (answerCurrentPage + 1 < answerTotalPages) {
				setAnswerCurrentPage(answerCurrentPage + 1);
			}
		} else {
			if (savedQuestionCurrentPage + 1 < savedQuestionTotalPages) {
				setSavedQuestionCurrentPage(savedQuestionCurrentPage + 1);
			}
		}

	}

	function handlePagePrevious() {
		console.log("Previous Page");
		if (tabselected == "questions") {
			if (questionCurrentPage > 0) {
				setQuestionCurrentPage(questionCurrentPage - 1);
			}

		} else if (tabselected == "answers") {
			if (answerCurrentPage > 0) {
				setAnswerCurrentPage(answerCurrentPage - 1);
			}
		} else {
			if (savedQuestionCurrentPage > 0) {
				setSavedQuestionCurrentPage(savedQuestionCurrentPage - 1);
			}
		}
	}

	// Retrieves Page Content

	useEffect(() => acquireUserData(), []);

	useEffect(() => {
		getQuestions();
		getAnswers();
		getSavedQuestions();
		console.log(baseUrl[0]);
	}, [acquireData]);

	// Changes Content Based on Tab Selected And Page Number

	useEffect(() => {
		getDisplayQuestions();
	}, [questionCurrentPage, answerCurrentPage, savedQuestionCurrentPage]);

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			<div className="d-flex flex-row flex-grow-1 justify-content-center" id="myactivity">
				<div className="flex-fill d-flex flex-row flex-wrap">
					<div className="ms-lg-0 mt-4 ms-5 w-25 me-5 d-flex flex-column flex-grow-1 flex-lg-grow-0">
						<div>
							<h2>My Activity</h2>
							<hr />
						</div>
						<div className="d-flex flex-row flex-lg-column">
							<div className="flex-grow-1">
								<div className="py-2">
									<h5>{0}</h5>
									<p>updates received</p>
								</div>
								<div className="py-2">
									<h5>{0}</h5>
									<p>answers posted</p>
								</div>
							</div>
							<div className="flex-grow-1">
								<div className="py-2">
									<h5>{0}</h5>
									<p>answers accepted</p>
								</div>
								<div className="py-2">
									<h5>{0}</h5>
									<p>upvotes given</p>
								</div>
							</div>
						</div>
					</div>
					<div className="flex-grow-1 mt-5">
						<ul id="tabs" className="nav nav-tabs d-flex">
							<div className="active mx-xl-4 mx-3" id="questions">
								<button href="#home" className="p-2 py-3" onClick={() => handleTabSelection("questions")}>MY QUESTIONS</button>
							</div>
							<div className="mx-xl-4 mx-3 text-center" id="answers">
								<button href="#menu1" className="p-2 py-3" onClick={() => handleTabSelection("answers")}>MY ANSWERS</button>
							</div>
							<div className="mx-xl-4 mx-3 text-center" id="savedquestions">
								<button href="#menu2" className="p-2 py-3" onClick={() => handleTabSelection("savedquestions")}>SAVED QUESTIONS</button>
							</div>
						</ul>

						<div className="tab-content mt-3">
							{!isLoadingAnswers && tabselected == "answers" ? (
								answersToDisplay.length > 0 ? (
									answersToDisplay.map((data) => (
										<Answer
											key={data.answer_id}
											username={data.answer_username}
											post_username={data.answer_post_username}
											title={data.answer_title}
											shortTitle={data.answer_post_shortTitle}
											value={data.answer_value}
										/>
									))
								) : (
									<div className="text-center">No Answers At The Moment</div>
								)
							) : !isLoadingSavedQuestions && tabselected == "savedquestions" ? (
								savedQuestionToDisplay.length > 0 ? (
									savedQuestionToDisplay.map((data) => (
										<SavedQuestion
											key={data.question_id}
											id={data.post_id}
											post_href={data.post_href}
											subforumName={data.post_subforumName}
											votes={data.post_votes}
											username={data.post_username}
											date={data.post_date}
											title={data.post_title}
											bookmark={data.post_bookmarkId}
										/>
									))
								) : (
									<div className="text-center">No Saved Questions At The Moment</div>
								)
							) : !isLoadingQuestions && (
								questionToDisplay.length > 0 ? (
									questionToDisplay.map((data) => (
										<Question
											key={data.question_id}
											id={data.post_id}
											post_href={data.post_href}
											subforumName={data.post_subforumName}
											votes={data.post_votes}
											username={data.post_username}
											date={data.post_date}
											title={data.post_title}
										/>
									))
								) : (
									<div className="text-center">No Questions At The Moment</div>
								)
							)
							}
						</div>

						<div id="pagination" className="w-100 my-3 row">
							<div className="col-3 text-center">
								<button className="mx-auto my-2" onClick={() => handlePagePrevious()}><i className='fas fa-arrow-left me-2'></i>BACK</button>
							</div>
							<div id="paginationNum" className="col-6 text-center">
								{!isLoadingAnswers && tabselected == "answers" ? (
									answersToDisplay.length > 0 ? (
										<p className="mx-auto my-2 text-dark">{answerCurrentPage + 1} of {answerTotalPages}</p>
									) : (
										<p className="mx-auto my-2 text-dark"></p>
									)

								) : !isLoadingSavedQuestions && tabselected == "savedquestions" ? (
									savedQuestionToDisplay.length > 0 ? (
										<p className="mx-auto my-2 text-dark">{savedQuestionCurrentPage + 1} of {savedQuestionTotalPages}</p>
									) : (
										<p className="mx-auto my-2 text-dark"></p>
									)

								) : !isLoadingQuestions && (
									questionToDisplay.length > 0 ? (
										<p className="mx-auto my-2 text-dark">{questionCurrentPage + 1} of {questionTotalPages}</p>
									) : (
										<p className="mx-auto my-2 text-dark"></p>
									)
								)
								}
							</div>
							<div className="col-3 text-center">
								<button className="mx-auto my-2" onClick={() => handlePageNext()}>NEXT<i className='fas fa-arrow-right ms-2'></i></button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default MyActivity;