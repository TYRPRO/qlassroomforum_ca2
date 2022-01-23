/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
	BrowserRouter,
	Routes,
	Route,
	Link
} from "react-router-dom";

import { createStore, applyMiddleware, compose } from "redux";
import allReducers from "./store/reducers/index";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import CreateQn from "./Components/QuestionComponents/CreateQn.js";
import ViewQn from "./Components/QuestionComponents/ViewQn.js";
import MyActivity from "./Components/MyActivityComponents/MyActivity";
import SideBar from "./Components/SideBarComponents/SideBar";
import Login from "./Components/LoginComponent/Login";
import Header from "./Components/HeaderComponents/Header";
import CreateUser from "./Components/CreateAccountComponent/CreateUser";
import Search from "./Components/SearchComponents/Search";
import Subforum from "./Components/SubForumComponents/Subforum";
import CreateSubforum from "./Components/SubForumComponents/CreateSubforum";
import Home from "./Components/HomeComponents/Home";

const composedTool = compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));

const store = createStore(allReducers,  applyMiddleware(thunk));

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<div className="d-flex flex-row" id="all">
					<SideBar />
					<div className="d-flex flex-column flex-grow-1" id="headcontent">
						{window.location.pathname !== "/login" && window.location.pathname !== "/signup" ? (
							<Header />
						) : null}
						<div id="content">
							<Routes>
								<Route path="/home" element={<Home />}></Route>
								<Route path="/createqn" element={<CreateQn />}></Route>
								<Route path="/posts/:post_id" element={<ViewQn />}></Route>
								<Route path="/myactivity" element={<MyActivity />} />
								<Route path="/login" element={<Login />} />
								<Route path="/signup" element={<CreateUser />} />
								<Route path="/search" element={<Search />} />
								<Route path="subforum/:subForum" element={<Subforum />} />
								<Route path="newforum" element={<CreateSubforum />} />
							</Routes>
						</div>
					</div>
				</div>
			</BrowserRouter>
		</Provider>

	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
