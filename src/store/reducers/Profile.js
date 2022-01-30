const initialState = {
	isLoadingProfile: true,
	first_name : "",
	last_name : "",
	profile_pic: "",
	email: "",
	old_password: "",
	new_password: "",
	reenter_new_password: "",
	file: null,
	isLoadingImage: true,
	selectedTab: "editprofile"
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case "PROFILE_POPULATE_FIELDS":
		return {
			...state,
			isLoadingProfile: false,
			first_name: action.profile.first_name,
			last_name: action.profile.last_name,
			profile_pic: action.profile.UserProfile.profile_pic,
			email: action.profile.email
		};
	case "PROFILE_EDIT_FIRST_NAME":
		return {
			...state,
			first_name: action.first_name,
		};
	case "PROFILE_EDIT_LAST_NAME":
		return {
			...state,
			last_name: action.last_name
		};

	case "PROFILE_EDIT_EMAIL":
		return {
			...state,
			email: action.email
		};

	case "PROFILE_OLD_PASSWORD_ENTRY":
		return {
			...state,
			old_password: action.old_password
		};
	case "PROFILE_NEW_PASSWORD_ENTRY":
		return {
			...state,
			new_password: action.new_password
		};
	case "PROFILE_REENTER_NEW_PASSWORD_ENTRY":
		return {
			...state,
			reenter_new_password: action.reenter_new_password
		};
	case "PROFILE_FILE_SELECTED":
		return {
			...state,
			file: action.file
		};
	case "PROFILE_IMAGE_LOADED":
		return{
			...state,
			isLoadingImage: false
		};
	case "PROFILE_TAB_SELECTED":
		return{
			...state,
			selectedTab: action.selectedTab
		};
	default:
		return state;
	}
};

export default reducer;