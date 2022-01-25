/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./search.css";
import SearchPost from "./SearchPost";
import Channel from "../ChannelComponents/Channel";

//Component Creation
const Search = () => {
	const [similarsLst, setSimilars] = useState([]);
	const [isLoadedSimilars, setIsLoadedSimilars] = useState(false);

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
				toast.error("Error finding similar posts");
				console.log(err);
			});
	}

	useEffect(() => {
		searchPosts();
	}, []);
	return (
		<React.Fragment>
			<div className="container-xxl my-md-4">
				<div className="row">
					<div className="col-lg-1"></div>
					<div className="col-lg-10">
						<div id="resultheader">
							<h5 className="mb-2 headers"> Displaying Search Results for "{getParams()}" </h5>
						</div>
						<hr></hr>

						<div id="posts" className="w3-container w3-border tab">
							<div id="posts_similar">
								{
									isLoadedSimilars == true ? (

										similarsLst.length > 0 ? (
											similarsLst.map((data) => (
												<SearchPost
													key={data.post_id}
													post_id={data.post_id}
													fk_subforum_id={data.fk_subforum_id}
													fk_user_id={data.fk_user_id}
													fk_grade_id={data.fk_grade_id}
													post_title={data.post_title}
													post_content={data.post_content}
													post_is_pinned={data.post_is_pinned}
													post_is_answered={data.post_is_answered}
													post_created_at={data.post_created_at}
													post_rating={data.post_rating}
													post_answers_count={data.post_answers_count}
													fk_response_id={data.fk_response_id}
													first_name={data.User.first_name}
													last_name={data.User.last_name}
													user_id={data.User.user_id}
													grade_id={data.Grade.grade_id}
													grade_name={data.Grade.grade_name}
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