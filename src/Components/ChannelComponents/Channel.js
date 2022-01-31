import "./Channel.css";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Channel = (props) => {
	// Delcaring proptypes for Eslint
	Channel.propTypes = {
		onFilterPost: PropTypes.func,
		hideSubject: PropTypes.bool,
		subforum_id: PropTypes.string
	};
	// Set All Subjects
	const [Subjects, setSubjects] = useState([]);
	// Set a selected Subject for selecting grade afterwards
	const [SelectedSubject, setSelectedSubject] = useState();
	// Check if subject has been selected to enable selecting grade
	const [HasSubject, isSubjectSelected] = useState(false);
	// Set Grades
	const [Grades, setGrades] = useState([]);
	// Set a selected Subject for selecting grade afterwards
	const [SelectedGrade, setSelectedGrade] = useState();
	// Is unaswered checked
	const [selectUnanswered, setSelectUnanswered] = useState(false);

	function setSubjectId(hideSubject, subforum_id) {
		if (hideSubject == true) {
			setSelectedSubject(subforum_id);
			isSubjectSelected(true);
		}
	}

	// Get Subjects/Subforum 
	function GetSubjects() {
		// Call backend to get all subjects
		axios.get("http://localhost:8000/subforum")
			.then(res => {
				setSubjects(res.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	// Get Grades
	function GetGrades() {
		// Call backend to get all grades
		axios.get("http://localhost:8000/grade")
			.then(res => {
				setGrades(res.data);
			})
			.catch(error => {
				console.log(error);
			});
	}

	//When user selects the subject
	function SubjectChange(event) {
		// Set subject
		setSelectedSubject(event.target.value);
		// If selected option is not default, enable select grade
		if (event.target.value != "default") {
			// Set to true to enable selecting of grades
			isSubjectSelected(true);
			// Store selected option
			const SelectSubject = {
				subforum_id: event.target.value
			};
			// Pass it on props to parent (Post)
			props.onFilterPost(SelectSubject);
		}
		else {
			// Set to false to disable selecting of grades
			isSubjectSelected(false);
			// Set to undefined to find all subjects
			setSelectedSubject();
			// Storing data
			const SelectSubject = {
				subforum_id: undefined
			};
			// Pass it on props to parent (Post)
			props.onFilterPost(SelectSubject);
		}
	}




	// Select grade option
	function GradeChange(event) {
		console.log("grade change");
		if (event.target.value != "default") {
			// Set Grade
			setSelectedGrade(event.target.value);
			// Store selected option
			const SelectGrades = {
				subforum_id: SelectedSubject,
				grade_id: event.target.value
			};
			console.log(SelectGrades);
			// Pass it on props to parent (Post)
			props.onFilterPost(SelectGrades);
		}
		else {
			// Set to undefined to find all subjects
			setSelectedGrade();
			// Storing data
			const SelectSubject = {
				subforum_id: SelectedSubject,
				grade_id: undefined
			};
			// Pass it on props to parent (Post)
			props.onFilterPost(SelectSubject);
		}
	}

	// Select unanswered questions checkbox
	function UnansweredChange() {
		if (selectUnanswered == false) {
			// Storing data
			const FilterResult = {
				subforum_id: SelectedSubject,
				grade_id: SelectedGrade,
				isanswered: selectUnanswered
			};
			// Passing it to parent file
			props.onFilterPost(FilterResult);
			// Set checkbox to undefined to get all posts that are both answered and unanswered
			setSelectUnanswered();
		}
		else {
			// Storing data
			const FilterResult = {
				subforum_id: SelectedSubject,
				grade_id: SelectedGrade,
				isanswered: selectUnanswered
			};
			// Passing it to parent file
			props.onFilterPost(FilterResult);
			// Set is checkbox selected to false
			setSelectUnanswered(false);
		}
	}

	useEffect(() => {
		//To minimize request spikes in database, added a temporary timeout
		setSubjectId(props.hideSubject, props.subforum_id);
		GetSubjects();
		GetGrades();
	}, []);

	return (
		<div className="col-lg-3">
			<div className="bg-white body-borders rounded">
				<div className="form px-3 py-3">
					<div className="d-flex">
						<FilterAltIcon></FilterAltIcon>
						<h5 className="ms-2">Channel</h5>
					</div>
					<hr className="mt-2"></hr>
					<form>
						<div className="form-padding">
							{!props.hideSubject &&
								<React.Fragment>
									<label className="fw-bold">Subject</label>
									<div className="dropdown">
										<select className="SelectSubject form-select" id="SelectSubject" defaultValue={props.subforum_id} onChange={SubjectChange}>
											<option value="default" className="dropdown-item">Select All Subjects</option>
											{Subjects.map((data) => (
												<option key={data.subforum_id} className="dropdown-item" value={data.subforum_id}>{data.subforum_name}</option>
											))}
										</select>
									</div>
								</React.Fragment>
							}
							<br />
							<label className="fw-bold">Grade</label>
							<div className="dropdown">
								<select className="SelectGrade form-select" value={HasSubject == false ? "default" : SelectedGrade} id="SelectGrade" disabled={HasSubject == false ? true : false} onChange={(event) => GradeChange(event)}>
									<option value="default" className="dropdown-item">Select All Grades</option>
									{Grades.map((data) => (
										<option key={data.grade_id} className="dropdown-item" value={data.grade_id} >{data.grade_name}</option>
									))}
								</select>
							</div>
							<p className="form-text">{HasSubject == false ? "Select a subject" : ""} </p>
							<br />
							<div className="form-check form-check-inline">
								<input className="form-check-input" type="checkbox" id="Unanswered" value="unanswered" onClick={UnansweredChange} />
								<label className="form-check-label" htmlFor="inlineRadio3">Unanswered</label>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>

	);
};

export default Channel;
