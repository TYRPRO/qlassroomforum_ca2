/* eslint-disable no-unused-vars */
// Module Imports
import React from "react";
import axios from "axios";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./login.css";

//Component Creation
const Login = () => {
	//Defining States
	const baseUrl = [process.env.REACT_APP_BASEURL1, process.env.REACT_APP_BASEURL2];

	function login() {
		const url = `http://localhost:8000/user/api/login`;
		let email = document.getElementById("email").value;
		let pwd = document.getElementById("pwd").value;

		let data = {
			email: email,
			password: pwd
		};

		toast.promise(new Promise((resolve, reject) => {
			axios.post(url, data)
				.then((data) => {
					if (data != null) {
						//upload token to cookies
						document.cookie = ("token=" + data.data.token + ";");

						resolve(true);
						window.location.assign("/home");
					} else {
						console.log("Unknown error occured!");
						reject("Unknown error occured!");
					}
				})
				.catch((err) => {
					reject(err.response.data.message);
				});
		}),
		{
			pending: "Authenticating...",
			success: "Authentication Successful!",
			error: {
				render({ data }) {
					return `${data}`;
				},
			},
		}
		);
		
	
	}

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			{/* <wc-toast></wc-toast> */}
			<div className="container-xxl my-md-2">
				<div className="row">
					<div className="container-fluid mt-5 d-flex flex-row">
						<div className="column rounded">
							<div className="col-lg-7 p-5">
								<img className="mb-3 " id="Qlassroom_Logo" src={require("../../Common/images/QlassroomLogoWOBackground.png")}></img>
								<h5 className="fw-bold pb-4" id="SignIn_Text">Sign in to your Account</h5>

								<form id="login-form" action="">
									<div className="form-floating mb-3">
										<input type="text" className="form-control" id="email" name="email" placeholder="Email"
											required="required" />
										<label htmlFor="email" className="text-secondary">Email</label>
									</div>
									<div className="form-floating mb-3">
										<input type="password" className="form-control" id="pwd" name="pwd"
											placeholder="Password" required="required" />
										<label htmlFor="lname" className="text-secondary">Password</label>
									</div>
									<a href="#" className="links text-decoration-none">Forgot Password?</a>
									<a className="btn invert-scheme fw-bold rounded-pill w-100 mb-2 mt-4" id="login_button" onClick={() => login()}>Log in</a>
									<div id="messages"></div>
									<p>Need an account? <a href="/signup" className="links text-decoration-none">Register Now!</a></p>

								</form>
							</div>
							<div className="bg-white col-lg-3 rounded-end">

							</div>
						</div>
						<div className="col-lg-6 d-none d-xl-block">
							<img className="mb-3 " id="Qlassroom_Image" src={require("../../Common/images/login_image.png")}></img>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Login;
