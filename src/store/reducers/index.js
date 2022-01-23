import Subforum from "./Subforum";
import CreateSubforum from "./CreateSubforum";
import { combineReducers } from "redux";

const reducer = combineReducers({
	Subforum,
	CreateSubforum
});

export default reducer;