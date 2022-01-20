import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';

import './styles.module.css';
import styles from './styles.module.css';
import './conflict-agreement.css'

import 'semantic-ui-css/semantic.min.css'
import MathView from 'react-math-view';
import katex from 'katex';

const LaTexModalQuill = ({ isOpen, setIsOpen, value = '', handleConfirm }) => {
	const [latexIsValid, setLatexIsValid] = useState(true);
	const modalRef = useRef(null);
	const latexRef = useRef(null);

	const handleOnChange = useCallback(
		latex => {
			try {
				if (!latex.trim()) {
					setLatexIsValid(false);
				} else {
					katex.__parse(latex);
					setLatexIsValid(true);
				}
			} catch (e) {
				setLatexIsValid(false);
			}
		},
		[setLatexIsValid]
	);

	return (
		<Modal
			ref={modalRef}
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
			<Modal.Header className={styles.LaTexModalHeader}>
				Insert LaTex
			</Modal.Header>
			<Modal.Content>
				<LaTexComponent
					modalRef={modalRef}
					latexRef={latexRef}
					value={value}
					handleOnChange={handleOnChange}
				/>
			</Modal.Content>
			<Modal.Actions className={styles.LaTexModalActions}>
				<Button
					onClick={() => {
						handleConfirm(latexRef.current?.getValue('latex'));
						setIsOpen(false);
					}}
					disabled={!latexIsValid}
					className={`${styles.YesButton} ${styles.LaTexActionButton}`}
				>
					Save
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default LaTexModalQuill;

const LaTexComponent = ({ modalRef, latexRef, value, handleOnChange }) => {
	const handleOnFocus = useCallback(() => {
		if (modalRef.current) {
			if (modalRef.current.dimmerRef.current) {
				if (modalRef.current.dimmerRef.current.style.zIndex !== 5)
					modalRef.current.dimmerRef.current.style.zIndex = 5;
			}
		}
		latexRef.current?.executeCommand('showVirtualKeyboard');
	}, [modalRef, latexRef]);

	useEffect(() => {
		latexRef.current?.focus();
	}, [latexRef]);

	return (
		<MathView
			ref={latexRef}
			className={'border'}
			defaultValue={value}
			virtualKeyboardMode="auto"
			defaultMode="math"
			onFocus={handleOnFocus}
			onChange={() => {
				handleOnChange(latexRef.current?.getValue('latex'));
			}}
		/>
	);
};
