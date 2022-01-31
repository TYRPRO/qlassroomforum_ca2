/* eslint-disable react/prop-types */
import React from "react";

const Answer = (props) => {
	return (
		<div className="comment div-shadow rounded mb-1">
			<div className="d-flex flex-row p-2 px-3">
				<p className="text-secondary mb-0 mw-50">u/<span className="clickable-link">{props.username}</span> commented on
					{props.shortTitle == "" ? (
						<span className="text-dark clickable-link" onClick={() => { window.location.href = `/posts/${props.post_id}`; }} style={{ cursor: "pointer" }}> {props.title}</span>
					) : (
						<span className="text-dark clickable-link" onClick={() => { window.location.href = `/posts/${props.post_id}`; }} style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title={props.title}> {props.shortTitle}</span>
					)}
				</p>
				<p className="mb-0 fw-light text-secondary mx-1">•</p>
				<p className="mb-0 d-inline text-secondary me-1">Posted by</p>
				<p className="mb-0 d-inline text-secondary clickable-link" id="post#_user"> u/{props.post_username}</p>
			</div>
			<div className="row mb-2">
				<div className="col-1"></div>
				<div className="col-11">
					{props.shortValue == "" ? (
						<h5 dangerouslySetInnerHTML={{ __html: props.value }}></h5>
					) : (
						<h5 dangerouslySetInnerHTML={{ __html: props.shortValue }}></h5>
					)}
				</div>
			</div>
		</div >
	);
};

export default Answer;