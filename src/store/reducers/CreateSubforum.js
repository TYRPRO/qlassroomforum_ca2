const initialState = {
	subforum_name: "",
	subforum_description: ""
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case "CREATE_SUBFORUM_TITLE_INPUT":
		return {
			...state,
			subforum_name: action.subforum_name,
		};

	case "CREATE_SUBFORUM_DESCRIPTION_INPUT": 
		return {
			...state,
			subforum_description: action.subforum_description,
		};  
	default:
		return state;
	}
};

export default reducer;