/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../store/actions/Common";
import {  oldPasswordEntry, newPasswordEntry, reenterNewPasswordEntry } from "../../store/actions/Profile";
import "react-toastify/dist/ReactToastify.css";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import "./profile.css";
import Compressor from "compressorjs";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  top: 28vh;
`;

const ProfilePassword = (props) => {
	const old_password = useSelector((state) => state.Profile.old_password);
	const new_password = useSelector((state) => state.Profile.new_password);
	const reenter_new_password = useSelector((state) => state.Profile.reenter_new_password);
	const dispatch = useDispatch();

	const toast = props.toast;

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}

	function checkNewPassword(){
		if (new_password != reenter_new_password){
			toast.error("Passwords do not match!");
			return false;
		}
		else if (new_password.trim().length == 0){
			toast.error("Password cannot be empty!");
		}
		else{
			return true;
		}
	}

	function submitPasswordChanges() {
		if (checkNewPassword()){
			var token = findCookie("token");
			toast.promise(
				new Promise((resolve, reject) => {
					axios.put("http://localhost:8000/user/password", {
						new_password,
						old_password
					}, {
						headers: { authorization: "Bearer " + token }
					}).then(function (response) {
						resolve();
						console.log(response);
					}).catch(function (error) {
						console.log(error);
						reject(error.response.data.message);
					});
				}),
				{
					pending: "Changing Password...",
					success: "Password Changed",
					error: {
						render({ data }) {
							return `${data}`;
						},
					},
				}
			);
		}
	}


	return (
		<React.Fragment>
			<div className="p-2">
				<form>
					<div className="form-group">
						<div className="row d-flex">
							<div className="col-12">
								<label className='mt-3 mb-1 fw-bold'>Enter Your Old Password</label>
								<input onChange={(event)=>dispatch(oldPasswordEntry(event.target.value))} type="password" name='old_password' className='form-control'></input>
							</div>
							<div className="col-12">
								<label className='mt-3 mb-1 fw-bold'>Enter Your New Password</label>
								<input onChange={(event)=>dispatch(newPasswordEntry(event.target.value))} type="password" name='new_password' className='form-control'></input>
							</div>
							<div className="col-12">
								<label className='mt-3 mb-1 fw-bold'>Enter Password To Save Changes</label>
								<input onChange={(event)=>dispatch(reenterNewPasswordEntry(event.target.value))} type="password" name='reenter_new_password' className='form-control'></input>
							</div>
						</div>
					</div>
				</form>
				<div className="d-flex flex-row justify-content-center">
					<button onClick={()=>{submitPasswordChanges();}} className='btn btn-success shadow-sm mt-4'>Save changes</button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ProfilePassword;