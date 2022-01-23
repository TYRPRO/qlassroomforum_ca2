import React from "react";
import PropTypes from "prop-types";

const Voting = (props) => {
	Voting.propTypes = {
		post: PropTypes.object
	};
	const post = props.post;

	//Upvoting function and downvoting function here

	return (
		<React.Fragment>
			<div className="col-1 upvote-section py-2 justify-content-center">
				<a className="text-center d-block py-1 post-upvote" id={`post_upvote_${post.post_id}`} onClick={(event) => console.log(event.target.id)}>
					<i className="fas fa-arrow-up text-dark"></i>
				</a>
				<p id="post_rating" className="text-center mb-0">
					{post.post_rating}
				</p>
				<a className="text-center d-block py-1 post-downvote" id={`post_downvote_${post.post_id}`} onClick={(event) => console.log(event.target.id)}>
					<i className="fas fa-arrow-down text-dark"></i>
				</a>
			</div>
		</React.Fragment>
	);
};

export default Voting;