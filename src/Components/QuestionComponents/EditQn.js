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

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import axios from "axios";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import "./createQn/TagDropdown.css";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../store/actions/Common";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


function EditQn() {
	const config = {
		loader: { load: ["input/asciimath"] }
	};

	const { post_id } = useParams();
	const [subjects, set_subjects] = useState([]);
	const [selected_subject, set_selected_subject] = useState("");
	const [subject_ids, set_subject_ids] = useState([]);
	const [tagInPost, set_tagInPost] = useState([]);

	const [qnTitle, set_qnTitle] = useState("");
	const [qnBody, set_qnBody] = useState("");

	const [grades, set_grades] = useState([]);
	const [shown_grades, set_shown_grades] = useState(["Loading"]);

	const [selected_grade, set_selected_grade] = useState("disabled");

	const [tags, set_tags] = useState(["Whole Numbers", "Measurement", "Geometry", "Fractions", "Speed"]);
	const [shown_tags, set_shown_tags] = useState([]);
	const [selected_tags, set_selected_tags] = useState([]);

	//login functions
	const acquireData = useSelector((state) => state.Common.acquireData);
	const userDetails = useSelector((state) => state.Common.userDetails);
	const dispatch = useDispatch();

	const [titleError, set_titleError] = useState("");
	const [gradeError, set_gradeError] = useState("");


	//  Rich Text Editor Stores selected text.
	const [selected, set_selected] = useState(null);

	// Handles displaying of tag dropdown.
	const [openDropdown, set_openDropdown] = useState(false);


	useEffect(() => getUserDetails(dispatch), []);

	useEffect(() => {
		if (!acquireData) {
			return;
		}

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
				set_subject_ids(tempSubjectIds);

				set_grades(tempGrades);
				set_shown_grades(tempShownGrades);
			})
			.catch(function (error) {

			});

	}, [acquireData]);

	useEffect(() => {
		if (!acquireData) {
			return;
		}

		axios.get(`https://qlassroombackend.herokuapp.com/posts/${post_id}`)
			.then(function (response) {
				var data = response.data;

				if (data.fk_user_id !== userDetails.user_id) {
					toast.error("You do not have permission to edit this post.");
					return;
				}


				set_qnTitle(data.post_title);
				set_qnBody(data.post_content);
				var temp_tagInPost = [];
				for (let i = 0; i < data.PostLabels.length; i++) {
					temp_tagInPost.push(data.PostLabels[i].Label.label_id);
				}
				set_tagInPost(temp_tagInPost);
				set_selected_subject(data.Subforum.subforum_name);
				set_selected_grade(data.Grade.grade_name);




			}).catch(function (error) {
			});
	}, [acquireData]);


	useEffect(() => {

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
					var URL = `https://qlassroombackend.herokuapp.com/label/${subject_id}/${grade_id}`;
					axios.get(URL).then(function (response) {
						var data = response.data;
						if (data[0].label_name === "Topics") {
							data.splice(0, 1);
						}

						var temp_shown_tags = [];
						var temp_selected_tags = [];
						for (let i = 0; i < data.length; i++) {
							for (let j = 0; j < tagInPost.length; j++) {
								if (data[i].label_id === tagInPost[j]) {
									temp_selected_tags.push(data[i]);
								}
								else {
									temp_shown_tags.push(data[i]);
								}
							}
						}
						set_tags(data);
						set_shown_tags(temp_shown_tags);
						set_selected_tags(temp_selected_tags);
					}).catch(function (error) {
					});
				}

			}

		} catch (err) {

		}

	}, [selected_subject, selected_grade]);

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



	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="light" pauseOnFocusLoss draggable pauseOnHover />
			<div className="container min-height">
				<div className='row'>
					<div className="col-lg-2">

					</div>
					<div className='col-12 col-lg-8'>

						<h3 className='mt-4 mb-3'>Edit Question</h3>
						<div className="d-flex align-items-center mt-3" >
							<ArrowBackIosNewIcon className="cursor-pointer hue-light-blue" onClick={() => 	window.location.href = `/posts/${post_id}`} sx={{ fontSize: 18}} />
							<p onClick={() => 	window.location.href = `/posts/${post_id}`} className="hue-light-blue cursor-pointer mb-0 ms-1 align-middle">Return to Question</p>
						</div>
						<div className=''>
							<form>
								<div className="form-group">


									<label className='mt-3 mb-1 fw-bold'>Question Title</label>
									<input onChange={handleChange_qnTitle} value={qnTitle} type="text" name='qn_title' className=' form-control' placeholder={"e.g. Find the intercept between y=2x and 12=2y+x. "}></input>
									<div className="is-invalid text-danger">
										{titleError}
									</div>

									<label htmlFor='qn_body' className='mt-4 mb-1 fw-bold'>Body</label>
									<QuillEditor customToolbarId={"testing"} handleContentChange={set_qnBody} contentHTML={qnBody} placeholder={"Be specific and imagine you are asking a question to another person."}></QuillEditor>


									<div className="row">
										<div className="col-12 col-md-6">
											<label className="mt-4 fw-bold">Subject</label>
											<div className='form-text mt-0'>
												Select the subject of your question.
											</div>
											<div>
												<select className=' form-select' value={selected_subject} onChange={(event) => handleSelectedSubjectChange(event.target.value)}>
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
											<div className="is-invalid text-danger">
												{gradeError}
											</div>
										</div>
									</div>







									<label className='mt-4 fw-bold'>Tags</label>
									<div className=' form-text mt-0'>
										Add some tags to help others find your question.
									</div>
									<div className='form-control d-flex flex-wrap' tabIndex={0} onClick={() => set_openDropdown(openDropdown ? false : true)}>

										{selected_tags.map((selected_tags, index) => <Tag key={index} tag={selected_tags} handleRemove={removeTagSelect}></Tag>)}
										<p contentEditable='true' className='mb-0 px-3 tag-cursor rounded'></p>
										<div className="flex-grow-1"></div>
										<div className=" align-self-end">
											<ExpandMoreIcon sx={{fontSize:22}}></ExpandMoreIcon>
										</div>
									</div>

									{openDropdown ? <TagDropdown tags={shown_tags} selected_tags={selected_tags} handleSelect={addTagSelect} handleDropdown={() => { set_openDropdown(false); }}></TagDropdown> : null}
								</div>



							</form>
						</div>
						<div className="d-flex flex-row">
							<button onClick={() => { window.location.reload(); }} className="btn btn-primary shadow-sm mt-4">Undo edits</button>
							<div className="flex-grow-1"></div>

							<button onClick={submitPostEdit} className='btn btn-primary shadow-sm mt-4'>Edit question</button>
						</div>

					</div>
					<div className='col-lg-2'></div>
				</div>
			</div>
		</React.Fragment>


	);

	function submitPostEdit() {

	
		let title_pattern = /^[a-zA-Z0-9#$.?! ()%,]*$/;
		let title_accepted = title_pattern.test(qnTitle);

		if (qnTitle.length > 85 || qnTitle.trim().length == 0) {

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

		var token = findCookie("token");

		
		if (title_accepted && grade_id != "") {
			toast.promise(
				new Promise((resolve, reject) => {
					axios.put("https://qlassroombackend.herokuapp.com/posts", {
						title: qnTitle,
						content: purified_body,
						user_id: userDetails.user_id,
						subforum_id: subject_id,
						grade_id: grade_id,
						tags: tags,
						post_id: post_id
					}, {
						headers: { authorization: "Bearer " + token }
					}).then(function (response) {
						setTimeout(() => {
							window.location.href = `/posts/${post_id}`;
						}, 2500);
						resolve();
					}).catch(function (error) {
						reject(error.response.data.err);
					});
				}),
				{
					pending: "Editing Post...",
					success: "Post Edited! Redirecting...",
					error: {
						render({ data }) {
							return `${data}`;
						},
					},
				}
			);
		}
		else {
			if(!title_accepted) {
				set_titleError("Please enter a title that is less than 85 characters and contains only letters, numbers, and the following symbols: #$%.,?!()");
			}

			if(grade_id == "" ) {
				set_gradeError("Please select a grade");
			}
		}




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

	function findCookie(name) {
		var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
		if (match) {
			return (match[2]);
		}
		else {
			return ("error");
		}
	}

}
export default EditQn;