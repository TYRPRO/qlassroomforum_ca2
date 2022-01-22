/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../Common/common.css";
import { updateTitle, updateDescription } from "../../store/actions/CreateSubforum";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const CreateSubforum = () => {

	const subforum_name = useSelector((state) => state.CreateSubforum.subforum_name);
	const subforum_description = useSelector((state) => state.CreateSubforum.subforum_description);
	const dispatch = useDispatch();

	function submitCreateSubforum() {
		let emptyErrMsg = ["", " cannot be empty! "];
		let lengthErrMsg = "";
		let emptyErrored = false;
		let lengthErrored = false;

		function addEmptyErrMsg(emptyFieldName) {
			emptyErrMsg[0] += emptyFieldName;
			emptyErrored = true;
		}

		function addLengthErrMsg(messageString) {
			lengthErrMsg += messageString;
			lengthErrored = true;
		}
		try {
			//Empty Fields Check
			if (subforum_name.trim().length === 0) {
				addEmptyErrMsg("Subforum Name");
			}
			if (subforum_description.trim().length === 0) {
				emptyErrored ? (emptyErrMsg[0] += ", Subforum Description") : addEmptyErrMsg("Subforum Description");
			}
			emptyErrMsg[0] += emptyErrMsg[1];

			//Character Limit Check
			if (subforum_name.length > 45) {
				addLengthErrMsg("Subforum Name cannot exceed 45 characters");
			}
			if (subforum_description.length > 100) {
				lengthErrored ? (lengthErrMsg += " and Subforum Description cannot exceed 100 characters") : addLengthErrMsg("Subforum Description cannot exceed 100 characters");
			}
			lengthErrMsg += "!";

			if (emptyErrored && lengthErrored) {
				toast.warn(emptyErrMsg[0] + lengthErrMsg);
			} else if (emptyErrored) {
				toast.warn(emptyErrMsg[0]);
			} else if (lengthErrored) {
				toast.warn(lengthErrMsg);
			} else {
				let data = JSON.stringify({
					"fk_user_id": "188f0115-4d0c-4e88-a81c-1f107903ddd8",
					"subforum_name": subforum_name,
					"subforum_description": subforum_description
				});
				toast.promise(
					new Promise((resolve, reject) => {
						axios
							.request({
								method: "post",
								url: `http://localhost:8000/subforum/create`,
								headers: {
									"content-type": "application/json; charset=utf-8",
								},
								data: data
							})
							.then((data) => {
								resolve(true);
							})
							.catch((error) => {
								reject(error.response.data.Error);
							});
					}),
					{
						pending: "Creating Subforum...",
						success: "Subforum created! Redirection in progress",
						error: {
							render({ data }) {
								return `${data}`;
							},
						},
					}
				);
			}
		} catch {
			toast.warn("Unexpected Error Occured.");
		}
	}

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			<div className="container-xxl p-3">
				<div className="row">
					<div className=" col-lg-8">
						<form className="border shadow-sm">
							<div className="px-3 pt-3">
								<h5>Create a new Subforum</h5>
								<div className="form-floating mb-3">
									<input type="text" className="form-control" id="create_subforum_name" placeholder="Name your subforum" onChange={(event) => dispatch(updateTitle(event.target.value))}></input>
									<label className="text-secondary" htmlFor="create_subforum_name">
										Subforum Name
									</label>
								</div>
								<div className="form-floating mb-3">
									<input type="text" className="form-control" id="create_subforum_description" placeholder="Subforum description" onChange={(event) => dispatch(updateDescription(event.target.value))}></input>
									<label className="text-secondary" htmlFor="create_subforum_name">
										Subforum Description
									</label>
								</div>
							</div>

							<div className="d-flex flex-row py-2 bg-grey" id="create_community_footer">
								<div className="flex-grow-1"></div>
								<input type="button" id="create_subforum_cancel" value="Cancel" className="btn btn-danger me-3" onClick={() => console.log("Homepage in progress")} />
								<input type="button" id="create_subforum_submit" value="Submit" className="btn btn-dark me-3" onClick={() => submitCreateSubforum()} />
							</div>
						</form>
					</div>
					<div className="col-lg-4 border">
						<div className="bg-white">
							<div className="bg-white mb-2 body-borders rounded p-3">
								<h5 className="text-scheme fw-bold">Subforum Guidelines</h5>
								<hr className="mt-2" />
								<ul className="list-group list-group-flush">
									<li className="list-group-item">
										1. <span className="fw-bold"> Make sure the Subforum you are creating doesn't overlap with another Subforum's topic.</span>
									</li>
									<li className="list-group-item">
										2. <span className=""> Subforums here should be created for educational purposes.</span>
									</li>
									<li className="list-group-item">
										3. <span className=""> Discussion of politics are strictly prohibited (Other than historic events).</span>
									</li>
									<li className="list-group-item">
										4. <span className=""> Ensure that your Subforum name is appropriate.</span>
									</li>
									<li className="list-group-item">
										5. <span className=""> Ensure that your Subforum description is appropriate.</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default CreateSubforum;
