/* eslint-disable no-empty */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.js";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

	const [loggedInUser, set_loggedInUser] = useState({});

	//  Rich Text Editor Stores selected text.
	const [selected, set_selected] = useState(null);

	// Handles displaying of tag dropdown.
	const [openDropdown, set_openDropdown] = useState(false);


	const [titleError, set_titleError] = useState("");


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
		acquireUserData();
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

				if (subject_id && grade_id) {
					axios.get(`http://localhost:8000/label/${subject_id}/${grade_id}`).then(function (response) {
						var data = response.data;
						if (data[0].label_name === "Topics") {
							data.splice(0, 1);
						}

						console.log(data);
						var temp_shown_tags = [];
						for (let i = 0; i < data.length; i++) {
							temp_shown_tags.push(data[i]);
						}

						set_tags(data);
						set_shown_tags(temp_shown_tags);
						set_selected_tags([]);
					});
				}
			}

		} catch (err) {

		}

	}, [selected_subject, selected_grade]);



	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			<div className="container">
				<div className='row'>
					<div className="col-lg-2"></div>
					<div className='col-12 col-lg-8'>
						<h3 className='mt-4 mb-3'>Ask a Question</h3>
						<div className=''>
							<form>
								<div className="form-group">

									<label className='mt-3 mb-1 fw-bold'>Question Title</label>
									<input onChange={handleChange_qnTitle} type="text" name='qn_title' className=' form-control' placeholder={"Be specific and imagine you are asking a question to another person."}></input>
									<div className="is-invalid text-danger">
										{titleError}
									</div>

									<label htmlFor='qn_body' className='mt-4 mb-1 fw-bold '>Body</label>
									<QuillEditor customToolbarId={"testing"} handleContentChange={set_qnBody} contentHTML={qnBody} placeholder={"Include all the information someone would need to answer your question"}></QuillEditor>

									<div className="row">
										<div className="col-12 col-md-6">
											<label className="mt-4 fw-bold">Subject</label>
											<div className='form-text mt-0'>
												Select the subject of your question.
											</div>
											<div>
												<select className=' form-select' onChange={(event) => handleSelectedSubjectChange(event.target.value)}>
													{subjects.map((subject, index) => <option key={index} value={subject}>{subject}</option>)}
												</select>
											</div>

										</div>
										<div className="col-12 col-md-6">
											<label className='mt-4 fw-bold'>Grade</label>
											<div className='form-text mt-0'>
												Select the grade level that best fits your question.
											</div>
											<div>
												<select className=' form-select' value={selected_grade} onChange={(event) => set_selected_grade(event.target.value)}>
													<option disabled={true} value={"disabled"}>Please select a grade:</option>
													{shown_grades.map((shown_grade, index) => <option key={index} value={shown_grade}>{shown_grade}</option>)}
												</select>
											</div>
										</div>
									</div>

									<label className='mt-4 fw-bold'>Tags</label>
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
						<div className="d-flex flex-row">
							<div className="flex-grow-1"></div>
							<button onClick={submitPost} className='btn btn-primary shadow-sm mt-4'>Post question</button>
						</div>
					</div>
					<div className='col-lg-2'>
					</div>
				</div>
			</div>
		</React.Fragment>


	);

	function submitPost() {

		let title_pattern = /^[a-zA-Z0-9#$.?! ()%,]*$/;
		let title_accepted = title_pattern.test(qnTitle);
		if (qnTitle.length > 85) {
			title_accepted = false;
		}

		let purified_body = DOMPurify.sanitize(qnBody);



		var subject_index = subjects.indexOf(selected_subject);
		var subject_id = subject_ids[subject_index];
		var tags = selected_tags;
		var grades_info = grades[subject_index];
		var grade_id = "";
		for (let i = 0; i < grades_info.length; i++) {
			if (grades_info[i].grade_name === selected_grade) {
				grade_id = grades_info[i].grade_id;
				break;
			}
		}


		if (title_accepted) {
			var token = findCookie("token");
			toast.promise(
				new Promise((resolve, reject) => {
					axios.post("http://localhost:8000/posts", {
						title: qnTitle,
						content: purified_body,
						user_id: loggedInUser.user_id,
						subforum_id: subject_id,
						grade_id: grade_id,
						tags: tags
					}, {
						headers: { authorization: "Bearer " + token }
					}).then(function (response) {
						setTimeout(() => {
							window.location.href = `/posts/${response.data.post_id}`;
						}, 2500);
						resolve();
						console.log(response);
					}).catch(function (error) {
						console.log(error);
						reject();
					});
				}),
				{
					pending: "Creating Post...",
					success: "Post Created! Redirecting...",
					error: {
						render({ data }) {
							return `${data}`;
						},
					},
				}
			);
		} else {
			set_titleError("Please enter a title that is less than 85 characters and contains only letters, numbers, and the following symbols: #$%.,?!()");
		}

	}

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}
	function acquireUserData() {
		var token = findCookie("token");

		axios.get("http://localhost:8000/user/userData",
			{
				headers: { "Authorization": "Bearer " + token }
			})
			.then(response => {
				var data = response.data;
				set_loggedInUser({
					user_id: data.user_id,
					first_name: data.first_name,
					last_name: data.last_name,
					role: data.roles,
				});
			})
			.catch((err) => {
				console.log(err);
				window.location.assign("/login");
			});
	}

	function addTagSelect(tag) {
		var temp_selected_tags = selected_tags;
		var temp_tags = [];
		var tag_object = {};

		for (var i = 0; i < shown_tags.length; i++) {
			if (shown_tags[i].label_name === tag) {
				tag_object = shown_tags[i];
			} else {
				temp_tags.push(shown_tags[i]);
			}
		}

		temp_selected_tags.push(tag_object);

		set_shown_tags(temp_tags);
		set_selected_tags(temp_selected_tags);
	}

	function removeTagSelect(tag) {
		var temp_selected_tags = [];
		var temp_tags = shown_tags;
		var tag_object = {};

		for (var i = 0; i < selected_tags.length; i++) {
			if (selected_tags[i].label_name === tag) {
				tag_object = selected_tags[i];
			} else {
				temp_selected_tags.push(selected_tags[i]);

			}
		}

		temp_tags.push(tag_object);

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