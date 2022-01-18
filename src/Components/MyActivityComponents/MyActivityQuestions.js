import React from "react";

const Question = (props) => {
    return (
        <div className="post rounded mb-2 bg-white" id={props.id}>
            <div className="row g-0">
                <div className="col-1 upvote-section py-1 justify-content-center align-self-center">
                    <a className="text-center d-block" id="post1-upvote"><i
                        className="fas fa-caret-up text-dark fs-3"></i></a>
                    <p id="post#-val" className="text-center mb-0">{props.votes}</p>
                    <a className="text-center d-block" id="post1-downvote"><i
                        className="fas fa-caret-down text-dark fs-3"></i></a>
                </div>
                <div className="col-11 p-3">
                    <h5>{props.title}</h5>
                    <div className="d-flex flex-row align-items-baseline pt-2">
                        <p className="text-secondary" id="post#_time">{props.date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Question;
