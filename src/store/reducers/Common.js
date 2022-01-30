const initialState = {
	acquireData: false,
	userDetails: {},
	profile_pic: "",
	isLoadingImage: true
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case "GET_USER_DETAILS":
		return {
			...state,
			acquireData: true,
			userDetails: action.userDetails,
		};
	case "UPDATE_PROFILE_PIC":
		return {
			...state,
			profile_pic: action.profile_pic,
		};
	case "PROFILE_PIC_LOADED":
		return {
			...state,
			isLoadingImage: false
		};
	default:
		return state;
	}
};

export default reducer;