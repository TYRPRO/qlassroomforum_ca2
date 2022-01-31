const initialState = {
	updatesReceived: 0,
	answersPosted: 0,
	answersAccepted: 0,
	upvotesGiven: 0,

	tabSelected: "questions",

	questions: [],
	isLoadingQuestions: true,
	questionToDisplay: [],
	questionTotalPages: 0,
	questionCurrentPage: 0,

	answers: [],
	isLoadingAnswers: true,
	answerToDisplay: [],
	answerTotalPages: 0,
	answerCurrentPage: 0,

	savedquestions: [],
	isLoadingSavedQuestions: true,
	savedquestionToDisplay: [],
	savedquestionTotalPages: 0,
	savedquestionCurrentPage: 0,
	bookmarkHover: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case "GET_UPDATES_RECEIVED":
		return {
			...state,
			updatesReceived: action.updatesReceived,
		};
	case "GET_ANSWERS_POSTED":
		return {
			...state,
			answersPosted: action.answersPosted,
		};
	case "GET_ANSWERS_ACCEPTED":
		return {
			...state,
			answersAccepted: action.answersAccepted,
		};
	case "GET_UPVOTES_GIVEN":
		return {
			...state,
			upvotesGiven: action.upvotesGiven,
		};
	case "HANDLE_TAB_SELECTION":
		return {
			...state,
			tabSelected: action.tabSelected,
		};
	case "GET_QUESTIONS":
		return {
			...state,
			questions: action.questions,
		};
	case "SET_QUESTIONS_LOADING":
		return {
			...state,
			isLoadingQuestions: action.isLoadingQuestions,
		};
	case "GET_QUESTIONS_TO_DISPLAY":
		return {
			...state,
			questionToDisplay: action.questionToDisplay,
		};
	case "GET_QUESTIONS_TOTAL_PAGES":
		return {
			...state,
			questionTotalPages: action.questionTotalPages,
		};
	case "GET_QUESTIONS_CURRENT_PAGE":
		return {
			...state,
			questionCurrentPage: action.questionCurrentPage,
		};
	case "GET_ANSWERS":
		return {
			...state,
			answers: action.answers,
		};
	case "SET_ANSWERS_LOADING":
		return {
			...state,
			isLoadingAnswers: action.isLoadingAnswers,
		};
	case "GET_ANSWERS_TO_DISPLAY":
		return {
			...state,
			answerToDisplay: action.answerToDisplay,
		};
	case "GET_ANSWERS_TOTAL_PAGES":
		return {
			...state,
			answerTotalPages: action.answerTotalPages,
		};
	case "GET_ANSWERS_CURRENT_PAGE":
		return {
			...state,
			answerCurrentPage: action.answerCurrentPage,
		};
	case "GET_SAVED_QUESTIONS":
		return {
			...state,
			savedquestions: action.savedquestions,
		};
	case "SET_SAVED_QUESTIONS_LOADING":
		return {
			...state,
			isLoadingSavedQuestions: action.isLoadingSavedQuestions,
		};
	case "GET_SAVED_QUESTIONS_TO_DISPLAY":
		return {
			...state,
			savedquestionToDisplay: action.savedquestionToDisplay,
		};
	case "GET_SAVED_QUESTIONS_TOTAL_PAGES":
		return {
			...state,
			savedquestionTotalPages: action.savedquestionTotalPages,
		};
	case "GET_SAVED_QUESTIONS_CURRENT_PAGE":
		return {
			...state,
			savedquestionCurrentPage: action.savedquestionCurrentPage,
		};
	case "SET_BOOKMARK_HOVER":
		return {
			...state,
			bookmarkHover: action.bookmarkHover,
		};
	default:
		return state;
	}
};

export default reducer;