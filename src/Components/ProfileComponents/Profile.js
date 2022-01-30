/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../store/actions/Common";
import { ToastContainer, toast, Slide } from "react-toastify";
import { handleTabsSelection } from "../../store/actions/Profile";

import "react-toastify/dist/ReactToastify.css";
import { css } from "@emotion/react";
import "./profile.css";
import ProfileEdit from "./ProfileEdit";
import ProfilePassword from "./ProfilePassword";
import ProfileLogout from "./ProfileLogout";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  top: 28vh;
`;

const Profile = () => {
	const dispatch = useDispatch();
	const selectedTab = useSelector((state)=>state.Profile.selectedTab);

	function handleTabSelection(tab) {
		if (tab == "editprofile") {
			document.getElementById(tab).classList.add("active");
			document.getElementById("managepassword").classList.remove("active");
			document.getElementById("logout").classList.remove("active");

		} else if (tab == "managepassword") {
			document.getElementById(tab).classList.add("active");
			document.getElementById("logout").classList.remove("active");
			document.getElementById("editprofile").classList.remove("active");
		} else {
			document.getElementById(tab).classList.add("active");
			document.getElementById("editprofile").classList.remove("active");
			document.getElementById("managepassword").classList.remove("active");
		}
		dispatch(handleTabsSelection(tab));
	}

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="light" pauseOnFocusLoss draggable pauseOnHover />
			<div className="container">
				<div className="flex-grow-1 mt-5">
					<ul id="tabs" className="nav nav-tabs d-flex">
						<div className="active mx-xl-4 mx-3" id="editprofile">
							<button href="#home" className="p-2 py-3" onClick={() => handleTabSelection("editprofile")}>Edit Profile</button>
						</div>
						<div className="mx-xl-4 mx-3 text-center" id="managepassword">
							<button href="#menu1" className="p-2 py-3" onClick={() => handleTabSelection("managepassword")}>Manage Password</button>
						</div>
						<div className="mx-xl-4 mx-3 text-center" id="logout">
							<button href="#menu2" className="p-2 py-3" onClick={() => handleTabSelection("logout")}>Log Out</button>
						</div>
					</ul>

					<div className="tab-content mt-3">
						{selectedTab == "editprofile" ? <ProfileEdit toast={toast}/> : selectedTab == "managepassword" ? <ProfilePassword toast={toast}/> : <ProfileLogout/>}
					</div>
				</div>
			</div>
			
			
		</React.Fragment>
	);
};

export default Profile;