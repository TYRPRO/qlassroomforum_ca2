/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
	BrowserRouter,
	Routes,
	Route,
	Link,
	Navigate
} from "react-router-dom";

import { createStore, applyMiddleware, compose } from "redux";
import allReducers from "./store/reducers/index";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { ToastContainer, toast, Slide } from "react-toastify";

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
import EditQn from "./Components/QuestionComponents/EditQn";
import Profile from "./Components/ProfileComponents/Profile";
import Report from "./Components/ReportComponent/Report";

const composedTool = compose(applyMiddleware(thunk));
//const composedTool = compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));

// login functions
function checkLogin() {
	var token = findCookie("token");
	if (token == "error") {
		return false;
	}
	else {
		axios.get("https://qlassroombackend.herokuapp.com/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				// var data = response.data;
				return true;
			})
			.catch((err) => {
				return false;
			});

		return true;
	}
}

function findCookie(name) {
	var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
	if (match) {
		return (match[2]);
	}
	else {

		return ("error");
	}
}

const store = createStore(allReducers, composedTool);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<div className="d-flex flex-row" id="all">
					{window.location.pathname !== "/login" && window.location.pathname !== "/signup" && checkLogin() ? (
						<SideBar />
					) : null}
					<div className="d-flex flex-column flex-grow-1" id="headcontent">
						{window.location.pathname !== "/login" && window.location.pathname !== "/signup" && checkLogin() ? (
							<Header />
						) : null}
						<div id="content">
							<Routes>
								<Route path="/home" element={checkLogin() ? <Home/> : <Navigate replace to="/login" />}></Route>
								<Route path="/createqn" element={checkLogin() ? <CreateQn /> : <Navigate replace to="/login" />}></Route>
								<Route path="/posts/:post_id" element={checkLogin() ? <ViewQn /> : <Navigate replace to="/login" />}></Route>
								<Route path="/myactivity" element={checkLogin() ? <MyActivity /> : <Navigate replace to="/login" />} />
								<Route path="/login" element={<Login />} />
								<Route path="/signup" element={<CreateUser />} />
								<Route path="/search" element={checkLogin() ? <Search /> : <Navigate replace to="/login" />} />
								<Route path="subforum/:subForum" element={checkLogin() ? <Subforum /> : <Navigate replace to="/login" />} />
								<Route path="newforum" element={checkLogin() ? <CreateSubforum /> : <Navigate replace to="/login" />} />
								<Route path="/" element={<Navigate replace to="/home" />} />
								<Route path="/posts/editQn/:post_id" element={checkLogin() ? <EditQn /> : <Navigate replace to="/login" />} />
								<Route path="/myprofile" element={checkLogin() ? <Profile /> : <Navigate replace to="/login" />} />
								<Route path="/report" element={checkLogin() ? <Report /> : <Navigate replace to="/login" />} />
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
