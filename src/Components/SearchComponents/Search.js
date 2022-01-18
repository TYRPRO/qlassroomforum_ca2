// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./search.css";

//Component Creation
const Search = () => {
	const [switched, editSwitched] = useState(false);
	//login info
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [user_id, setUserID] = useState(0);
	const [role, setRole] = useState("");
	const [acquireData, setAcquireData] = useState(false);

	// login functions
	function acquireUserData() {
		var token = findCookie("token");

		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				var data = response.data;
				setFirstname(data.first_name);
				setLastname(data.last_name);
				setUserID(data.user_id);
				setRole(data.roles);

				setAcquireData(true);
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

	function addClass(tabName) {
		if ((switched == true && tabName == "Posts") || (switched == false && tabName == "Subreaddits")) {
			return "active";
		}
		else {
			return ""
		}
	}

	function addStyle(tabName) {
		if ((switched == true && tabName == "Posts") || (switched == false && tabName == "Subreaddits")) {
			return { backgroundColor: "#6997d6", display: "block" };
		}
		else {
			return { color: "#6997d6", display: "block" }
		}
	}

	function switchTab() {
		if (switched == true) {
			editSwitched(false);
		}
		else if (switched == false) {
			editSwitched(true);
		}
	}

	function getParams() {
		var queryParams = new URLSearchParams(window.location.search);

		var input = queryParams.get("query");

		return input;
	}

	//search for subreaddits
	function searchSubreaddits() {
		var queryParams = new URLSearchParams(window.location.search);
		var input = queryParams.get("query");
		//basic subreaddit search
		axios.get("http://localhost:3000/r/search/query" + window.location.search,
			{
				contentType: "application/json; charset=utf-8"
			})
			.then(response => {
				var subreaddits = response.data.Result;

				if (subreaddits.length == 0) {
					document.getElementById("subreaddit_content").append("No results found");
				}
				else {
					let appendString = document.createDocumentFragment();

					for (var i = 0; i < subreaddits.length; i++) {
						var subreadditContainer = document.createElement("div");
						var round = ""
						if (i == 0) {
							round = "rounded-top";
						}
						if (i == subreaddits.length - 1) {
							round = "rounded-bottom";
						}
						subreadditContainer.innerHTML = `
                                    <div class="post rounded">
                                        <div class="row g-0 ">
                                            <div class="col-12 bg-white py-2 px-3 ${round} subreaddit" id="subreaddit_${subreaddits[i].subreaddit_name}">
                                                <div class="d-flex flex-row align-items-baseline">
                                                    <a href="/r/${subreaddits[i].subreaddit_name}" class="text-dark text-decoration-none"><h6 class="d-inline fw-bold clickable-link">r/${subreaddits[i].subreaddit_name}</h6></a>
                                                </div>
        
                                                <h5 class="smaller text-secondary">${subreaddits[i].subreaddit_description}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    `;
						appendString.append(subreadditContainer);
					}

					document.getElementById("subreaddit_content").append(appendString);
				}

				//similar search
				axios.get("http://localhost:3000/r/SimilarSearch/" + input,
					{
						contentType: "application/json; charset=utf-8"
					})
					.then(response => {
						console.log(response.data);
						var similars = arrangeSimilars(response.data);
						if (similars.length == 0) {
							document.getElementById("subreaddit_similar").append("No similar results available");
						}
						else {
							//removes duplicate values
							let appendString = document.createDocumentFragment();
							for (var i = 0; i < similars.length; i++) {
								var duplicate = false;
								for (var count = 0; count < subreaddits.length; count++) {
									if (similars[i].subreaddit_id == subreaddits[count].subreaddit_id) {
										duplicate = true;
									}
								}
								if (duplicate == false) {
									var round = "";
									if (i == 0) {
										round = "rounded-top";
									}
									if (i == subreaddits.length - 1) {
										round = "rounded-bottom";
									}
									subreadditContainer.innerHTML = `
                                                <div class="post rounded">
                                                    <div class="row g-0 ">
                                                        <div class="col-12 bg-white py-2 px-3 ${round} subreaddit" id="subreaddit_${similars[i].subreaddit_name}">
                                                            <div class="d-flex flex-row align-items-baseline">
                                                                <a href="/r/${similars[i].subreaddit_name}" class="text-dark text-decoration-none"><h6 class="d-inline fw-bold clickable-link">r/${similars[i].subreaddit_name}</h6></a>
                                                            </div>
                    
                                                            <h5 class="smaller text-secondary">${similars[i].subreaddit_description}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                `;
									appendString.append(subreadditContainer);
								}

							}
							document.getElementById("subreaddit_similar").append(appendString);
						}
					})
					.catch((err) => {
						toast.error(err.response.data.message);
						console.log(err.response.data.message);
					});

			})
			.catch((err) => {
				toast.error(err.response.data.message);
				console.log(err.response.data.message);
			});
	}

	//arrange all similar results by similarity descending
	function arrangeSimilars(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (i == arr.length - 1) {
				break;
			}
			if (arr[i].similar < arr[i + 1].similar) {
				var tmp = arr[i];
				arr[i] = arr[i + 1];
				arr[i + 1] = tmp;

				i = -1;
			}
		}
		return arr;
	}

	//search for subreaddits
	function searchPosts() {
		var queryParams = new URLSearchParams(window.location.search);
		var input = queryParams.get("query");
		//basic subreaddit search
		axios.get(`http://localhost:3000/post/search` + window.location.search,
			{
				contentType: "application/json; charset=utf-8"
			})
			.then(response => {
				var posts = response;
				console.log(posts);
				//similar search
				axios.get(`http://localhost:3000/post/SimilarSearch/` + input,
					{
						contentType: "application/json; charset=utf-8"
					})
					.then(response => {
						console.log(response.data);
					})
					.catch((err) => {
						toast.error(err.response.data.message);
						console.log(err.response.data.message);
					});

			})
			.catch((err) => {
				toast.error(err.response.data.message);
				console.log(err.response.data.message);
			});
	}

	useEffect(() => {
		acquireUserData();
		searchSubreaddits();
	}, []);
	return (
		<React.Fragment>
			<div className="container-xxl my-md-4">
				<div className="row">
					<div className="col-lg-1"></div>
					<div className="col-lg-10">
						<div>
							<ul className="nav nav-pills">
								<li className="nav-item rounded-pill">
									<button onClick={() => switchTab()} style={addStyle("Subreaddits")} id="SubreadditsTab" className={"nav-link tablink " + addClass("Subreaddits")} href="#">Subreaddits</button >
								</li>
								<li className="nav-item rounded-pill">
									<button onClick={() => switchTab()} style={addStyle("Posts")} id="PostsTab" className={"nav-link tablink " + addClass("Posts")} href="#">Posts</button >
								</li>
							</ul>
						</div>
						<hr></hr>
						<div id="resultheader">
							<h5 className="mb-2"> Displaying Search Results for {getParams()} </h5>
						</div>
						<div id="subreaddits" className="w3-container w3-border tab">
							<div id="subreaddit_content"></div>
							<h5 className="mt-3" id="similar_header">Similar results</h5>
							<div id="subreaddit_similar">

							</div>
						</div>

						<div id="posts" className="w3-container w3-border tab">
							<div id="posts_content"></div>
							<h5 className="mt-3" id="similar_header">Similar results</h5>
							<div id="posts_similar">

							</div>
						</div>
					</div>
				</div>
				<div className="col-lg-1"></div>
			</div>
		</React.Fragment >
	);
};

export default Search;