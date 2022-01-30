import axios from "axios";

// My Activity Statistics
export const setUpdatesReceived = (updatesReceived) => {
	return {
		type: "GET_UPDATES_RECEIVED",
		updatesReceived,
	};
};

export const setAnswersPosted = (answersPosted) => {
	return {
		type: "GET_ANSWERS_POSTED",
		answersPosted,
	};
};

export const setAnswersAccepted = (answersAccepted) => {
	return {
		type: "GET_ANSWERS_ACCEPTED",
		answersAccepted,
	};
};

export const setUpvotesGiven = (upvotesGiven) => {
	return {
		type: "GET_UPVOTES_GIVEN",
		upvotesGiven,
	};
};

// Questions
export const populateQuestions = (questions) => {
	return {
		type: "GET_QUESTIONS",
		questions,
	};
};

export const populateDispQuestions = (questionToDisplay) => {
	return {
		type: "GET_QUESTIONS_TO_DISPLAY",
		questionToDisplay,
	};
};

export const setQuestionsTotalPages = (questionTotalPages) => {
	return {
		type: "GET_QUESTIONS_TOTAL_PAGES",
		questionTotalPages,
	};
};

export const setQuestionsCurrentPage = (questionCurrentPage) => {
	return {
		type: "GET_QUESTIONS_CURRENT_PAGE",
		questionCurrentPage,
	};
};

export const setLoadingQuestions = (isLoadingQuestions) => {
	return {
		type: "SET_QUESTIONS_LOADING",
		isLoadingQuestions,
	};
};

// Answers
export const populateAnswers = (answers) => {
	return {
		type: "GET_ANSWERS",
		answers,
	};
};

export const populateDispAnswers = (answerToDisplay) => {
	return {
		type: "GET_ANSWERS_TO_DISPLAY",
		answerToDisplay,
	};
};

export const setAnswersTotalPages = (answerTotalPages) => {
	return {
		type: "GET_ANSWERS_TOTAL_PAGES",
		answerTotalPages,
	};
};

export const setAnswersCurrentPage = (answerCurrentPage) => {
	return {
		type: "GET_ANSWERS_CURRENT_PAGE",
		answerCurrentPage,
	};
};

export const setLoadingAnswers = (isLoadingAnswers) => {
	return {
		type: "SET_ANSWERS_LOADING",
		isLoadingAnswers,
	};
};

// Saved Questions
export const populateSavedQuestions = (savedquestions) => {
	return {
		type: "GET_SAVED_QUESTIONS",
		savedquestions,
	};
};

export const populateDispSavedQuestions = (savedquestionToDisplay) => {
	return {
		type: "GET_SAVED_QUESTIONS_TO_DISPLAY",
		savedquestionToDisplay,
	};
};

export const setSavedQuestionsTotalPages = (savedquestionTotalPages) => {
	return {
		type: "GET_SAVED_QUESTIONS_TOTAL_PAGES",
		savedquestionTotalPages,
	};
};

export const setSavedQuestionsCurrentPage = (savedquestionCurrentPage) => {
	return {
		type: "GET_SAVED_QUESTIONS_CURRENT_PAGE",
		savedquestionCurrentPage,
	};
};

export const setLoadingSavedQuestions = (isLoadingSavedQuestions) => {
	return {
		type: "SET_SAVED_QUESTIONS_LOADING",
		isLoadingSavedQuestions,
	};
};

// Tab Selection
export const handleTabsSelection = (tabSelected) => {
	return {
		type: "HANDLE_TAB_SELECTION",
		tabSelected,
	};
};

// Functions
export const getUpdatesReceived = async (dispatch, user_id, acquireData) => {
	if (!acquireData) {
		return;
	}
	axios.get(`https://qlassroombackend.herokuapp.com/responses/user/${user_id}`)
		.then(function (response) {
			dispatch(setUpdatesReceived(response.data.length));
		})
		.catch(function (error) {
			console.log(error);
		});

};

export const getAnswersAccepted = async (dispatch, user_id, acquireData) => {
	if (!acquireData) {
		return;
	}
	axios.get(`https://qlassroombackend.herokuapp.com/responses/answersaccepted/${user_id}`)
		.then(function (response) {
			console.log(response.data);
			dispatch(setAnswersAccepted(response.data.length));
		})
		.catch(function (error) {
			console.log(error);
		});

};

export const getUpvotesGiven = async (dispatch, user_id, acquireData) => {
	if (!acquireData) {
		return;
	}
	axios.get(`https://qlassroombackend.herokuapp.com/vote/${user_id}`)
		.then(function (response) {
			console.log(response.data);
			var totalVotes = response.data.post_votes.length + response.data.response_votes.length;
			dispatch(setUpvotesGiven(totalVotes));
		})
		.catch(function (error) {
			console.log(error);
		});

};

export const getQuestions = async (dispatch, toast, user_id, acquireData) => {
	if (!acquireData) {
		return;
	}


	// axios.get("https://qlassroombackend.herokuapp.com/posts/user/16f59363-c0a4-406a-ae65-b662c6b070cd")
	axios.get("https://qlassroombackend.herokuapp.com/posts/user/" + user_id)
		.then((data) => {
			console.log(data.data);
			var questions = data.data;
			var questionDetails = [];
			var totalQuestions = Math.ceil(questions.length / 4);
			var dispQuestions = [];

			for (let i = 0; i < questions.length; i++) {
				var post = questions[i];
				var post_shortTitle = "";

				if (post.post_title.length > 30) {
					post_shortTitle = post.post_title.substring(0, 30) + "...";
				}

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

				var question_responses = post.Responses;
				var answer_count = 0;
				var comment_count = 0;

				for (let i = 0; i < question_responses.length; i++) {
					var response = question_responses[i];

					if (response.ResponseType.response_type == "comment") {
						comment_count++;
					} else if (response.ResponseType.response_type == "answer") {
						answer_count++;
					}
				}

				questionDetails.push({
					post_id: post.post_id,
					question_id: post.post_id,
					post_votes: post.post_rating,
					post_date: post_date_output,
					post_title: post.post_title,
					post_shortTitle: post_shortTitle,
					post_answerCount: answer_count,
					post_commentCount: comment_count,
					user_id: post.fk_user_id,
				});

			}

			for (let i = 0; i < 4; i++) {
				if (questionDetails[i] != undefined) {
					dispQuestions.push(questionDetails[i]);
				}
			}

			console.log(dispQuestions);
			dispatch(populateQuestions(questionDetails));
			dispatch(populateDispQuestions(dispQuestions));
			dispatch(setQuestionsTotalPages(totalQuestions));
			dispatch(setLoadingQuestions(false));

		})
		.catch((err) => {
			console.log(err);
			toast.error("Error Retrieving Questions");
		});

};

export const getAnswers = async (dispatch, toast, user_id, acquireData) => {
	if (!acquireData) {
		return;
	}


	axios.get("https://qlassroombackend.herokuapp.com/answers/user/" + user_id)
		.then((data) => {
			console.log(data.data);
			var answers = data.data;
			var answerDetails = [];
			var totalAnswers = Math.ceil(answers.length / 5);
			var dispAnswers = [];

			for (let i = 0; i < answers.length; i++) {
				var comment = answers[i];
				var post_shortTitle = "";
				var comment_shortResponse = "";

				if (comment.Post.post_title.length > 30) {
					post_shortTitle = comment.Post.post_title.substring(0, 30) + "...";
				}

				if (comment.response.length > 50) {
					comment_shortResponse = comment.response.substring(0, 50) + "...";
				}

				answerDetails.push({
					answer_id: i,
					answer_username: comment.User.first_name,
					answer_post_username: comment.User.first_name,
					answer_title: comment.Post.post_title,
					answer_post_shortTitle: post_shortTitle,
					answer_value: comment.response,
					answer_shortValue: comment_shortResponse,
					post_id : comment.fk_post_id
				});
			}

			for (let i = 0; i < 5; i++) {
				if (answerDetails[i] != undefined) {
					dispAnswers.push(answerDetails[i]);
				}
			}

			dispatch(populateAnswers(answerDetails));
			dispatch(populateDispAnswers(dispAnswers));
			dispatch(setAnswersTotalPages(totalAnswers));
			dispatch(setLoadingAnswers(false));
			dispatch(setAnswersPosted(answers.length));

		})
		.catch((err) => {
			console.log(err);
			toast.error("Error Retrieving Answers");
		});

};

export const getSavedQuestions = async (dispatch, toast, user_id, acquireData) => {
	if (!acquireData) {
		return;
	}


	axios.get("https://qlassroombackend.herokuapp.com/posts/save/user/" + user_id)
		.then((data) => {
			console.log(data.data);
			var savedQuestions = data.data;
			var savedQuestionDetails = [];
			var totalSavedQuestions = Math.ceil(savedQuestions.length / 4);
			var dispSavedQuestions = [];

			for (let i = 0; i < savedQuestions.length; i++) {
				var post = savedQuestions[i];
				var post_shortTitle = "";

				if (post.Post.post_title.length > 30) {
					post_shortTitle = post.Post.post_title.substring(0, 30) + "...";
				}

				// Calculates Time
				var date = new Date(post.Post.post_created_at);
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
					post_id: post.Post.post_id,
					question_id: post.Post.post_id,
					post_votes: post.Post.post_rating,
					post_date: post_date_output,
					post_title: post.Post.post_title,
					post_shortTitle: post_shortTitle
				});
			}

			for (let i = 0; i < 4; i++) {
				if (savedQuestionDetails[i] != undefined) {
					dispSavedQuestions.push(savedQuestionDetails[i]);
				}
			}

			dispatch(populateSavedQuestions(savedQuestionDetails));
			dispatch(populateDispSavedQuestions(dispSavedQuestions));
			dispatch(setSavedQuestionsTotalPages(totalSavedQuestions));
			dispatch(setLoadingSavedQuestions(false));

		})
		.catch((err) => {
			console.log(err);
			toast.error("Error Retrieving Saved Questions");
		});

};

