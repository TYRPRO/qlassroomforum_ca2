/* eslint-disable no-unused-vars */
// Module Imports
import React from "react";
import axios from "axios";

import { ToastContainer, toast, Slide } from "react-toastify";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import firebase from "firebase/app";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./login.css";

//Component Creation
const Login = () => {
	//Defining States
	const baseUrl = [process.env.REACT_APP_BASEURL1, process.env.REACT_APP_BASEURL2];

	const firebaseConfig = {
		apiKey: "AIzaSyBEwuqlwjZNbQ5E20xt7FDLlE2EBs1t1eE",
		authDomain: "qlassroom-auth.firebaseapp.com",
		projectId: "qlassroom-auth",
		storageBucket: "qlassroom-auth.appspot.com",
		messagingSenderId: "829869696750",
		appId: "1:829869696750:web:e8fcb848049b3fc37435ff",
		measurementId: "G-W7WJQXDX8J"
	};

	const app = initializeApp(firebaseConfig);
	const provider = new GoogleAuthProvider();

	const auth = getAuth();

	function login() {
		const url = `http://localhost:8000/user/api/login`;
		let email = document.getElementById("email").value;
		let pwd = document.getElementById("pwd").value;

		let data = {
			email: email,
			password: pwd
		};

		toast.promise(new Promise((resolve, reject) => {
			axios.post(url, data).then((data) => {
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
		}
		), {
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
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="light" pauseOnFocusLoss draggable pauseOnHover />
			{/* <wc-toast></wc-toast> */}
			<div className="container-xxl my-md-2">
				<div className="row">
					<div className="container-fluid mt-5 d-flex flex-row">
						<div className="col-lg-5 p-5">
							<img className="mb-3 " id="Qlassroom_Logo" src={require("../../Common/images/QlassroomLogoWOBackground.png")}></img>
							<h5 className="fw-bold pb-4" id="SignIn_Text">Sign in to your Account</h5>

							<form id="login-form" onSubmit={() => login()}>
								<div className="form-floating mb-3">
									<input type="text" className="form-control" id="email" name="email" placeholder="Email"
										required="required" />
									<label htmlFor="email" className="text-secondary">Email</label>
								</div>
								<div className="form-floating mb-3">
									<input type="password" className="form-control" id="pwd" name="pwd"
										placeholder="Password" required="required" onKeyPress={(event) => event.key === "Enter" && login()}/>
									<label htmlFor="lname" className="text-secondary">Password</label>
								</div>
								<div onClick={signInWithGoogle} id="firebaseui-auth-container" className="mb-3 d-flex flex-row align-items-center border bg-white rounded shadow-sm cursor-pointer">
									<img src={require("./google-icon.png")} className="mx-3" id="google_icon"></img>
									<div className="border-start flex-grow-1">
										<p className="mb-0 py-3 text-center">Sign in with Google</p>
									</div>
								</div>
								<a href="#" className="links text-decoration-none">Forgot Password?</a>
								<a className="btn invert-scheme fw-bold rounded-pill w-100 mb-2 mt-4" id="login_button" onClick={() => login()}>Log in</a>
								<div id="messages"></div>
								<p>Need an account? <a href="/signup" className="links text-decoration-none">Register Now!</a></p>

							</form>
						</div>
						<div className="col-lg-2 d-none d-xl-block">

						</div>
						<div className="col-lg-6 d-none d-xl-block">
							<img className="mb-3 " id="Qlassroom_Image" src={require("../../Common/images/login_image.png")}></img>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);


	function signInWithGoogle() {

		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const user = result.user;
				axios.post("http://localhost:8000/user/checkUserExists", {
					google_uuid: user.uid
				}).then(function (response) {
					toast.promise(new Promise((resolve, reject) => {
						if (response.data.Results == "User doesn't exist.") {
							console.log("User doesn't exist");
							// Register User
							axios.post("http://localhost:8000/user/signup", {
								first_name: user.displayName,
								last_name: "",
								email: user.email,
								google_uuid: user.uid,
								oAuthAddition: "True"
							}).then(function (response) {
								// Assign Cookie and bring to home page.
								axios.post("http://localhost:8000/user/api/login", {
									OAuthId: user.uid,
									email: user.email
								}).then(function (response) {
									//upload token to cookies
									resolve();
									document.cookie = ("token=" + response.data.token + ";");
									window.location.assign("/home");
								}).catch(function (error) {
									console.log(error);
									reject(error.reponse.data.err);
								});

							}).catch(function (error) {
								console.log(error);
								reject(error.response.data.err);
							});
						}
						else {
							// Login User
							console.log("User exists");
							axios.post("http://localhost:8000/user/api/login", {
								OAuthId: user.uid,
								email: user.email
							}).then(function (response) {
								//upload token to cookies
								resolve();
								document.cookie = ("token=" + response.data.token + ";");
								window.location.assign("/home");
							}).catch(function (error) {
								console.log(error);
								reject(error.response.data.err);
							});

						}

					}), {
						pending: "Authenticating...",
						success: "Authentication Successful!",
						error: {
							render({ data }) {
								return `${data}`;
							}
						}
					});

				}).catch(function (error) {
					console.log(error);
				});


			}).catch((error) => {

				toast.success("Google Authentication Failed!");

				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.email;
				const credential = GoogleAuthProvider.credentialFromError(error);
				console.log(errorCode);
				console.log(errorMessage);
				console.log(email);
				console.log(credential);
			});
	}
};

export default Login;
