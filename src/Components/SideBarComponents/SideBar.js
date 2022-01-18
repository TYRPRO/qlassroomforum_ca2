// Module Imports
import React from "react";
// import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "./sidebar.css";

//Component Creation
const SideBar = () => {

	return (
		<React.Fragment>
			<div className="d-flex flex-column align-items-start bg-dark" id="layer1">
				<div className="bg-info mt-4 mx-auto" id="home" tabIndex="0"></div>
				<div className="bg-primary mt-3 mx-auto" id="help"></div>
				<div className="bg-light mt-auto mb-3 mx-auto" id="help"></div>
			</div>
			<div className="bg-secondary d-flex flex-column align-items-start" id="layer2">
				<div className="bg-info mt-5 mx-auto" id="forum"></div>
				<div className="bg-primary mt-3 mx-auto" id="chat"></div>
				<div className="bg-light mt-3 mx-auto" id="blog"></div>
			</div>
		</React.Fragment>
	);
};

export default SideBar;