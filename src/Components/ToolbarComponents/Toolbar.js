import React from "react";

const Toolbar = () => {
	return (
		<div className="mx-3 mt-3">
			<div className="toolbar d-flex flex-row align-items-center mb-2">
				<div className="d-flex flex-row text-secondary me-4 toolbar_buttons" id="comments">
					<span className="material-icons md-24 me-1">chat_bubble_outline</span>
					<p className="mb-0 fw-bold me-1" id="comment_total"></p>
					<p className="mb-0 fw-bold fs-6">Comments</p>
				</div>
				<div className="d-flex flex-row text-secondary me-4 toolbar_buttons" id="share" defaultValue={"Share Function In Progress"} onClick={(event) => console.log(event.target.value)}>
					<span className="material-icons md-24 me-1">share</span>
					<p className="mb-0 fw-bold me-1" id="comment_total"></p>
					<p className="mb-0 fw-bold fs-6">Share</p>
				</div>
				<div className="d-flex flex-row text-secondary me-4 save post_bookmark toolbar_buttons" id="post_bookmark" onClick={() => console.log("Save Function In Progress")}>
					<span className="material-icons md-24 mx-1">bookmark_border</span>
					<p className="mb-0 fw-bold fs-6">Save</p>
				</div>
			</div>
		</div>
	);
};

export default Toolbar;