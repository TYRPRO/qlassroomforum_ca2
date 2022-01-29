import Subforum from "./Subforum";
import CreateSubforum from "./CreateSubforum";
import Common from "./Common";
import MyActivity from "./MyActivity";
import { combineReducers } from "redux";

const reducer = combineReducers({
	Subforum,
	CreateSubforum,
	Common,
	MyActivity
});

export default reducer;