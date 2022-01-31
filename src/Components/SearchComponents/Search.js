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

	const [CurrentPost, setCurrentPost] = useState([]);
	const [CurrentPage, setCurrentPage] = useState(1);
	const [MaxPage, setMaxPage] = useState();

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
		axios.get(`https://qlassroombackend.herokuapp.com/posts/SimilarSearch?` + queryParams,
			{
				contentType: "application/json; charset=utf-8"
			})
			.then(response => {
				var similars = arrangeSimilars(response.data);

				// Setting All post data
				setSimilars(similars);
				// Setting Current post data
				setCurrentPost(similars.slice(0, 10));
				// Setting Maximum pages
				setMaxPage(Math.ceil(similars.length / 10));
				// Done Loading similar posts
				setIsLoadedSimilars(true);
			})
			.catch((err) => {
				toast.error("Error finding similar posts");
				console.log(err);
			});
	}

	const ChannelDataHandler = (ChannelFilterData) => {
		var queryParams = new URLSearchParams(window.location.search);
		axios.post("https://qlassroombackend.herokuapp.com/posts/filter/similar?" + queryParams,
			ChannelFilterData)
			.then(res => {
				// Resetting page to first page
				setCurrentPage(1);
				// Setting Maximum pages
				setMaxPage(Math.ceil(res.data.length / 10));
				// Seting post data
				setSimilars(res.data);
				// Setting Current post data
				setCurrentPost(res.data.slice(0, 10));

			}).catch(function (error) {
				console.log(error);
				console.log(error.response);
			});
	};

	function NextPage() {
		if (CurrentPage < MaxPage) {
			setCurrentPost(similarsLst.slice(CurrentPage * 10, (CurrentPage * 10) + 10));
			setCurrentPage(CurrentPage + 1);
		}
	}

	function PrevPage() {
		if (CurrentPage != 1) {
			setCurrentPost(similarsLst.slice(((CurrentPage - 2) * 10), ((CurrentPage - 1) * 10)));
			setCurrentPage(CurrentPage - 1);
		}
	}

	useEffect(() => {
		searchPosts();
	}, []);
	return (
		<React.Fragment>
			<div className="container-xxl my-md-10">
				<div className="row">
					<Channel onFilterPost={ChannelDataHandler} hideSubject={false} />
					<div className="col-lg-9">
						<div id="resultheader">
							<h5 className="mb-2 headers"> Displaying Search Results for "{getParams()}" </h5>
						</div>
						<hr></hr>

						<div id="posts" className="w3-container w3-border tab">
							<div id="posts_similar">
								{
									isLoadedSimilars == true ? (

										similarsLst.length > 0 ? (
											CurrentPost.map((data) => (
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
						<div className="d-flex justify-content-between">
							<div onClick={PrevPage} style={{ cursor: "pointer" }}><i className="fa fa-caret-left"></i><b className="PrevPage">Prev Page</b></div>
							<p className="">{CurrentPage} out of {MaxPage}</p>
							<div onClick={NextPage} style={{ cursor: "pointer" }}><b className="NextPage">Next Page</b><i className="fa fa-caret-right"></i></div>
						</div>
					</div>
				</div>
				<div className="col-lg-1"></div>
			</div>
		</React.Fragment >
	);
};

export default Search;