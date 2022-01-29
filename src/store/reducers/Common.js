const initialState = {
	acquireData: false,
	userDetails: {}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case "GET_USER_DETAILS":
		return {
			...state,
			acquireData: true,
			userDetails: action.userDetails,
		};
	default:
		return state;
	}
};

export default reducer;