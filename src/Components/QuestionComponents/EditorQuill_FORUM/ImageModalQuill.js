import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';


import axios from 'axios';

import './styles.module.css';
import './conflict-agreement.css'

import 'semantic-ui-css/semantic.min.css'

const ImageModalQuill = ({ isOpen, setIsOpen, value = null, handleConfirm }) => {

	const [selectedFile, set_selectedFile] = useState(value);
	const [imageURL, set_imageURL] = useState('');
	const [fileIsValid, setFileIsValid] = useState(false);

	const handleOnChange = useCallback(
		file => {
			try {
				// Handle Input validation Here
				set_selectedFile(file);

				const formData = new FormData();
				formData.append('file', file);
				axios.post('http://localhost:8000/posts/upload_image', formData).then(res => {
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
			className={'forum-modal'}
			closeIcon={
				<div className='d-flex flex-row m-2'>
					<div className='flex-grow-1'></div>
					<Icon
						name="times circle outline"
						size="large"
						className='ms-auto'
					/>
				</div>

			}
		>
			<Modal.Header>
				Insert Image
			</Modal.Header>
			<Modal.Content>
				<input type={'file'} onChange={(e) => handleOnChange(e.target.files[0])} />
			</Modal.Content>
			<Modal.Actions>
				<Button
					onClick={() => {
						handleConfirm(imageURL);
						setIsOpen(false);
					}}
					disabled={!fileIsValid}
				// className={`${styles.YesButton} ${styles.LaTexActionButton}`}
				>
					Save
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default ImageModalQuill