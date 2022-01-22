/* eslint-disable no-unused-vars */
// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./search.css";
import Post from "./SearchPost";

//Component Creation
const Search = () => {
	//login info
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [user_id, setUserID] = useState(0);
	const [role, setRole] = useState("");
	const [acquireData, setAcquireData] = useState(false);

	const [postlst, setPostLst] = useState([]);
	const [similarsLst, setSimilars] = useState([]);

	const [isLoadedPosts, setIsLoadedPosts] = useState(false);
	const [isLoadedSimilars, setIsLoadedSimilars] = useState(false);

	// login functions
	function acquireUserData() {
		var token = findCookie("token");

		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				var data = response.data;
				console.log(data);
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

	function getParams() {
		var queryParams = new URLSearchParams(window.location.search);

		var input = queryParams.get("query");

		return input;
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

		//basic subreaddit search
		axios.get(`http://localhost:8000/posts/search?` + queryParams,
			{
				contentType: "application/json; charset=utf-8"
			})
			.then(response => {
				var posts = response.data.Result;
				setPostLst(posts);
				setIsLoadedPosts(true);

				//similar search
				axios.get(`http://localhost:8000/posts/SimilarSearch?` + queryParams,
					{
						contentType: "application/json; charset=utf-8"
					})
					.then(response => {
						var similars = arrangeSimilars(response.data);
						setSimilars(similars);

						setIsLoadedSimilars(true);
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
		searchPosts();
	}, []);
	return (
		<React.Fragment>
			<div className="container-xxl my-md-4">
				<div className="row">
					<div className="col-lg-1"></div>
					<div className="col-lg-10">
						<div id="resultheader">
							<h5 className="mb-2 headers"> Displaying Search Results for {getParams()} </h5>
						</div>
						<hr></hr>

						<div id="posts" className="w3-container w3-border tab">
							<div id="posts_content">
								{
									isLoadedPosts == true ? (

										postlst.length > 0 ? (
											postlst.map((data) => (
												<Post
													key={data.post_id}
													post_id={data.post_id}
													post_title={data.post_title}
													post_content={data.post_content}
													post_is_answered={data.post_is_answered}
													post_created_at={data.post_created_at}
													post_rating={data.post_rating}
													first_name={data.User.first_name}
													last_name={data.User.last_name}
													subforum_name={data.Subforum.subforum_name}
												/>
											))
										) : (
											<div >No Questions found</div>
										)

									) : (
										<div className="text-center">Loading...</div>
									)
								}
							</div>
							<h5 className="mt-3 headers" id="similar_header">Similar results</h5>
							<hr></hr>
							<div id="posts_similar">
								{
									isLoadedSimilars == true ? (

										similarsLst.length > 0 ? (
											similarsLst.map((data) => (
												<Post
													key={data.post_id}
													post_id={data.post_id}
													post_title={data.post_title}
													post_content={data.post_content}
													post_is_answered={data.post_is_answered}
													post_created_at={data.post_created_at}
													post_rating={data.post_rating}
													first_name={data.User.first_name}
													last_name={data.User.last_name}
													subforum_name={data.Subforum.subforum_name}
												/>
											))
										) : (
											<div >No Similar Questions found</div>
										)

									) : (
										<div className="text-center">Loading...</div>
									)
								}
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