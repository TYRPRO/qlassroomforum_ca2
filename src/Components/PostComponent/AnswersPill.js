import React from "react";

const notAnsweredClassess = "d-flex align-items-center p-2 rounded-pill cursor-pointer user-select-none border";
const AnsweredClasses = notAnsweredClassess + "bg-warning";

const AnswersPill = (props) => {
	const answers = props.answers;
	const isAnswered = props.isAnswered;
	return (
		<div className="w-25 col-3 d-flex align-items-center">
			<div className={isAnswered ? AnsweredClasses : notAnsweredClassess} onClick={() => { console.log("action for answers click in progress"); }}>
				<span className="material-icons">chat_bubble_outline</span>
				<span className="text-center align-middle px-3">{answers} Answers</span>
			</div>
		</div>
	);
};

export default AnswersPill;