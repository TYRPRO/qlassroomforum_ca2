export const updateTitle = (subforum_name) => {
	return {
		type: "CREATE_SUBFORUM_TITLE_INPUT",
		subforum_name,
	};
};

export const updateDescription = (subforum_description) => {
	return {
		type: "CREATE_SUBFORUM_DESCRIPTION_INPUT",
		subforum_description,
	};
};