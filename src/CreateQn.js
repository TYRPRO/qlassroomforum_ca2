
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";



import TagDropdown from "./createQn/TagDropdown";
import Tag from "./createQn/tag";
import TextEditor from "./Components/Editor";

import { MathJax, MathJaxContext } from "better-react-mathjax"
import DOMPurify from "dompurify";
import axios from "axios";

function CreateQn() {
	const config = {
		loader: { load: ["input/asciimath"] }
	}

	const [subjects, set_subjects] = useState(["Mathematics", "Physics", "Chemistry"])
	const [selected_subject, set_selected_subject] = useState("Mathematics");

	const [qnTitle, set_qnTitle] = useState("");
	const [qnBody, set_qnBody] = useState("");

	const [grades, set_grades] = useState(["Placeholder", "Secondary 3 - Express", "Secondary 3 - N(A)", "Secondary 4 - Express", "Secondary 4 - N(A)"]);
	const [selected_grade, set_selected_grade] = useState("Placeholder");

	const [tags, set_tags] = useState(["Whole Numbers", "Measurement", "Geometry", "Fractions", "Speed"]);
	const [selected_tags, set_selected_tags] = useState([]);


	//  Rich Text Editor Stores selected text.
	const [selected, set_selected] = useState(null);

	// Handles displaying of tag dropdown.
	const [openDropdown, set_openDropdown] = useState(false);




	function handleChange_qnTitle(event) {
		set_qnTitle(event.target.value);
	}

	return (
		<div className="container">
			<div className='row'>
				<div className='col-12 col-lg-8'>
					<h3>Ask a Question</h3>
					<div className=' bg-white py-3 px-4 shadow-sm border'>
						<form>
							<div className="form-group">

								<label className='wip'>Subject</label>
								<div className='form-text mt-0'>
									Select the subject of your question.
								</div>
								<div>
									<select className=' form-select'>
										{subjects.map((subject) => <option onClick={() => { set_selected_subject(subject) }}>{subject}</option>)}
									</select>
								</div>


								<label htmlFor='qn_title' className='mt-3'>Question Title</label>
								<div className=' form-text mt-0'>
									Be specific and imagine you are asking a question to another person.
								</div>
								<input onChange={handleChange_qnTitle} type="text" name='qn_title' className=' form-control' placeholder={"e.g. Find the intercept between y=2x and 12=2y+x. "}></input>

								<label htmlFor='qn_body' className='mt-2'>Body</label>
								<div className=' form-text mt-0'>
									Include all the information someone would need to answer your question
								</div>
								<TextEditor storeInput={set_qnBody} />

								<label className='wip mt-3'>Grade</label>
								<div className='form-text mt-0'>
									Select the grade level that best fits your question.
								</div>
								<div>
									<select className=' form-select'>
										{grades.map((grade) => <option onClick={() => { set_selected_grade(grade) }}>{grade}</option>)}
									</select>
								</div>



								<label className='wip mt-3'>Tags</label>
								<div className=' form-text mt-0'>
									Add some tags to help others find your question.
								</div>
								<div className='form-control d-flex flex-wrap' tabIndex={0} onClick={() => set_openDropdown(openDropdown ? false : true)}>

									{selected_tags.map((selected_tags) => <Tag tag={selected_tags} handleRemove={removeTagSelect}></Tag>)}
									<p contentEditable='true' className='mb-0 px-3 bg-secondary text-white'></p>

								</div>
								{openDropdown ? <TagDropdown tags={tags} handleSelect={addTagSelect} handleDropdown={() => { set_openDropdown(false) }}></TagDropdown> : null}
							</div>



						</form>
					</div>
					<button onClick={submitPost} className='btn btn-primary shadow-sm mt-4'>Review your question</button>
				</div>
				<div className='col-lg-4'>
					<h5 >Left</h5>
					<MathJaxContext config={config}>
						<MathJax>{"`(10)/(4x) approx 2^(12)`"}</MathJax>
					</MathJaxContext>
				</div>
			</div>
		</div>

	);


	function addTagSelect(tag) {
		var temp_selected_tags = selected_tags;
		var temp_tags = [];

		for (var i = 0; i < tags.length; i++) {
			if (tags[i] == tag) {

			} else {
				temp_tags.push(tags[i]);
			}
		}

		temp_selected_tags.push(tag);

		set_tags(temp_tags);
		set_selected_tags(temp_selected_tags);
	}

	function removeTagSelect(tag) {
		var temp_selected_tags = [];
		var temp_tags = tags;

		for (var i = 0; i < selected_tags.length; i++) {
			if (selected_tags[i] == tag) {

			} else {
				temp_selected_tags.push(selected_tags[i]);
			}
		}

		temp_tags.push(tag);

		set_tags(temp_tags);
		set_selected_tags(temp_selected_tags);
	}

	function onlyInEditor() {
		var current_selection_id = window.getSelection().anchorNode.parentElement.id;
		if (current_selection_id === "qn_body_textarea") {
			return true;

		}
		else {
			return false;

		}
	}

	function saveSelection() {
		if (window.getSelection()) {
			var selection = window.getSelection();

			if (selection.getRangeAt && selection.rangeCount) {
				var range = []
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
			console.log("seting", action);
			document.execCommand(action, false);
		}

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




	function clearFormatting(removeLink) {
		if (removeLink) {
			restoreSelection();
			document.execCommand("unlink", false);
		}

		console.log("removing format");
		document.execCommand("removeFormat", false);
	}



	function submitPost() {


		// Sanitizes body input
		var qnBody = document.getElementById("qn_body_textarea").innerHTML;
		qnBody = DOMPurify.sanitize(qnBody);

		// Temporary user_id;
		var user_id = "16f59363-c0a4-406a-ae65-b662c6b070cd";

		// Temporary forum_id;
		var forum_id = "8a9e9024-8216-4a73-a5bc-3a3a55c8a23e"

		axios.post("http://localhost:8000/posts", {
			title: qnTitle,
			content: qnBody,
			user_id: user_id,
			subforum_id: forum_id
		}).then(function (response) {
			console.log(response);
		}).catch(function (error) {
			console.log(error);
		});
	}


}
export default CreateQn;