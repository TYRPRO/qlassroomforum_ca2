/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../store/actions/Common";
import { getProfile, populateProfile, editEmail, editFirstName, editLastName, oldPasswordEntry, newPasswordEntry, reenterNewPasswordEntry, setImageFile } from "../../store/actions/Profile";
import { getUserProfilePic } from "../../store/actions/Common";
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

const ProfileEdit = (props) => {
	const isLoadingProfile = useSelector((state) => state.Profile.isLoadingProfile);
	const first_name = useSelector((state) => state.Profile.first_name);
	const last_name = useSelector((state) => state.Profile.last_name);
	const profile_pic = useSelector((state) => state.Profile.profile_pic);
	const email = useSelector((state) => state.Profile.email);
	const old_password = useSelector((state) => state.Profile.old_password);
	const file = useSelector((state) => state.Profile.file);
	const new_password = useSelector((state) => state.Profile.new_password);
	const reenter_new_password = useSelector((state) => state.Profile.reenter_new_password);
	const dispatch = useDispatch();

	const toast = props.toast;

	useEffect(() => {
		getProfile(dispatch, toast);
	},[]);

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}

	function submitProfileEdits() {
		let webFormData = new FormData();
		webFormData.append("email", email);
		webFormData.append("first_name", first_name);
		webFormData.append("last_name", last_name);
		webFormData.append("profile_pic", profile_pic);
		webFormData.append("password", old_password);

		try{
			if(file){
				new Compressor(file[0], {
					quality: 0.4,

					// The compression process is asynchronous,
					// which means you have to access the `result` in the `success` hook function.
					success(result) {
						console.log("Image compressed successfully.");
						console.log(result);
						webFormData.append("file", result, result.name);
						submitAxios(webFormData);
					},
					error(err) {
						console.log(err.message);
						console.log(file[0]);
						webFormData.append("file", file[0], file[0].name);
						submitAxios(webFormData);
					},
				});
			}
		}
		catch(error){
			console.log(error);
		}
	}

	function submitAxios(webFormData){
		var token = findCookie("token");
		toast.promise(
			new Promise((resolve, reject) => {
				axios.put("http://localhost:8000/user/profile", webFormData, {
					headers: { authorization: "Bearer " + token }
				}).then(function (response) {
					resolve();
					getProfile(dispatch, toast);
					getUserProfilePic(dispatch);
					console.log(response);
				}).catch(function (error) {
					console.log(error);
					reject(error.response.data.message);
				});
			}),
			{
				pending: "Saving Changes...",
				success: "Changes Saved!",
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
			{isLoadingProfile ? <HashLoader color={"#a5c1e8"} loading={isLoadingProfile} css={override} size={150} /> :
				<div className="p-2">
					<form>
						<div className="form-group">
							<div className="row d-flex">
								<div className="justify-content-center d-flex my-3">
									<img src={profile_pic} className="profile-pic py-1">
									</img>
								</div>
								<div className="col-12">
									<label className='mt-3 mb-1 fw-bold'>Upload Image</label>
									<input type="file" className="form-control" id="profile_pic_upload" onChange={(event)=>dispatch(setImageFile(event.target.files))}/>
								</div>
								<div className="col-12 col-md-6">
									<label className='mt-3 mb-1 fw-bold'>First Name</label>
									<input onChange={(event)=>dispatch(editFirstName(event.target.value))} type="text" name='first_name' className='form-control' defaultValue={first_name}></input>
								</div>
								<div className="col-12 col-md-6">
									<label className='mt-3 mb-1 fw-bold'>Last Name</label>
									<input onChange={(event)=>dispatch(editLastName(event.target.value))} type="text" name='last_name' className='form-control' defaultValue={last_name}></input>
								</div>
								<div className="col-12">
									<label className='mt-3 mb-1 fw-bold'>Email</label>
									<input onChange={(event)=>dispatch(editEmail(event.target.value))} type="text" name='email' className='form-control' defaultValue={email}></input>
								</div>
								<div className="col-12">
									<label className='mt-3 mb-1 fw-bold'>Enter Password To Save Changes</label>
									<input onChange={(event)=>dispatch(oldPasswordEntry(event.target.value))} type="password" name='old_password' className='form-control'></input>
								</div>
							</div>
						</div>
					</form>
					<div className="d-flex flex-row">
						<button onClick={() => { window.location.reload() }} className="btn btn-primary shadow-sm mt-4">Undo edits</button>
						<div className="flex-grow-1"></div>
						<button onClick={()=>{submitProfileEdits();}} className='btn btn-success shadow-sm mt-4'>Save changes</button>
					</div>
				</div>
			}
		</React.Fragment>
	);
};

export default ProfileEdit;