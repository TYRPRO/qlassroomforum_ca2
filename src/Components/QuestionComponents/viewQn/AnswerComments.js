/* eslint-disable react/prop-types */
import React from "react";
import parseTime from "../../../helperFunctions/parseTime";

function AnswerComment(props) {
	var comment_info = props.comment;
	
	var parsedTime = parseTime(comment_info.response_created_at);

	return (
		<div>
			<small>{comment_info.response} - <span className='text-secondary'>{comment_info.User.first_name}, {parsedTime} </span></small>
			<hr className='mb-1'></hr>
		</div>
	);
}

export default AnswerComment;