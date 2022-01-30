/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Channel from "../ChannelComponents/Channel";
import "./Home.css";
import Post from "../PostComponent/Post";

import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  top: 32vh;
`;

const Home = () => {
	const baseUrl = "https://qlassroombackend.herokuapp.com/";
	const [PostsData, setPostsData] = useState([]);
	const [CurrentPost, setCurrentPost] = useState([]);
	const [CurrentPage, setCurrentPage] = useState(1);
	const [isLoadingPosts, setIsLoadingPosts] = useState(true);
	const [isLoadingFilteredPosts, setIsLoadingFilteredPosts] = useState(false);
	const [MaxPage, setMaxPage] = useState();

	function getAllPost() {
		axios.get(baseUrl + "/posts/")
			.then(function (response) {
				setCurrentPage(1);
				var data = response.data;
				// Setting All post data
				setPostsData(data);
				// Setting Current post data
				setCurrentPost(data.slice(0, 4));
				// Setting Maximum pages
				setMaxPage(Math.ceil(data.length / 4));
				setIsLoadingPosts(false);
			}).catch(function (error) {
				console.log(error);
			});
	}

	useEffect(() => {
		getAllPost();
	}, []);

	function NextPage() {
		if (CurrentPage < MaxPage) {
			setCurrentPost(PostsData.slice(CurrentPage * 4, (CurrentPage * 4) + 4));
			setCurrentPage(CurrentPage + 1);
		}
	}
	function PrevPage() {
		if (CurrentPage != 1) {
			setCurrentPost(PostsData.slice(((CurrentPage - 2) * 4), ((CurrentPage - 1) * 4)));
			setCurrentPage(CurrentPage - 1);
		}
	}
	const ChannelDataHandler = (ChannelFilterData) => {
		setIsLoadingFilteredPosts(true);
		axios.post("https://qlassroombackend.herokuapp.com/posts/filter/home",
			ChannelFilterData)
			.then(res => {
				// Resetting page to first page
				setCurrentPage(1);
				// Setting Maximum pages
				setMaxPage(Math.ceil(res.data.length / 4));
				// Seting post data
				setPostsData(res.data);
				// Setting Current post data
				setCurrentPost(res.data.slice(0, 4));
				setIsLoadingFilteredPosts(false);
			}).catch(function (error) {
				console.log(error);
				console.log(error.response);
			});
	};


	return (
		<div className="container-fluid">
			<div className='container'>
				<div className='row'>
					{isLoadingPosts ? <HashLoader color={"#a5c1e8"} loading={isLoadingPosts} css={override} size={150} /> :
						<React.Fragment>
							<Channel onFilterPost={ChannelDataHandler} hideSubject={false} />
							{isLoadingFilteredPosts ? <HashLoader color={"#a5c1e8"} loading={isLoadingFilteredPosts} css={override} size={150} /> :
								<div className="col-lg-9">
									<div className="post-margin">
										<label>{CurrentPage == 1 ? CurrentPage : (CurrentPage - 1) * 4}-{PostsData.length > CurrentPage * 4 ? CurrentPage * 4 : PostsData.length} of {PostsData.length} Questions</label>
										<Post Posts={CurrentPost} />
									</div>
									<div className="d-flex justify-content-between">
										<div onClick={PrevPage} style={{ cursor: "pointer" }}><i className="fa fa-caret-left"></i><b className="PrevPage">Prev Page</b></div>
										<p className="">{CurrentPage} out of {MaxPage}</p>
										<div onClick={NextPage} style={{ cursor: "pointer" }}><b className="NextPage">Next Page</b><i className="fa fa-caret-right"></i></div>
									</div>
								</div>
							}
						</React.Fragment>}
				</div>
			</div>
		</div >
	);
};

export default Home;
