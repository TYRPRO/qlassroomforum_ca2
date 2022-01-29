import axios from "axios";

export const populateUserDetails = (userDetails) => {
	return {
		type: "GET_USER_DETAILS",
		userDetails,
	};
};

export const getUserDetails = async (dispatch) => {
	var match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
	if (match) {
		var token = match[2];
		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
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