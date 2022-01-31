/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios"; //npm i axios
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../store/actions/Common";

//File Imports (CSS/Images)
import "./report.css";

//Component Creation
const Report = () => {
	//Logged In User States
	const acquireData = useSelector((state) => state.Common.acquireData);
	const userDetails = useSelector((state) => state.Common.userDetails);
	const dispatch = useDispatch();

	function createReport() {
		var token = findCookie("token");

		var report_content = document.getElementById("report_content").value;

		var queryParams = new URLSearchParams(window.location.search);
		var post_id = queryParams.get("post_id");

		axios.post("https://qlassroombackend.herokuapp.com/report/report",
			{
				report_content: report_content,
				fk_post_id: post_id,
				fk_response_id: null,
				fk_user_id: userDetails.user_id
			},
			{
				headers: {
					"Authorization": "Bearer " + token
				}
			})
			.then(response => {
				toast.success("Report submitted successfully.");
				setTimeout(function () {
					window.location.assign("/posts/" + post_id);
				}, 2000);
			})
			.catch((err) => {
				toast.success("Error in submitting report!");
				console.log(err);
			});
	}

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}

	useEffect(() => getUserDetails(dispatch), []);

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="light" pauseOnFocusLoss draggable pauseOnHover />
			{/* Report Modal */}
			<div className="container-xxl my-md-4">
				<h4 className="fw-bold text-scheme">Report Post</h4>
				<form>
					<div className="pt-3">
						<h5>Write your Report</h5>
						<textarea className="form-control" placeholder="What's wrong with the post?"
							id="report_content" style={{ "height": "100px" }} ></textarea>

						<div className="mt-5">
							<input type="button" id="report_post_cancel" value="Cancel"
								className="btn me-3 rounded-pill"></input>
							<input type="button" id="report_post_submit" value="Submit"
								className="btn btn-dark me-3" onClick={() => createReport()}></input>
						</div>
					</div>
				</form>
			</div>
		</React.Fragment>
	);
};

export default Report;