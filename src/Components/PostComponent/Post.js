/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Post.css";
import PostVotes from "./PostVotes";
import parseTime from "../../helperFunctions/parseTime";
const Post = (props) => {
	// Takes in a prop of "Posts" as an array
	Post.propTypes = {
		Posts: PropTypes.array
	};

	// Missing items
	// Line 19 to add Voting component
	// Line 26 to replace span for profile picture
	// Line 43 to add answer component
	// Line 19 optional to remove math.random function for key, used it to test pagination

	return <div>
		{props.Posts.length >= 1 ?
			props.Posts.map((data) => (
				<div key={data.post_id + Math.random(1000)} className="post rounded mb-2 border-top border-bottom" id={"post_" + data.post_id}>
					<div className="row g-0">
						<PostVotes
							key={"vote_" + data.post_id}
							user_id={data.fk_user_id}
							post_id={data.post_id}
							post_rating={data.post_rating}
						/>
						<div className="col-9 bg-white p-2 position-relative">
							<a style={{ textDecoration: "none" }} href={data.fk_subforum_id + "/" + data.post_id} className="d-flex flex-row">
								<h5 style={{ color: "black" }} id={"post_" + data.post_id + "_content"} className="mb-0">{data.post_title}</h5>
								<div className="d-flex flex-row">

								</div>
							</a>
							<div className="d-flex flex-row align-items-baseline">
								<span className="Add Profile Picture Here"></span><p className="d-inline text-secondary me-1">Posted by <a>{data.User.first_name}</a></p>
								<p className="d-inline text-secondary clickable-link" id={"post_" + data.fk_user_id}></p>
								<p className="fw-light text-secondary mx-1">•</p>
								<p className="text-secondary" id={"post_" + data.post_id + "_time"}>{parseTime(data.post_created_at)}</p>
							</div>
							<p className="mt-2 PostBody">{data.post_content}</p>
							<div id={"post_media_" + data.post_id} className="d-flex flex-row justify-content-center mediaDiv">  </div>
							<div className="d-flex flex-row align-items-baseline">
								<h6 className="Tags">
									<a href={data.fk_subforum_id} className="text-dark text-decoration-none">{data.Subforum.subforum_name}</a>
								</h6>
								<p className="fw-light text-secondary mx-1">•</p>
								<h6 className="Tags">
									<a href={data.fk_subforum_id} className="text-dark text-decoration-none">{data.Grade.grade_name}</a>
								</h6>
							</div>
						</div>
						<div className="col-lg-2">Answers</div>
					</div>
				</div>
			))
			:
			<div>
				<h1 className="mx-auto">There are currently no posts for this subject</h1>
			</div>}
	</div>;
};

export default Post;
