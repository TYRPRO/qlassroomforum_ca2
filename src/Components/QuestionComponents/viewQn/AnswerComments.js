function AnswerComment(props) {
	var comment_info = props.comment;
	return (
		<div>
			<small>{comment_info.response} - <span className='text-primary'>Name </span></small>
			<hr className='mb-1'></hr>
		</div>
	)
}

export default AnswerComment;