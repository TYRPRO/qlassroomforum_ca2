const initialState = {
    isLoadingPosts: true,
    posts: [],
    subjectFilter: "",
    levelFilter: "",
    tags: [{tag_id:1, tag_name: "Math"},{tag_id:2, tag_name: "Science"},{tag_id:3, tag_name: "Physics"}],
    unanswered: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "SUBFORUM_POPULATE_POSTS":
        return {
          ...state,
          isLoadingPosts: false,
          posts: action.posts,
        };

        case "SUBFORUM_SUBJECT_FILTER_CHANGED": 
        return {
            ...state,
            subjectFilter: action.subjectFilter
        }

        case "SUBFORUM_LEVEL_FILTER_CHANGED": 
        return {
            ...state,
            levelFilter: action.levelFilter
        }

        case "SUBFORUM_UNANSWERED_CHECKBOX_TICKED":
          return {
            ...state,
            unanswered: true
          }
  
      default:
        return state;
    }
  };

  export default reducer;