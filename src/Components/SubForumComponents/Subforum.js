/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../../store/actions/Subforum";

import "./subForum.css";
import "../../Common/common.css";
import SubforumFilter from "./SubforumFilter";
import SubforumPost from "./SubforumPost";

const Subforum = () => {
	const isLoadingPosts = useSelector((state) => state.Subforum.isLoadingPosts);
	const posts = useSelector((state) => state.Subforum.posts);
	const dispatch = useDispatch();
	const pathname = window.location.pathname;
	const subForumName = pathname.split("/")[2];

  

	useEffect(() => {
		getPosts(dispatch, subForumName, toast);
	}, []);

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			<div className="row m-2 container">
				<div className="col-3 p-1 bg-grey rounded h-25 sticky-top">
					<SubforumFilter/>
				</div>
				<div className="col-9">
					<div className="row">
						<div className="col-8 position-relative">
							<span className="position-absolute bottom-0 left-0">1-20 of 9999 Questions (0% Answered)</span>
						</div>
						<div className="col-4">
							<form>
								<select className="form-select">
									<option>Sort By Popular</option>
								</select>
							</form>
						</div>
					</div>

					<hr />
					{isLoadingPosts ? (
						<h1>still loading...</h1>
					) : (
						posts.map((post, index) => {
							let i = index;
							let postLength = posts.length;
							return (
								<SubforumPost post={post} postsLength={postLength} index={i} key={post.post_id}/>
							);
						})
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Subforum;
