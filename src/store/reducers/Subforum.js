const initialState = {
	isLoadingPosts: true,
	posts: [],
	currentPagePosts: [],
	subjectFilter: "",
	levelFilter: "",
	unanswered: false,
	currentPage: 1,
	maxPage: 0
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case "SUBFORUM_POPULATE_POSTS":
		return {
			...state,
			isLoadingPosts: false,
			posts: action.posts,
		};
	case "SUBFORUM_POPULATE_CURRENT_PAGE_POSTS":
		return {
			...state,
			isLoadingPosts: false,
			currentPagePosts: action.currentPagePosts,
		};
	case "SUBFORUM_SUBJECT_FILTER_CHANGED":
		return {
			...state,
			subjectFilter: action.subjectFilter
		};

	case "SUBFORUM_LEVEL_FILTER_CHANGED":
		return {
			...state,
			levelFilter: action.levelFilter
		};

	case "SUBFORUM_UNANSWERED_CHECKBOX_TICKED":
		return {
			...state,
			unanswered: true
		};
	case "SUBFORUM_PAGE_NUM_CHANGED":
		return {
			...state,
			currentPage: action.currentPage
		};
	case "SUBFORUM_SET_MAX_PAGE_NUM":
		return {
			...state,
			maxPage: action.maxPage
		};

	default:
		return state;
	}
};

export default reducer;