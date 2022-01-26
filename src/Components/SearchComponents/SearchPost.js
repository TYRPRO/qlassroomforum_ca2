/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./search.css";
import parseTime from "../../helperFunctions/parseTime";
import AnswersPill from "../PostComponent/AnswersPill";
import PostVotes from "../PostComponent/PostVotes";
import Toolbar from "../ToolbarComponents/Toolbar";

const SearchPost = (props) => {

	function redirect(post_id) {
		window.location.href = `/posts/${post_id}`;
	}

	return (
		<div className="post rounded mb-2 border-top border-bottom" id={"post_" + props.post_id}>
			<div className="row g-0">
				<div className="col-10 bg-white p-3">
					<div className="position-relative" onClick={() => redirect(props.post_id)}>
						<a style={{ textDecoration: "none" }} href={props.fk_subforum_id + "/" + props.post_id} className="d-flex flex-row">
							<h5 style={{ color: "black" }} id={"post_" + props.post_id + "_content"} className="mb-0">{props.post_title}</h5>
						</a>
						<div className="d-flex flex-row align-items-baseline">
							<span className="Add Profile Picture Here"></span><p className="d-inline text-secondary me-1">Posted by <a>{props.first_name}</a></p>
							<p className="d-inline text-secondary clickable-link" id={"post_" + props.fk_user_id}></p>
							<p className="fw-light text-secondary mx-1">•</p>
							<p className="text-secondary" id={"post_" + props.post_id + "_time"}>{parseTime(props.post_created_at)}</p>
						</div>

						<div className="d-flex flex-row align-items-baseline">
							<h6 className="Tags">
								<a href={`/subforum/${props.fk_subforum_id}`} className="text-dark text-decoration-none">{props.subforum_name}</a>
							</h6>
							<p className="fw-light text-secondary mx-1">•</p>
							<h6 className="Tags">
								<a href={`/subforum/${props.fk_subforum_id}`} className="text-dark text-decoration-none">{props.grade_name}</a>
							</h6>
						</div>
					</div>
					<Toolbar />
				</div>
				<div className="col-1 d-flex p-2" onClick={() => redirect(props.post_id)}><AnswersPill answers={props.post_answers_count} isAnswered={props.post_is_answered} /> </div>
			</div>
		</div>
	);
};

export default SearchPost;