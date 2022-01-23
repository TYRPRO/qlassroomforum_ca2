/* eslint-disable no-empty */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";

import TagDropdown from "./createQn/TagDropdown";
import Tag from "./createQn/tag";
import QuillEditor from "./EditorQuill_FORUM/EditorQuill";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import DOMPurify from "dompurify";
import axios from "axios";

function CreateQn() {
	const config = {
		loader: { load: ["input/asciimath"] }
	};

	const [subjects, set_subjects] = useState([]);
	const [selected_subject, set_selected_subject] = useState("");
	const [subject_ids, set_subject_ids] = useState([]);

	const [qnTitle, set_qnTitle] = useState("");
	const [qnBody, set_qnBody] = useState("");

	const [grades, set_grades] = useState([]);
	const [shown_grades, set_shown_grades] = useState(["Loading"]);

	const [selected_grade, set_selected_grade] = useState("disabled");

	const [tags, set_tags] = useState(["Whole Numbers", "Measurement", "Geometry", "Fractions", "Speed"]);
	const [shown_tags, set_shown_tags] = useState([]);
	const [selected_tags, set_selected_tags] = useState([]);


	//  Rich Text Editor Stores selected text.
	const [selected, set_selected] = useState(null);

	// Handles displaying of tag dropdown.
	const [openDropdown, set_openDropdown] = useState(false);


	useEffect(() => {
		axios.get("https://testapi.qlassroom.ai/subject_grade")
			.then(function (response) {
				var subjects = response.data.subjectGrade;
				var subject_keys = Object.keys(subjects);

				var tempSubjects = [];
				var tempGrades = [];
				var tempSubjectIds = [];

				for (let i = 0; i < subject_keys.length; i++) {
					tempSubjects.push(Object.values(subjects)[i].subject_name);
					tempGrades.push(Object.values(subjects)[i].grades);
					tempSubjectIds.push(Object.values(subjects)[i].subject_id);

				}

				var tempShownGrades = [];
				for (let i = 0; i < tempGrades[0].length; i++) {
					tempShownGrades.push(tempGrades[0][i].grade_name);
				}

				set_subjects(tempSubjects);
				set_selected_subject(tempSubjects[0]);
				set_subject_ids(tempSubjectIds);

				set_grades(tempGrades);
				set_shown_grades(tempShownGrades);
			})
			.catch(function (error) {
				console.log(error);

			});
	}, []);




	function handleChange_qnTitle(event) {
		set_qnTitle(event.target.value);
	}


	// for gradedropdown
	function handleSelectedSubjectChange(subject) {
		var subject_index = subjects.indexOf(subject);
		var tempShownGrades = [];
		for (let i = 0; i < grades[subject_index].length; i++) {
			tempShownGrades.push(grades[subject_index][i].grade_name);
		}

		set_shown_grades(tempShownGrades);
		set_selected_subject(subject);
		set_selected_grade("disabled");
	}

	// for tagDropdown
	useEffect(() => {

		// Error Handling
		try {
			if (grades != null) {
				var subject_index = subjects.indexOf(selected_subject);
				var subject_id = subject_ids[subject_index];

				var associated_grade_array = grades[subject_index];
				var grade_id = "";

				for (let i = 0; i < associated_grade_array.length; i++) {
					if (associated_grade_array[i].grade_name === selected_grade) {
						grade_id = associated_grade_array[i].grade_id;
						break;
					}
				}
				axios.get(`https://testapi.qlassroom.ai/topics?subject_id=${subject_id}&grade_id=${grade_id}`).then(function (response) {
					var data = response.data.topics;
					if (data[0].dimension_name === "Topics") {
						data.splice(0, 1);
					}

					console.log(data);
					var temp_shown_tags = [];
					for (let i = 0; i < data.length; i++) {
						temp_shown_tags.push(data[i].dimension_name);
					}

					set_tags(data);
					set_shown_tags(temp_shown_tags);
					set_selected_tags([]);
				});
			}

		} catch (err) {

		}

	}, [selected_subject, selected_grade]);



	return (
		<div className="container">
			<div className='row'>
				<div className='col-12 col-lg-8'>
					<h3 className='mt-4 mb-3'>Ask a Question</h3>
					<div className=' bg-white py-3 px-4 shadow-sm border'>
						<form>
							<div className="form-group">

								<label>Subject</label>
								<div className='form-text mt-0'>
									Select the subject of your question.
								</div>
								<div>
									<select className=' form-select' onChange={(event) => handleSelectedSubjectChange(event.target.value)}>
										{subjects.map((subject, index) => <option key={index} value={subject}>{subject}</option>)}
									</select>
								</div>

								<label className='mt-3'>Grade</label>
								<div className='form-text mt-0'>
									Select the grade level that best fits your question.
								</div>
								<div>
									<select className=' form-select' value={selected_grade} onChange={(event) => set_selected_grade(event.target.value)}>
										<option disabled={true} value={"disabled"}>Please select a grade:</option>
										{shown_grades.map((shown_grade, index) => <option key={index} value={shown_grade}>{shown_grade}</option>)}
									</select>						Be specific and imagine you are asking a question to another person.
								</div>
								<input onChange={handleChange_qnTitle} type="text" name='qn_title' className=' form-control' placeholder={"e.g. Find the intercept between y=2x and 12=2y+x. "}></input>

								<label htmlFor='qn_body' className='mt-2'>Body</label>
								<div className=' form-text mt-0'>
									Include all the information someone would need to answer your question
								</div>
								<QuillEditor customToolbarId={"testing"} handleContentChange={set_qnBody} contentHTML={qnBody}></QuillEditor>
								{/* <TextEditor storeInput={set_qnBody} /> */}
								{/* <div value={qnBody} ref={qn_body_textarea} contentEditable='true' id='qn_body_textarea' className='form-control d-inline-block' style={{ overflow: 'scroll', resize: 'vertical', wordBreak: 'break-word', minHeight: '12vh' }}>
								</div> */}





								<label className='mt-3'>Tags</label>
								<div className=' form-text mt-0'>
									Add some tags to help others find your question.
								</div>
								<div className='form-control d-flex flex-wrap' tabIndex={0} onClick={() => set_openDropdown(openDropdown ? false : true)}>

									{selected_tags.map((selected_tags) => <Tag tag={selected_tags} handleRemove={removeTagSelect}></Tag>)}
									<p contentEditable='true' className='mb-0 px-3 bg-secondary text-white'></p>

								</div>

								{openDropdown ? <TagDropdown tags={shown_tags} handleSelect={addTagSelect} handleDropdown={() => { set_openDropdown(false); }}></TagDropdown> : null}
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

	function submitPost() {

		var subject_index = subjects.indexOf(selected_subject);
		var subject_id = subject_ids[subject_index];

		var grades_info = grades[subject_index];
		var grade_id = "";
		for (let i = 0; i < grades_info.length; i++) {
			if (grades_info[i].grade_name === selected_grade) {
				grade_id = grades_info[i].grade_id;
				break;
			}
		}
		console.log(grade_id);



		// Temporary user_id;
		var user_id = "16f59363-c0a4-406a-ae65-b662c6b070cd";




		axios.post("http://localhost:8000/posts", {
			title: qnTitle,
			content: qnBody,
			user_id: user_id,
			subforum_id: subject_id,
			grade_id: grade_id,
		}).then(function (response) {
			console.log(response);
		}).catch(function (error) {
			console.log(error);
		});
	}

	function addTagSelect(tag) {
		var temp_selected_tags = selected_tags;
		var temp_tags = [];

		for (var i = 0; i < shown_tags.length; i++) {
			if (shown_tags[i] === tag) {

			} else {
				temp_tags.push(shown_tags[i]);
			}
		}

		temp_selected_tags.push(tag);

		set_shown_tags(temp_tags);
		set_selected_tags(temp_selected_tags);
	}

	function removeTagSelect(tag) {
		var temp_selected_tags = [];
		var temp_tags = shown_tags;

		for (var i = 0; i < selected_tags.length; i++) {
			if (selected_tags[i] === tag) {

			} else {
				temp_selected_tags.push(selected_tags[i]);
			}
		}

		temp_tags.push(tag);

		set_shown_tags(temp_tags);
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






}
export default CreateQn;