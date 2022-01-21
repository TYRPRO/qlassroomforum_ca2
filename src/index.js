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

import CreateQn from "./CreateQn.js";
import ViewQn from "./ViewQn.js";
import MyActivity from "./Components/MyActivityComponents/MyActivity";
import SideBar from "./Components/SideBarComponents/SideBar";
import Login from "./Components/LoginComponents/Login";
import Header from "./Components/HeaderComponents/Header";
import CreateUser from "./Components/CreateAccountComponent/CreateUser";
import Search from "./Components/SearchComponents/Search";
import Subforum from "./Components/SubForumComponents/Subforum";
import CreateSubforum from "./Components/SubForumComponents/CreateSubforum";
import Home from "./Components/HomeComponents/Home";

const composedTool = compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), applyMiddleware(thunk));

const store = createStore(allReducers, applyMiddleware(thunk));

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			{window.location.pathname !== "/login" && window.location.pathname !== "/signup" ? (
				<Header />
			) : null}
			<BrowserRouter>
				<div>
					<nav>
						<ul>
							<li><Link to="home">App</Link></li>
							<li><Link to="createqn">Create QN</Link></li>
							<li><Link to="posts/c059519c-6793-4ef8-9026-14869d61f28a">Post</Link></li>
							<li><Link to="myactivity">My Activity</Link></li>
						</ul>
					</nav>
				</div>
				<div className="d-flex flex-row">
					<SideBar />
					<div className="d-flex flex-grow-1" id="content">
						<Routes>
							<Route path="/home" element={<App />}></Route>
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
			</BrowserRouter>
		</Provider>

	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
