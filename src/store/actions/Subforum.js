import axios from "axios";

export const populatePosts = (posts) => {
  return {
    type: "SUBFORUM_POPULATE_POSTS",
    posts,
  };
};

export const setLevelFilter = (level) => {
  return {
    type: "SUBFORUM_LEVEL_FILTER_CHANGED",
    levelFilter: level
  }
 }
export const getPosts = async (dispatch, subForumName, toast) => {
    toast.promise(
        new Promise((resolve, reject) => {
          axios
            .request({
              method: "get",
              url: `https://readdit-backend.herokuapp.com/post/get/r/` + subForumName,
              headers: {
                "content-type": "application/json; charset=utf-8",
              },
            })
            .then((data) => {
                let postArr = data.data;
                dispatch(populatePosts(postArr));
                resolve(true);
            })
            .catch((error) => {
              reject(error.response.data.message);
            });
        }),
        {
          pending: "Fetching Posts...",
          success: "Posts Fetched",
          error: {
            render({ data }) {
              return `${data}`;
            },
          },
        }
      );
};
