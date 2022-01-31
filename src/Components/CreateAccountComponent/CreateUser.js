/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Module Imports
import React from "react";
import axios from "axios";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./signup.css";

//Component Creation
const CreateUser = () => {
	//Defining States

	function addUser() {
		const url = "https://qlassroombackend.herokuapp.com/user/signup";

		// data extraction
		toast.info("Adding new user...");
		var emailRegex = new RegExp("^.+@.+\\..{2,}$");
		var firstname = document.getElementById("firstname").value;
		var lastname = document.getElementById("lastname").value;
		var password = document.getElementById("password").value;
		var email = document.getElementById("email").value;
		var phone_number = document.getElementById("number").value;
		var school = document.getElementById("school").value;
		var dob = document.getElementById("dob").value;
		var gender = document.getElementById("gender").value;

		//create webformdata
		const webFormData = new FormData();
		webFormData.append("first_name", firstname);
		webFormData.append("last_name", lastname);
		webFormData.append("email", email);
		webFormData.append("password", password);
		webFormData.append("phone_number", phone_number);
		webFormData.append("school", school);
		webFormData.append("date_of_birth", dob);
		webFormData.append("gender", gender);
		webFormData.append("image", document.getElementById("image").files[0]);

		//check if required fields are blank
		if (firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || password.trim() == "") {
			console.log("Please fill all the required fields!");
			toast.warn("Input fields cannot be blank!");
		}
		//check if email format is wrong
		else if (!(emailRegex.test(email))) {
			console.log("Please enter a valid email!");
			toast.warn("Please enter a valid email!");
		}
		//call adduser function
		else {
			console.log("Creating user");
			axios
				.post(url, webFormData)
				.then((data) => {
					if (data != null) {
						toast.success("User created successfully.");
						setTimeout(function () {
							window.location.assign("/login");
						}, 2000);
					} else {
						console.log("Error");
						toast.error("Error");
					}
				})
				.catch((err) => {
					console.log(err);
					var error = err.response.status;
					if (error == 500) {
						toast.error("Error creating user!");
					}
					else if (error == 422) {
						toast.error("Account already exists!");
					}
				});
		}

	}

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="light" pauseOnFocusLoss draggable pauseOnHover />
			{/* <wc-toast></wc-toast> */}
			<div className="container-xxl my-md-2">
				<div className="row">

					<div className="col-lg-2"></div>

					<div className="col-lg-8">
						<div className=" container-fluid mt-5">
							<div className="row rounded" id="createUserImage">
								<div className="col-lg-8">

									<img className="mb-3 " id="Qlassroom_Logo" src={require("../../Common/images/QlassroomLogoWOBackground.png")}></img>
									<h5 className="fw-bold" id="SignUp_Text">Sign Up</h5>
									<div className="form-floating mb-3">
										<input className="form-control" id="firstname" rows="1" placeholder="Enter first name"></input>
										<label className="text-secondary">First Name</label>
									</div>

									<div className="form-floating mb-3">
										<input className="form-control" id="lastname" rows="1" placeholder="Enter last name"></input>
										<label className="text-secondary">Last Name</label>
									</div>

									<div className="form-floating mb-3">
										<input className="form-control" id="email" rows="1" placeholder="Enter email"></input>
										<label className="text-secondary">Email</label>
									</div>


									<div className="form-floating mb-3">
										<input type="password" className="form-control" id="password" rows="1"
											placeholder="Enter password"></input>
										<label className="text-secondary">Password</label>
									</div>

									<label htmlFor="image">Select Image for Profile Picture (Optional):</label>
									<input type="file" className="form-control" id="image" name="image" /><br />

									<div className="form-floating mb-3">
										<input className="form-control" id="number" rows="1" type="number" placeholder="Enter phone number"></input>
										<label className="text-secondary">Phone Number</label>
									</div>

									<div className="form-floating mb-3">
										<input className="form-control" id="school" rows="1" placeholder="Enter school name"></input>
										<label className="text-secondary">School</label>
									</div>

									<div className="form-floating mb-3">
										<input className="form-control" id="dob" rows="1" type="date" placeholder="Enter Date of Birth"></input>
										<label className="text-secondary">Date of Birth</label>
									</div>

									<div className="form-floating mb-3">
										<p className="text-secondary pb-0">Gender</p>
										<select name="gender" id="gender">
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
										</select>
									</div>

									<p><span id="msg"></span></p>
									<p><input className="btn invert-scheme fw-bold rounded-pill w-100" type="button" id="signup_button"
										value="Sign up" onClick={() => addUser()} /></p>
									<div id="login_redirect">
										<p className="smaller">
											Already have an account? <a className="links text-decoration-none" href="/login">Log in</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-2"></div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default CreateUser;
