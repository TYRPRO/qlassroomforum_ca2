import axios from "axios";

function findCookie(name) {
	var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
	if (match) {
		return (match[2]);
	}
	else {
		return ("error");
	}
}

export const populateProfile = (profile) => {
	return {
		type: "PROFILE_POPULATE_FIELDS",
		profile,
	};
};

export const editFirstName = (first_name) => {
	return {
		type: "PROFILE_EDIT_FIRST_NAME",
		first_name,
	};
};

export const editLastName = (last_name) => {
	return {
		type: "PROFILE_EDIT_LAST_NAME",
		last_name
	};
};

export const editEmail = (email) => {
	return {
		type: "PROFILE_EDIT_EMAIL",
		email
	};
};

export const oldPasswordEntry = (old_password) => {
	return {
		type: "PROFILE_OLD_PASSWORD_ENTRY",
		old_password
	};
};

export const newPasswordEntry = (new_password) => {
	return {
		type: "PROFILE_NEW_PASSWORD_ENTRY",
		new_password
	};
};

export const setImageFile = (file) => {
	return {
		type: "PROFILE_FILE_SELECTED",
		file
	};
};

export const imageLoaded = () => {
	return{
		type: "PROFILE_IMAGE_LOADED"
	};
};

export const reenterNewPasswordEntry = (reenter_new_password) => {
	return {
		type: "PROFILE_REENTER_NEW_PASSWORD_ENTRY",
		reenter_new_password
	};
};

export const handleTabsSelection = (tab) => {
	return {
		type: "PROFILE_TAB_SELECTED",
		selectedTab: tab
	};
};

export const getProfile = async (dispatch, toast) => {
	var token = findCookie("token");
	axios
		.request({
			method: "get",
			url: `https://qlassroombackend.herokuapp.com/user/profile/`,
			headers: {
				"content-type": "application/json; charset=utf-8",
				"Authorization": "Bearer " + token
			},
		})
		.then((data) => {
			let profile = data.data;
			dispatch(populateProfile(profile));
		})
		.catch((error) => {
			toast.error(error.response.data.message);
		});
};
