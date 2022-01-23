/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Styles
import styles from "./styles.module.css";

import katex from "katex";
import "katex/dist/katex.min.css";

import "./conflict-agreement.css";
import LaTexModalQuill from "./LaTexModalQuill";
import { customSuperSubScriptMatcher } from "./matcher/CustomMatcher.js";
import KaTexEditorModal from "./KaTexEditorModal";
import ImageModalQuill from "./ImageModalQuill";
window.katex = katex;

const EditorQuill = ({
	customToolbarId,
	customEditorClassname = "",
	label,
	contentHTML,
	handleContentChange,
}) => {
	const [isLaTexModalOpen, setIsLaTexModalOpen] = useState(false);
	const [isKaTexEditorModalOpen, setKaTexEditorModalOpen] = useState(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);

	const reactQuillRef = useRef();
	const quillRef = useRef();

	useEffect(() => {
		if (reactQuillRef.current) {
			if (typeof reactQuillRef.current.getEditor !== "function") return;
			quillRef.current = reactQuillRef.current.getEditor();
		}
	}, [reactQuillRef]);

	const handleLaTexConfirm = useCallback(
		(value) => {
			if (quillRef.current) {
				const range = quillRef.current.getSelection(true);
				const position = range ? range.index : 0;
				quillRef.current.insertText(position, " ");
				quillRef.current.insertEmbed(position + 1, "formula", value);
				quillRef.current.insertText(position + 2, " ");
				quillRef.current.setSelection(position + 3);
			}
		},
		[quillRef]
	);

	const handleKaTexEditorConfirm = useCallback(
		(ops) => {
			if (quillRef.current) {
				ops.forEach((o) => {
					const range = quillRef.current.getSelection(true);
					const position = range ? range.index : 0;
					if (o.type === "text") {
						quillRef.current.insertText(position, o.value);
						quillRef.current.setSelection(position + o.value.length);
					} else if (o.type === "formula") {
						quillRef.current.insertText(position, " ");
						quillRef.current.insertEmbed(position + 1, "formula", o.value);
						quillRef.current.insertText(position + 2, " ");
						quillRef.current.setSelection(position + 3);
					}
				});
			}
		},
		[quillRef]
	);


	const handleImageConfirm = useCallback(
		(value) => {
			if(quillRef.current) {
				console.log("valeur", value);
				const range = quillRef.current.getSelection(true);
				const position = range ? range.index : 0;
				quillRef.current.insertText(position, " ");
				quillRef.current.insertEmbed(position + 10, "image", value);
				quillRef.current.insertText(position +11, " ");
				quillRef.current.setSelection(position + 12);
			}
		}, [quillRef]
	);
	const { modules, formats } = getEditorOptions(customToolbarId);

	return (
		<>
			<div className={`custom-editor-quill ${customEditorClassname}`}>
				<div className={styles.EditorLabel}>{label}</div>
				<CustomToolbar
					customToolbarId={customToolbarId}
					onFormulaClick={() => setIsLaTexModalOpen(!isLaTexModalOpen)}
					onFormulaKaTexClick={() =>
						setKaTexEditorModalOpen(!isKaTexEditorModalOpen)
					}
					onImageClick={() => setIsImageModalOpen(!isImageModalOpen)}
				/>
				<ReactQuill
					theme="snow"
					ref={reactQuillRef}
					value={contentHTML}
					onChange={handleContentChange}
					modules={modules}
					formats={formats}
					preserveWhitespace={true}
				/>
			</div>
			<LaTexModalQuill
				isOpen={isLaTexModalOpen}
				setIsOpen={setIsLaTexModalOpen}
				handleConfirm={handleLaTexConfirm}
			/>
			<KaTexEditorModal
				isOpen={isKaTexEditorModalOpen}
				setIsOpen={setKaTexEditorModalOpen}
				handleConfirm={handleKaTexEditorConfirm}
			/>
			<ImageModalQuill
				isOpen={isImageModalOpen}
				setIsOpen={setIsImageModalOpen}
				handleConfirm={handleImageConfirm}
			/>

		</>
	);
};

export default EditorQuill;

const getEditorOptions = (customToolbarId) => {
	const modules = {
		toolbar: { container: `#${customToolbarId}` },
		clipboard: {
			matchers: [customSuperSubScriptMatcher()],
		},
	};

	const formats = ["bold", "italic", "underline", "script", "formula", "image"];

	return {
		modules,
		formats,
	};
};

const CustomButtonFormula = () => (
	<span className="editor-custom-toolbar-button">
		<svg viewBox="0 0 16 16" className={styles.CustomFormulaButton}>
			<path
				className="ql-fill"
				d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"
			></path>
			<rect
				className="ql-fill"
				height="1.6"
				rx="0.8"
				ry="0.8"
				width="5"
				x="5.15"
				y="6.2"
			></rect>
			<path
				className="ql-fill"
				d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"
			></path>
			<path
				className="ql-fill"
				d="M15.5,7H13.861a4.015,4.015,0,0,0,1.914-2.975,1.8,1.8,0,0,0-1.6-1.751A1.922,1.922,0,0,0,12.021,3.7a0.5,0.5,0,1,0,.957.291,0.917,0.917,0,0,1,1.053-.725,0.81,0.81,0,0,1,.744.762c0,1.077-1.164,1.925-1.934,2.486A1.423,1.423,0,0,0,12,7.5a0.5,0.5,0,0,0,.5.5h3A0.5,0.5,0,0,0,15.5,7Z"
			></path>
		</svg>
	</span>
);

const CustomButtonFormulaKaTex = () => (
	<span className="editor-custom-toolbar-button">
		<svg viewBox="0 0 16 16" className={styles.CustomFormulaKaTexButton}>
			<path
				className="ql-fill"
				d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"
			></path>
			<rect
				className="ql-fill"
				height="1.6"
				rx="0.8"
				ry="0.8"
				width="5"
				x="5.15"
				y="6.2"
			></rect>
			<path
				className="ql-fill"
				d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"
			></path>
		</svg>
	</span>
);

const CustomButtonImage = () => (
	<span className="editor-custom-toolbar-button">
		<svg viewBox="0 0 16 16" className={styles.CustomFormulaKaTexButton}>
			<path
				className="ql-fill"
				d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"
			></path>
			<rect
				className="ql-fill"
				height="1.6"
				rx="0.8"
				ry="0.8"
				width="5"
				x="5.15"
				y="6.2"
			></rect>
			<path
				className="ql-fill"
				d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"
			></path>
		</svg>
	</span>
);

const CustomToolbar = ({
	customToolbarId,
	onFormulaClick,
	onFormulaKaTexClick,
	onImageClick,
}) => (
	<div id={customToolbarId} className="custom-quill-toolbar">
		<button className="ql-bold" />
		<button className="ql-italic" />
		<button className="ql-underline" />
		<button className="ql-script" value="super" />
		<button className="ql-script" value="sub" />
		<button className="ql-formula" />

		<button className="ql-custom-formula" onClick={onFormulaClick}>
			<CustomButtonFormula />
		</button>
		<button className="ql-custom-formula-katex" onClick={onFormulaKaTexClick}>
			<CustomButtonFormulaKaTex />
		</button>

		<button className="ql-custom-image" onClick={onImageClick}>
			<CustomButtonImage />
		</button>
	</div>
);
