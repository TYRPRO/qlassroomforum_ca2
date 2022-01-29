import React from "react";
import "../../Common/common.css";

const notAnsweredClassess = "d-flex align-items-center p-2 rounded-pill cursor-pointer user-select-none  btn-sm text-center";
const hasAnswers = notAnsweredClassess;
const answeredClasses = notAnsweredClassess + " border bg-light-green";
const unansweredText = "text-center align-middle px-3 small-text";

const AnswersPill = (props) => {
	const answers = props.answers;
	const isAnswered = props.isAnswered;
	return (
		<div className="d-flex align-items-center">
			<button className={isAnswered ? answeredClasses : answers > 0 ? hasAnswers : notAnsweredClassess} onClick={() => { console.log("action for answers click in progress"); }}>
				{isAnswered ? <span className="material-icons-outlined btn-outline-primary disable-pointer-events">mark_chat_read</span> : 
					answers > 0 ? <span className="material-icons btn-outline-success disable-pointer-events">chat_bubble_outline</span> : <span className="material-icons btn-outline-secondary disable-pointer-events">chat_bubble_outline</span>}
				<span className={isAnswered ? (unansweredText + " text-primary") : (unansweredText + " text-dark")}>{answers}{answers == 1 ? " Answer" : " Answers"}</span>
			</button>
		</div>
	);
};

export default AnswersPill;