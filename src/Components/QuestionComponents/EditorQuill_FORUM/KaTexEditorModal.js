/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, TextArea } from "semantic-ui-react";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./styles.module.css";
import renderMathInElement from "katex/dist/contrib/auto-render";
import "./conflict-agreement.css";

// import 'semantic-ui-css/semantic.min.css'

const delimiters = [
	{ left: "$$", right: "$$", display: false },
	{ left: "$", right: "$", display: false },
	{ left: "\\(", right: "\\)", display: false },
	// { left: '\\begin{equation}', right: '\\end{equation}', display: true },
	{ left: "\\begin{matrix}", right: "\\end{matrix}", display: false },
	{ left: "\\[", right: "\\]", display: false },
];

const KaTexEditorModal = ({ isOpen, setIsOpen, handleConfirm }) => {
	const katexPreviewRef = useRef();

	const handleConfirmKaTex = useCallback(() => {
		if (katexPreviewRef.current) {
			const childNodes = katexPreviewRef.current.childNodes;
			const ops = [];

			childNodes.forEach((c) => {
				if (c.nodeName.toLowerCase() === "#text") {
					ops.push({ type: "text", value: c.data });
				} else if (c.nodeName.toLowerCase() === "span") {
					const katexSpan = c.querySelector(".katex");
					const katexErrorSpan = c.querySelector(".katex-error");
					if (katexSpan) {
						// is katex
						const annotation = c.querySelector("annotation");
						if (annotation) {
							const annotationChild = annotation.firstChild;
							if (annotationChild.nodeName.toLowerCase() === "#text") {
								const tex = annotationChild.data;
								ops.push({ type: "formula", value: tex });
							}
						}
					} else if (katexErrorSpan) {
						const textChild = katexErrorSpan.firstChild;
						if (textChild.nodeName.toLowerCase() === "#text") {
							const tex = textChild.data;
							ops.push({ type: "formula", value: tex });
						}
					}
				}
			});
			handleConfirm(ops);
		}
	}, [katexPreviewRef]);

	return (
		<Modal
			onClose={() => setIsOpen(false)}
			onOpen={() => setIsOpen(true)}
			open={isOpen}
			className={"forum-modal"}
			closeOnDimmerClick={false}
			closeOnEscape={false}
			closeIcon={

				<div className=' float-end'>
					<CloseIcon />
				</div>
			}
		>
			<Modal.Header className={"modal-header"}>
				<h5 className="modal-title">
				KaTex Editor
				</h5>
			</Modal.Header>
			<Modal.Content className="modal-body">
				<KaTexComponent
					katexPreviewRef={katexPreviewRef}
					isModalOpen={isOpen}
				/>
			</Modal.Content>
			<Modal.Actions className={"modal-footer"}>
				<Button
					onClick={() => {
						handleConfirmKaTex();
						setIsOpen(false);
					}}
					className={`btn btn-primary`}
				>
					Save
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default KaTexEditorModal;

const KaTexComponent = ({ katexPreviewRef, isModalOpen }) => {
	const [textAreaValue, setTextAreaValue] = useState("");
	const textAreaRef = useRef();

	useEffect(() => {
		if (katexPreviewRef.current) {
			renderMathInElement(katexPreviewRef.current, {
				delimiters,
				throwOnError: false,
				errorColor: "#ff0000",
			});
		}
	}, [textAreaValue, katexPreviewRef]);

	useEffect(() => {
		if (isModalOpen) {
			textAreaRef.current?.focus();
		}
	}, [isModalOpen, textAreaRef]);

	return (
		<div className={styles.KaTexComponent}>
			<TextArea
				ref={textAreaRef}
				className={"w-100"}
				value={textAreaValue}
				onChange={(_, { value }) => setTextAreaValue(value)}
			/>

			<div className={`fs12 ${styles.KaTexPreviewTitle}`}>Preview</div>
			<div className={styles.KaTexPreview} ref={katexPreviewRef}>
				{textAreaValue}
			</div>
		</div>
	);
};
