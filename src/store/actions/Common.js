import axios from "axios";

export const populateUserDetails = (userDetails) => {
	return {
		type: "GET_USER_DETAILS",
		userDetails,
	};
};

export const changeProfilePic = (profile_pic) => {
	return{
		type: "UPDATE_PROFILE_PIC",
		profile_pic
	};
};

export const profilePicLoaded = () => {
	return{
		type: "PROFILE_PIC_LOADED"
	};
};

export const getUserDetails = async (dispatch) => {
	var match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
	if (match) {
		var token = match[2];
		axios.request({
			method: "get",
			url: "https://qlassroombackend.herokuapp.com/user/userData",
			headers: {
				"content-type": "application/json; charset=utf-8",
				"Authorization": "Bearer " + token
			},
		})
			.then(response => {
				var data = response.data;
				dispatch(populateUserDetails(
					{
						first_name: data.first_name,
						last_name: data.last_name,
						user_id: data.user_id,
						roles: data.roles
					}
				));
			})
			.catch((err) => {
				console.log(err);
				window.location.assign("/login");
			});
	}
	else {
		return ("error");
	}
};

export const getUserProfilePic = async (dispatch) => {
	var match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
	if (match) {
		var token = match[2];
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
				dispatch(changeProfilePic(profile.UserProfile.profile_pic));
				dispatch(profilePicLoaded());
			})
			.catch((err) => {
				console.log(err);
			});
	}
	else {
		return ("error");
	}
};