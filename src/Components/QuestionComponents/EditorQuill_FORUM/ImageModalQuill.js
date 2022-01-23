/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Modal } from "semantic-ui-react";
import CloseIcon from "@mui/icons-material/Close";


import axios from "axios";

import "./styles.module.css";
import "./conflict-agreement.css";


const ImageModalQuill = ({ isOpen, setIsOpen, value = null, handleConfirm }) => {

	const [selectedFile, set_selectedFile] = useState(value);
	const [imageURL, set_imageURL] = useState("");
	const [fileIsValid, setFileIsValid] = useState(false);

	const handleOnChange = useCallback(
		file => {
			try {
				// Handle Input validation Here
				set_selectedFile(file);

				const formData = new FormData();
				formData.append("file", file);
				axios.post("http://localhost:8000/posts/upload_image", formData).then(res => {
					setFileIsValid(true);
					set_imageURL(res.data.media_url);

				}).catch(err => {
					setFileIsValid(false);
				});

			} catch (err) {
				setFileIsValid(false);
			}
		},
		[setFileIsValid]
	);

	return (
		<Modal
			onClose={() => setIsOpen(false)}
			onOpen={() => setIsOpen(true)}
			open={isOpen}
			size='large'
			closeOnDimmerClick={false}
			closeOnEscape={false}
			className={"forum-modal"}
			closeIcon={
				// <div className='d-flex flex-row m-1'>
				// 	<div className='flex-grow-1'></div>
				// 	<CloseIcon/>
				// </div>
				<div className=' float-end'>
					<CloseIcon />
				</div>

			}
		>
			<Modal.Header className='modal-header'>
				
				<h5 className='modal-title'>Insert Image</h5>
			</Modal.Header>
			<Modal.Content className='modal-body'>
				<input className='form-control' type={"file"} onChange={(e) => handleOnChange(e.target.files[0])} />
			</Modal.Content>
			<Modal.Actions className='modal-footer'>
				<Button
					onClick={() => {
						handleConfirm(imageURL);
						setIsOpen(false);
					}}
					className='btn btn-primary'
					disabled={!fileIsValid}
				// className={`${styles.YesButton} ${styles.LaTexActionButton}`}
				>
					Save
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default ImageModalQuill;