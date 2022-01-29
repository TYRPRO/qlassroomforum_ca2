/* eslint-disable no-unused-vars */
// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios"; //npm i axios
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
// import "./activity.css";

//Component Creation
const Report = () => {

	// State Creation

	// const [updatesreceived, setUpdatesReceived] = useState(0);
	// const [answersposted, setAnswersPosted] = useState(0);
	// const [answersaccepted, setAnswersAccepted] = useState(0);
	// const [upvotesgiven, setUpvotesGiven] = useState(0);


	// function getUpdatesReceived() { }

	// function getAnswersPosted() { }

	// function getAnswersAccepted() { }

	// function getUpvotesGiven() { }

	// Retrieves Page Content

	// useEffect(() => , []);


	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="light" pauseOnFocusLoss draggable pauseOnHover />
			{/* Report Modal */}
			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Report Post</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form>
								<div className="mb-3">
									<label htmlFor="exampleInputEmail1" className="form-label">What is wrong with this post?</label>
									<textarea className="form-control" aria-label="With textarea"></textarea>
								</div>
								<button type="submit" className="btn btn-primary">Submit</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Report;