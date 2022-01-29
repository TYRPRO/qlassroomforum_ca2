/* eslint-disable no-unused-vars */
//Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./header.css";

//Creating Component
const Header = () => {
	const [username, editUsername] = useState("");
	const [user_id, editUserID] = useState(0);
	const [fk_user_type_id, editUserType] = useState(0);

	function acquireUserData() {
		var token = findCookie("token");

		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				var data = response.data;
				console.log(data);
				editUsername(data.username);
				editUserID(data.user_id);
				editUserType(data.fk_user_type_id);

			})
			.catch((err) => {
				toast.error(err.response.data.message);
				console.log(err.response.data.message);
				window.location.assign("/login");
			});
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

	//Function that redirects to search page
	let runSearch = (e) => {
		e.preventDefault();
		var query = document.getElementById("Search").value; //getting value of text entered into search bar
		window.location.href = "/search?query=" + query; //redirecting user to the search page
	};

	useEffect(() => acquireUserData(), []);

	//Rendering the Header
	return (
		<React.Fragment>
			<nav className="navbar navbar-dark navbar-expand-lg sticky-top" id="header">
				<div className="container-fluid">
					<a href="/home" id="HeaderText">Knowledge</a>
					<button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#readitNavbar" aria-controls="readitNavbar" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div id="readitNavbar" className="collapse navbar-collapse">
						<form className="flex-grow-1 me-5 ms-5 mb-0" onSubmit={runSearch}>
							<div className="input-group">
								<input className="form-control" type="text" placeholder="Search for more question" aria-label="Search" id="Search" />
								<button className="btn bg-white" type="submit" id="headerSearchBtn" onClick={() => runSearch}>
									<i className="fas fa-search text-white"></i>
								</button>
							</div>
						</form>
						<ul className="navbar-nav ms-auto">
							<a href="/myactivity" id="Activity" className="btn me-2 px-4 rounded-pill ">
								My Activity
							</a>
							<a href="/CreateQn" id="AddQuestion" className="btn me-3 px-4">
								+ Question
							</a>
						</ul>
					</div>
				</div>
			</nav>
		</React.Fragment>
	);
};

export default Header;
