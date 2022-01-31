import axios from "axios";

export const populatePosts = (posts) => {
	return {
		type: "SUBFORUM_POPULATE_POSTS",
		posts,
	};
};

export const populateCurrentPosts = (currentPagePosts) => {
	return {
		type: "SUBFORUM_POPULATE_CURRENT_PAGE_POSTS",
		currentPagePosts,
	};
};

export const setLevelFilter = (level) => {
	return {
		type: "SUBFORUM_LEVEL_FILTER_CHANGED",
		levelFilter: level
	};
};

export const setCurrentPageNum = (currentPage) => {
	return {
		type: "SUBFORUM_PAGE_NUM_CHANGED",
		currentPage
	};
};

export const setMaxPageNum = (maxPage) => {
	return {
		type: "SUBFORUM_SET_MAX_PAGE_NUM",
		maxPage
	};
};

export const setSubforumName = (subforumName) => {
	return {
		type: "SUBFORUM_SET_SUBFORUM_NAME",
		subforumName
	};
};

export const getPosts = async (dispatch, subForumId, toast) => {
	axios
		.request({
			method: "get",
			url: `https://qlassroombackend.herokuapp.com/posts/getAllFromSubforum/` + subForumId,
			headers: {
				"content-type": "application/json; charset=utf-8",
			},
		})
		.then((data) => {
			let postArr = data.data;
			dispatch(populatePosts(postArr));
			dispatch(setCurrentPageNum(1));
			dispatch(setMaxPageNum((Math.ceil(postArr.length / 4))));
			dispatch(populateCurrentPosts(postArr.slice(0, 4)));
			dispatch(setSubforumName(postArr[0].Subforum.subforum_name));
		})
		.catch((error) => {
			toast.error(error.response.data.message);
		});
};


export const filterPosts = async (dispatch, ChannelFilterData) => {
	axios.post("https://qlassroombackend.herokuapp.com/posts/filter/home",
		ChannelFilterData)
		.then(data => {
			let postArr = data.data;
			dispatch(populatePosts(postArr));
			dispatch(setCurrentPageNum(1));
			dispatch(setMaxPageNum((Math.ceil(postArr.length / 4))));
			dispatch(populateCurrentPosts(postArr.slice(0, 4)));
		}).catch(function (error) {
			console.log(error);
			console.log(error.response);
		});
};
