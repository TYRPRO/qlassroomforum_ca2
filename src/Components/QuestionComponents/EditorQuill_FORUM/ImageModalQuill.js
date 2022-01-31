/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from "react";
import { Button, Modal } from "semantic-ui-react";
import CloseIcon from "@mui/icons-material/Close";
import Compressor from "compressorjs";

import axios from "axios";

import "./styles.module.css";
import "./conflict-agreement.css";


const ImageModalQuill = ({ isOpen, setIsOpen, value = null, handleConfirm }) => {

	// eslint-disable-next-line no-unused-vars
	const [selectedFile, set_selectedFile] = useState(value);
	const [imageURL, set_imageURL] = useState("");
	const [fileIsValid, setFileIsValid] = useState(false);

	function uploadMedia(file) {
		const formData = new FormData();
		formData.append("file", file, file.name);
		axios.post("http://localhost:8000/posts/upload_image", formData).then(res => {
			setFileIsValid(true);
			set_imageURL(res.data.media_url);

		}).catch(() => {
			setFileIsValid(false);
		});
	}

	const handleOnChange = useCallback(
		file => {
			try {
				// Handle Input validation Here
				set_selectedFile(file);

				new Compressor(file, {
					quality: 0.4,

					// The compression process is asynchronous,
					// which means you have to access the `result` in the `success` hook function.
					success(result) {
						console.log("Image compressed successfully.");
						uploadMedia(result);
					},
					error(err) {
						console.log(err.message);
						uploadMedia(file);
					},
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
				<div className=' float-end cursor-pointer modal-close'>
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