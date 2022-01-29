/* eslint-disable no-unused-vars */
// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios"; //npm i axios
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../store/actions/Common";
import {
	populateDispQuestions,
	setQuestionsCurrentPage,
	populateDispAnswers,
	setAnswersCurrentPage,
	populateDispSavedQuestions,
	setSavedQuestionsCurrentPage,
	handleTabsSelection,
	getUpdatesReceived,
	getAnswersAccepted,
	getUpvotesGiven,
	getQuestions,
	getAnswers,
	getSavedQuestions
} from "../../store/actions/MyActivity";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./activity.css";

//Child Imports
import Question from "./MyActivityQuestions";
import Answer from "./MyActivityAnswers";
// import SavedQuestion from "./MyActivitySavedQuestions";

//Component Creation
const MyActivity = () => {

	// State Creation
	const updatesReceived = useSelector((state) => state.MyActivity.updatesReceived);
	const answersPosted = useSelector((state) => state.MyActivity.answersPosted);
	const answersAccepted = useSelector((state) => state.MyActivity.answersAccepted);
	const upvotesGiven = useSelector((state) => state.MyActivity.upvotesGiven);

	const tabselected = useSelector((state) => state.MyActivity.tabSelected);

	const questions = useSelector((state) => state.MyActivity.questions);
	const isLoadingQuestions = useSelector((state) => state.MyActivity.isLoadingQuestions);
	const questionToDisplay = useSelector((state) => state.MyActivity.questionToDisplay);
	const questionTotalPages = useSelector((state) => state.MyActivity.questionTotalPages);
	const questionCurrentPage = useSelector((state) => state.MyActivity.questionCurrentPage);

	const answers = useSelector((state) => state.MyActivity.answers);
	const isLoadingAnswers = useSelector((state) => state.MyActivity.isLoadingAnswers);
	const answerToDisplay = useSelector((state) => state.MyActivity.answerToDisplay);
	const answerTotalPages = useSelector((state) => state.MyActivity.answerTotalPages);
	const answerCurrentPage = useSelector((state) => state.MyActivity.answerCurrentPage);

	const savedquestions = useSelector((state) => state.MyActivity.savedquestions);
	const isLoadingSavedQuestions = useSelector((state) => state.MyActivity.isLoadingSavedQuestions);
	const savedquestionToDisplay = useSelector((state) => state.MyActivity.savedquestionToDisplay);
	const savedquestionTotalPages = useSelector((state) => state.MyActivity.savedquestionTotalPages);
	const savedquestionCurrentPage = useSelector((state) => state.MyActivity.savedquestionCurrentPage);

	//login info
	const acquireData = useSelector((state) => state.Common.acquireData);
	const userDetails = useSelector((state) => state.Common.userDetails);
	const dispatch = useDispatch();

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
		dispatch(handleTabsSelection(tab));
	}

	function getDisplayQuestions() {

		if (tabselected == "questions") {
			var dispQuestions = [];

			for (let i = 0; i < 4; i++) {
				if (questions[i + (questionCurrentPage * 4)] != undefined) {
					dispQuestions.push(questions[i + (questionCurrentPage * 4)]);
				}
			}

			dispatch(populateDispQuestions(dispQuestions));

		} else if (tabselected == "answers") {
			var dispAnswers = [];

			for (let i = 0; i < 5; i++) {
				if (answers[i + (answerCurrentPage * 5)] != undefined) {
					dispAnswers.push(answers[i + (answerCurrentPage * 5)]);
				}
			}

			dispatch(populateDispAnswers(dispAnswers));
		} else {
			var dispSavedQuestions = [];

			for (let i = 0; i < 4; i++) {
				if (savedquestions[i + (savedquestionCurrentPage * 4)] != undefined) {
					dispSavedQuestions.push(savedquestions[i + (savedquestionCurrentPage * 4)]);
				}
			}

			dispatch(populateDispSavedQuestions(dispSavedQuestions));
		}
	}

	function handlePageNext() {
		console.log("Next Page");
		if (tabselected == "questions") {
			if (questionCurrentPage + 1 < questionTotalPages) {
				dispatch(setQuestionsCurrentPage(questionCurrentPage + 1));
			}

		} else if (tabselected == "answers") {
			if (answerCurrentPage + 1 < answerTotalPages) {
				dispatch(setAnswersCurrentPage(answerCurrentPage + 1));
			}
		} else {
			if (savedquestionCurrentPage + 1 < savedquestionTotalPages) {
				dispatch(setSavedQuestionsCurrentPage(savedquestionCurrentPage + 1));
			}
		}

	}

	function handlePagePrevious() {
		console.log("Previous Page");
		if (tabselected == "questions") {
			if (questionCurrentPage > 0) {
				dispatch(setQuestionsCurrentPage(questionCurrentPage - 1));
			}

		} else if (tabselected == "answers") {
			if (answerCurrentPage > 0) {
				dispatch(setAnswersCurrentPage(answerCurrentPage - 1));
			}
		} else {
			if (savedquestionCurrentPage > 0) {
				dispatch(setSavedQuestionsCurrentPage(savedquestionCurrentPage - 1));
			}
		}
	}

	// Retrieves Page Content

	useEffect(() => getUserDetails(dispatch), []);

	useEffect(() => {
		getQuestions(dispatch, toast, userDetails.user_id, acquireData);
		getAnswers(dispatch, toast, userDetails.user_id, acquireData);
		getSavedQuestions(dispatch, toast, userDetails.user_id, acquireData);
		getUpdatesReceived(dispatch, userDetails.user_id, acquireData);
		getAnswersAccepted(dispatch, userDetails.user_id, acquireData);
		getUpvotesGiven(dispatch, userDetails.user_id, acquireData);
	}, [acquireData]);

	// Changes Content Based on Tab Selected And Page Number

	useEffect(() => {
		getDisplayQuestions();
	}, [questionCurrentPage, answerCurrentPage, savedquestionCurrentPage]);

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
									<h5>{updatesReceived}</h5>
									<p>updates received</p>
								</div>
								<div className="py-2">
									<h5>{answersPosted}</h5>
									<p>answers posted</p>
								</div>
							</div>
							<div className="flex-grow-1">
								<div className="py-2">
									<h5>{answersAccepted}</h5>
									<p>answers accepted</p>
								</div>
								<div className="py-2">
									<h5>{upvotesGiven}</h5>
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
								answerToDisplay.length > 0 ? (
									answerToDisplay.map((data) => (
										<Answer
											key={data.answer_id}
											post_id={data.post_id}
											username={data.answer_username}
											post_username={data.answer_post_username}
											title={data.answer_title}
											shortTitle={data.answer_post_shortTitle}
											value={data.answer_value}
											shortValue={data.answer_shortValue}
										/>
									))
								) : (
									<div className="text-center">No Answers At The Moment</div>
								)
							) : !isLoadingSavedQuestions && tabselected == "savedquestions" ? (
								savedquestionToDisplay.length > 0 ? (
									savedquestionToDisplay.map((data) => (
										<Question
											key={data.question_id}
											id={data.post_id}
											votes={data.post_votes}
											date={data.post_date}
											title={data.post_title}
											shortTitle={data.post_shortTitle}
											answerCount={data.post_answerCount}
											commentCount={data.post_commentCount}
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
											votes={data.post_votes}
											date={data.post_date}
											title={data.post_title}
											shortTitle={data.post_shortTitle}
											answerCount={data.post_answerCount}
											commentCount={data.post_commentCount}
											user_id={data.post_user_id}
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
									answerToDisplay.length > 0 ? (
										<p className="mx-auto my-2 text-dark">{answerCurrentPage + 1} of {answerTotalPages}</p>
									) : (
										<p className="mx-auto my-2 text-dark"></p>
									)

								) : !isLoadingSavedQuestions && tabselected == "savedquestions" ? (
									savedquestionToDisplay.length > 0 ? (
										<p className="mx-auto my-2 text-dark">{savedquestionCurrentPage + 1} of {savedquestionTotalPages}</p>
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