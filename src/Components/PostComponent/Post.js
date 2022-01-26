/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Post.css";
import PostVotes from "./PostVotes";
import parseTime from "../../helperFunctions/parseTime";
import AnswersPill from "./AnswersPill";
import Toolbar from "../ToolbarComponents/Toolbar";
import Voting from "./Voting";
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

	function redirect(post_id) {
		window.location.href = `/posts/${post_id}`;
	}

	function extractContent(post_content) {
		let extractedContent = "";
		let skip = false;
		for (let i = 0; i < post_content.length; i++) {
			if (post_content[i] == "<") {
				skip = true;
			}
			else if (post_content[i] == ">") {
				skip = false;
			}
			else if (!skip == true) {
				extractedContent += post_content[i];
			}
		}

		return extractedContent;
	}

	function extractImages(post_content) {
		let current_image_url = "";
		let record = false;
		let image_link_array = [];
		for (var i = 0; i < post_content.length; i++) {
			if (post_content.slice(i, i + 10) == "<img src=\"") {
				i += 9;
				record = true;
				console.log("True recorded");
			}
			else if (post_content[i] == "\"" && record == true) {
				record = false;
				image_link_array.push(current_image_url);
				current_image_url = "";
			}
			else if (record) {
				current_image_url += post_content[i];
			}
		}
		return image_link_array;
	}

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

						<div className="col-9 bg-white p-2">
							<div className="position-relative">
								<a style={{ textDecoration: "none" }} href={"/posts/" + data.post_id} className="d-flex flex-row">
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
								<p className="mt-2 PostBody">{extractContent(data.post_content)}</p>
								<div id={"post_media_" + data.post_id} className="d-flex flex-row mediaDiv pb-3">
									{extractImages(data.post_content).map((image_url, index) => {
										if (index < 2) {
											return (
												<img key={image_url + Math.random(1000)} src={`${image_url}`} className="img-fluid px-1 w-25" style={{ objectFit: "contain" }}></img>);
										}
										else if (index == 2) {
											return <p key={`${data.post_id}_more_images`} className="align-self-end">More Images</p>;
										}

									})}
								</div>
								<div className="d-flex flex-row align-items-baseline">
									<h6 className="Tags">
										<a href={`/subforum/${data.fk_subforum_id}`} className="text-dark text-decoration-none">{data.Subforum.subforum_name}</a>
									</h6>
									<p className="fw-light text-secondary mx-1">•</p>
									<h6 className="Tags">
										<a href={`/subforum/${data.fk_subforum_id}`} className="text-dark text-decoration-none">{data.Grade.grade_name}</a>
									</h6>
									{data.PostLabels.length > 0 && data.PostLabels.map((post_label)=>{
										return (
											<React.Fragment key={`${data.post_id}_${post_label.Label.label_name}`}>
												<p className="fw-light text-secondary mx-1">•</p>
												<h6 className="Tags" key={`${data.post_id}_${post_label.Label.label_name}`}>
													<a className="text-dark text-decoration-none">{post_label.Label.label_name}</a>
												</h6>
											</React.Fragment>

											
										);
									})}
								</div>
							</div>
							<Toolbar />
						</div>
						<div className="col-lg-2 d-flex p-2" onClick={() => redirect(data.post_id)}><AnswersPill answers={data.post_answers_count} isAnswered={data.post_is_answered}/> </div>
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
