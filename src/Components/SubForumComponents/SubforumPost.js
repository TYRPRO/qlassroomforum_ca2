/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Toolbar from "../ToolbarComponents/Toolbar";
import parseTime from "../../helperFunctions/parseTime";
import AnswersPill from "./SubforumAnswersPill";

const SubforumPost = (props) => {
	const tags = useSelector((state) => state.Subforum.tags);
	const post = props.post;
	const postsLength = props.postsLength;
	const index = props.index;
	const answers = 3;
	console.log(props.postsLength);
	return (
		<div className="position-relative px-3" key={post.post_id}>
			<div className="row">
				<div className="post mb-2 col-9">
					<div className="row g-0">
						<div className="col-1 upvote-section py-2 justify-content-center">
							<a className="text-center d-block py-1 post-upvote" id="post_upvote" onClick={() => console.log("Handle Upvote In Progress")}>
								<i className="fas fa-arrow-up text-dark"></i>
							</a>
							<p id="post_rating" className="text-center mb-0">
								{post.Post_Votes}
							</p>
							<a className="text-center d-block py-1 post-downvote" id="post_downvote" onClick={() => console.log("Handle Downvote In Progress")}>
								<i className="fas fa-arrow-down text-dark"></i>
							</a>
						</div>
						<div className="col-11 bg-white px-2">
							<h4 id="post_title" className="mb-0">
								{post.title}
							</h4>
							<div className="d-flex flex-row align-items-baseline" id="post_info">
								<p className="d-inline text-secondary me-1">Posted by</p>
								<p className="d-inline text-secondary clickable-link">
									{" "}
                  u/<a id="post_username">{post.User.username}</a>
								</p>
								<p className="fw-light text-secondary mx-1">•</p>
								<p className="text-secondary" id="post_timeAgo">
									{parseTime(post.created_at)}
								</p>
							</div>

							<div id="post_media" className="d-flex flex-row justify-content-center mediaDiv"></div>

							<div id="tags" className="d-flex">
								{tags.map((tag) => {
									return (
										<div key={tag.tag_id}>
											<p className="mx-2 px-3 bg-success rounded-pill text-light">{tag.tag_name}</p>
										</div>
									);
								})}
							</div>
							<Toolbar />
						</div>
					</div>
				</div>
				<AnswersPill answers={answers}/>
			</div>

			{index < postsLength - 1 && <hr />}
		</div>
	);
};

export default SubforumPost;
