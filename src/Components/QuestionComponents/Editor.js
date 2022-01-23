import React from "react";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import AddLinkIcon from "@mui/icons-material/AddLink";
import FunctionsIcon from "@mui/icons-material/Functions";
import { useState, useRef} from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";
import EquationEditor from "./createQn/EquationEditor";


function TextEditor(props) {

	var storeInput = props.storeInput;
    
	const qn_body_textarea = useRef("");

	function handleChange() {
		storeInput(qn_body_textarea.current.innerHTML);
	}

	//  Rich Text Editor Stores selected text.
	const [selected, set_selected] = useState(null);

	// Handles displaying of equation editor.
	const [hideEquationEditor, set_hideEquationEditor] = useState(true);

	const [eqnContainerCount, set_eqnContainerCount] = useState(0);

	return (
		<div id='wysiwyg_editor'>
			<div className='border w-100 rounded-top'>
				<div id='editor_toolbar' className=' btn-group'>
					<div className='btn btn-outline-secondary border-0' onClick={() => { modifyDesign("bold"); }}>
						<FormatBoldIcon />
					</div>
					<div className='btn btn-outline-secondary border-0' onClick={() => { modifyDesign("italic"); }}>
						<FormatItalicIcon />
					</div>
					<div className='btn btn-outline-secondary border-0' onClick={() => { modifyDesign("createLink"); }}>
						<AddLinkIcon />
					</div>
					<div className='btn btn-outline-secondary border-0' onClick={() => { createEqnContainer(); }}>
						<FunctionsIcon />
					</div>

				</div>
			</div>
			<div onInput={handleChange} ref={qn_body_textarea} contentEditable='true' id='qn_body_textarea' className='form-control d-inline-block' style={{ overflow: "scroll", resize: "vertical", wordBreak: "break-word", minHeight: "12vh" }}>
			</div>

			<div className="modal fade" id="add_url" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="staticBackdropLabel">Insert Link</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
						</div>
						<div className="modal-body">
							<input id='wysiwyg_link' type='url' className='form-control' placeholder='https://www.qlassroom.ai/'></input>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => clearFormatting(true)}>Clear Formatting</button>
							<button type="button" id='addLinkBtn' className="btn btn-primary" onClick={addURL}>Add Link</button>
						</div>
					</div>
				</div>
			</div>
			<EquationEditor toAppend={`eqn_container${eqnContainerCount}`} toIncrease={[eqnContainerCount, set_eqnContainerCount]} hide={hideEquationEditor} handleBlur={set_hideEquationEditor} handleChange={handleChange}></EquationEditor>
		</div>
	);

	function saveSelection() {
		if (window.getSelection()) {
			var selection = window.getSelection();

			if (selection.getRangeAt && selection.rangeCount) {
				var range = [];
				for (var i = 0; i < selection.rangeCount; i++) {
					range.push(selection.getRangeAt(i));
				}
				return set_selected(range);
			}
		} else if (document.selection && document.selection.createRange) {
			return set_selected(document.selection.createRange());
		}
		return null;
	}

	function modifyDesign(action) {

		if (action === "createLink") {
			saveSelection();
			var link_modal = new Modal(document.getElementById("add_url"), { backdrop: "static", keyboard: false });
			document.getElementById("wysiwyg_link").value = "";
			link_modal.toggle();
		}
		else {
			document.execCommand(action, false);
		}

	}

	function createEqnContainer() {
		var node = `
        &zwj;<span class='d-inline' contentEditable='false' id="eqn_container${eqnContainerCount}"></span>&zwj;
        `;

		document.getElementById("qn_body_textarea").innerHTML = document.getElementById("qn_body_textarea").innerHTML + node;
		set_hideEquationEditor(false);
	}

	function clearFormatting(removeLink) {
		if (removeLink) {
			restoreSelection();
			document.execCommand("unlink", false);
		}

		console.log("removing format");
		document.execCommand("removeFormat", false);
	}

	function addURL() {

		var link_url = document.getElementById("wysiwyg_link").value;
		console.log(link_url);

		var link_modal_element = document.getElementById("add_url");
		var link_modal = Modal.getInstance(link_modal_element);
		link_modal.toggle();

		restoreSelection();

		document.execCommand("createLink", false, link_url);

	}

	function restoreSelection() {
		if (selected) {
			var selection = window.getSelection();
			selection.removeAllRanges();
			for (var i = 0, len = selected.length; i < len; i++) {
				selection.addRange(selected[i]);
			}
		} else if (document.selection && selected.select) {
			selected.select();
		}
	}

}


export default TextEditor;
