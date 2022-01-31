// Module Imports
import React, { useEffect } from "react";
import {
	Link
} from "react-router-dom";
// import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./sidebar.css";
import avatar from "./img_avatar.png";

import {getUserProfilePic} from "../../store/actions/Common";
import { useSelector, useDispatch} from "react-redux";

//Component Creation
const SideBar = () => {	
	const profile_pic = useSelector((state)=>state.Common.profile_pic);
	const isLoadingImage = useSelector((state)=>state.Common.isLoadingImage);
	const dispatch = useDispatch();

	function imgRedirect() {
		window.location.assign("/myprofile");
	}

	useEffect(()=>(
		getUserProfilePic(dispatch)
	),[]);

	return (
		<React.Fragment>
			<div className="d-flex flex-column" id="sidebarfiller"></div>
			<div className="d-flex flex-column fixed-top" id="layer1">
				<div className="d-flex flex-column">
					<div className="mt-4 mx-auto text-center" id="home" tabIndex="0">
						<span className="material-icons ms-0 me-1 text-light fs-2">laptop_chromebook</span>
					</div>
					<div className="mt-3 mx-auto text-center" id="help">
						<span className="material-icons ms-0 me-1 text-light fs-2">help_outline</span>
					</div>
					<div className="mt-auto mb-3 mx-auto text-center" id="profile">
						{isLoadingImage ? <img onClick={() => imgRedirect()} src={avatar} className="img-thumbnail rounded-circle w-75"/> : <img onClick={() => imgRedirect()} src={profile_pic} className="img-thumbnail rounded-circle w-75"/>}
					</div>
				</div>
			</div>
			<div className="d-flex flex-column" id="layer2">
				<div className="mt-5 mx-auto" id="forum">
					<span className="material-icons ms-0 me-1 ms-2 text-secondary fs-1">receipt_long <Link to="/home" className="align-top text-dark lh-lg">FORUM</Link></span>
				</div>
				<div className="mt-3 mx-auto" id="chat">
					<span className="material-icons ms-0 me-1 ms-2 text-secondary fs-1">poll <Link to="/createqn" className="align-top text-dark lh-lg">CHAT</Link></span>
				</div>
				<div className="mt-3 mx-auto" id="blog">
					<span className="material-icons ms-0 me-1 ms-2 text-secondary fs-1">poll <Link to="" className="align-top text-dark lh-lg">BLOG</Link></span>
				</div>
			</div>
		</React.Fragment>
	);
};

export default SideBar;