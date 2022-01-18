import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import './viewQn/viewQn.css'

import parseTime from '../../helperFunctions/parseTime';
import Answer from './viewQn/Answer.js';
import Editor from './Editor.js';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';


function ViewQn() {

	const { post_id } = useParams();

	const [post_title, set_post_title] = useState('Title');
	const [post_content, set_post_content] = useState('Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit');
	const [post_created_at, set_post_created_at] = useState(parseTime("2022-01-18 07:47:30"));
	const [answers, set_answers] = useState([]);
	const [tags, set_tags] = useState(["Subject","Grade","Additional Maths", "Logarithmic Functions", "Graphs"]);

	const [answer_input, set_answer_input] = useState('');
	const [refreshAnswers, set_refreshAnswers] = useState(false);


	const [bookmarkHover, set_bookmarkHover] = useState(false);

	const navigate = useNavigate();

	// useEffect(() => {
	// 	axios.get(`http://localhost:8000/posts/${post_id}`)
	// 		.then(function (response) {
	// 			var data = response.data
	// 			console.log(data)
	// 			set_post_title(data.post_title);
	// 			set_post_content(data.post_content);

	// 			var parsedTime = parseTime(data.post_created_at);
	// 			set_post_created_at(parsedTime);

	// 		}).catch(function (error) {
	// 			console.log(error);
	// 		})
	// }, [])

	useEffect(() => {
		axios.get(`http://localhost:8000/answers/posts/${post_id}`)
			.then(function (response) {
				var data = response.data
				set_answers(data);
			}).catch(function (error) {
				console.log(error);
			})
	}, [refreshAnswers])



	return (
		<div className="container-fluid">
			<div className='container'>
				<div className='row'>
					<div className='col-2  border-end'>
						<button className=' ms-4 mt-3 ps-1 py-2 w-75 btn btn-secondary d-flex align-items-center ' onClick={() => navigate(-1)}>
							<ArrowBackIosNewIcon sx={{ fontSize: 23 }} />
							<p className='mb-0 ms-4 align-middle'>Back</p>
						</button>
						<button className='ms-4 mt-3 ps-1  py-2 w-75 btn btn-secondary d-flex align-items-center ' onClick={() => navigate(-1)}>
							<EditIcon sx={{ fontSize: 23 }} />
							<p className='mb-0 ms-4 align-middle'>Edit</p>
						</button>
						<button className='ms-4 mt-3 ps-1 py-2 w-75 btn btn-secondary d-flex align-items-center ' onClick={() => navigate(-1)}>
							<DeleteIcon sx={{ fontSize: 23 }} />
							<p className='mb-0 ms-4 align-middle'>Delete</p>
						</button>
					</div>
					<div className="col-10 mt-2 mb-1">


						<div className='row mt-3'>
							<div className='col-9'>
								<div className='row'>
									<div className='col-1'>
										<a className="text-center d-block py-1 post-upvote" id="post_upvote"><i className="fas fa-arrow-up text-dark" /></a>
										<p id="post_rating" className="text-center mb-0">##</p>
										<a className="text-center d-block py-1 post-downvote" id="post_downvote"><i className="fas fa-arrow-down text-dark" /></a>
									</div>
									<div className='col-11'>
										{/* No worries, we do input validation for this innerhtml */}
										<div className='col-12 d-flex align-items-center'>

											<h1>{post_title}</h1>
											<div className='flex-grow-1'></div>

											<div>
												<button onMouseEnter={() => { set_bookmarkHover(true) }} onMouseLeave={() => { set_bookmarkHover(false) }} className='text-secondary anim-enter-active'>
													<BookmarkBorderIcon sx={{fontSize: 26}}/>
													{bookmarkHover ? 'Bookmark this question?' : ''}
												</button>
											</div>


										</div>


										<div className='d-flex flex-row'>
											<div className='min-profile-pic bg-secondary'>

											</div>
											<p className='ms-2'>
												Ben
											</p>
											<p className="fw-light text-secondary mx-2">•</p>
											<p>
												{post_created_at}
											</p>
										</div>
										<p className='qn-content mt-3' dangerouslySetInnerHTML={{ __html: post_content }}></p>
										<div className='d-flex'>
											{tags.map((tag, index) => <Tag key={index} tag={tag}></Tag>)}
										</div>
										<div className='row text-primary'>
											<div className='col-3'>
												<div className='d-inline-block toolbar-btn px-2'>
													<div className='d-flex flex-row align-items-center '>

														<ReplyIcon></ReplyIcon>
														<p className='px-2 py-2 mb-0'>Comment</p>
													</div>
												</div>


											</div>
											<div className='col-3 '>
												<div className='d-inline-block toolbar-btn px-2'>
													<div className='d-flex flex-row align-items-center '>

														<ModeCommentIcon></ModeCommentIcon>
														<p className='px-2 py-2 mb-0'>Answer</p>
													</div>
												</div>
											</div>
											<div className='col-3'></div>
											<div className='col-3 '>
												{/* <div className='container p-1 postedBySection rounded'>
													<small className='mb-0 text-secondary'>Posted by</small>
													<div className=' row g-0'>
														<div className='col-3 py-1'>
															<div className='min-profile-pic bg-secondary'>

															</div>
														</div>
														<div className='col-9'>
															<p className='mb-0'>Name</p>
															<p className='mb-0'>Points ###</p>
														</div>
													</div>
												</div> */}
												<div className=' text-secondary d-flex flex-row align-items-center h-100'>
													<p className='mb-0'>Edit</p>
													<p className='mb-0 ms-3'>Delete</p>
												</div>

											</div>

										</div>

									</div>
								</div>
								<hr></hr>
								<div className='mt-1'>
									<p className='mb-3'>{answers.length} Answers</p>
									<div>
										{answers.map((answer, index) => <Answer key={index} answer={answer} />)}
									</div>
									<div>
										<p>Your Answer</p>
										<Editor storeInput={set_answer_input}></Editor>
										<button onClick={submitAnswer} className='btn btn-primary my-2'>Post Your Answer</button>
									</div>
								</div>


							</div>
							<div className='col-3'>
								<div className=' container'>
									WIP
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>


		</div>
	)


	function Tag(props) {
		return (
			<div>
				<small className="d-flex tag-name me-2 my-1 py-1 rounded" >
					<p className=' mb-0 px-2 d-inline text-nowrap'>{props.tag}</p>
				</small>
			</div>
		)
	}

	function submitAnswer() {

		// Temp User ID
		var user_id = "16f59363-c0a4-406a-ae65-b662c6b070cd";
		var post_id = "c059519c-6793-4ef8-9026-14869d61f28a"
		var answer_content = DOMPurify.sanitize(answer_input);


		axios.post("http://localhost:8000/answers", {
			user_id: user_id,
			post_id: post_id,
			answer: answer_content
		}).then(function (response) {
			console.log(response);
			set_refreshAnswers(!refreshAnswers);
		}).catch(function (error) {
			console.log(error);
		})

	}
}

export default ViewQn;