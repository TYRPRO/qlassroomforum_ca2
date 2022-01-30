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

const ProfileLogout = (props) => {

	const toast = props.toast;


	return (
		<React.Fragment>
			<div className="p-2">
				<div className="d-flex flex-row justify-content-center">
					<button onClick={()=>window.location.href="/login"} className='btn btn-danger shadow-sm mt-4'>Log Out</button>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ProfileLogout;