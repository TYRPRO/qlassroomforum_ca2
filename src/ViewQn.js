import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './viewQn/viewQn.css'

import parseTime from './helperFunctions/parseTime';
import Answer from './viewQn/Answer.js';
import Editor from './Components/Editor.js';
import DOMPurify from 'dompurify';

function ViewQn() {

    const { post_id } = useParams();

    const [post_title, set_post_title] = useState('');
    const [post_content, set_post_content] = useState('');
    const [post_created_at, set_post_created_at] = useState('');
    const [answers, set_answers] = useState([]);

    const [answer_input, set_answer_input] = useState('');
    const [refreshAnswers, set_refreshAnswers] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/posts/${post_id}`)
            .then(function (response) {
                var data = response.data
                console.log(data)
                set_post_title(data.post_title);
                set_post_content(data.post_content);

                var parsedTime = parseTime(data.post_created_at);
                set_post_created_at(parsedTime);

            }).catch(function (error) {
                console.log(error);
            })
    }, [])

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
            <div className='row wip py-3'>header</div>
            <div className='container'>
                <div className='row'>
                    <div className='col-1 wip'>
                        sidebar
                    </div>
                    <div className="col-10 mt-2 mb-1">
                        <h1>{post_title}</h1>
                        <div className='d-flex flex-row'>
                            <p className='wip'>
                                subject
                            </p>
                            <p className="fw-light text-secondary mx-2">•</p>
                            <p className='wip'>
                                grade
                            </p>
                            <p className="fw-light text-secondary mx-2">•</p>
                            <p>
                                <span className=' text-secondary'>Posted by</span> Ben
                            </p>
                            <p className="fw-light text-secondary mx-2">•</p>
                            <p>
                                {post_created_at}
                            </p>

                        </div>
                        <hr className='my-1'></hr>

                        <div className='row mt-3'>
                            <div className='col-8'>
                                <div className='row'>
                                    <div className='col-2'>
                                        <a className="text-center d-block py-1 post-upvote" id="post_upvote"><i className="fas fa-arrow-up text-dark" /></a>
                                        <p id="post_rating" className="text-center mb-0">####</p>
                                        <a className="text-center d-block py-1 post-downvote" id="post_downvote"><i className="fas fa-arrow-down text-dark" /></a>
                                    </div>
                                    <div className='col-10'>
                                        {/* No worries, we do input validation for this innerhtml */}
                                        <p className='qn-content' dangerouslySetInnerHTML={{__html: post_content}}></p>
                                        <div className='row text-secondary'>
                                            <p className='col-2 toolbar-btn'>Share</p>
                                            <p className='col-2 toolbar-btn'>Save</p>
                                            <p className='col-2 toolbar-btn'>Report</p>
                                            <div className='col-1'></div>
                                            <div className='col-5 '>
                                                <div className='container p-1 postedBySection rounded'>
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
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className='mt-1'>
                                    <h5 className='mb-3'>{answers.length} Answers</h5>
                                    <div>
                                        {answers.map((answer, index) => <Answer key={index} answer={answer} />)}
                                    </div>
                                    <div>
                                        <h5>Your Answer</h5>
                                        <Editor storeInput={set_answer_input}></Editor>
                                        <button onClick={submitAnswer} className='btn btn-primary my-2'>Post Your Answer</button>
                                    </div>
                                </div>


                            </div>
                            <div className='col-4'>
                                <div className=' container'>
                                    testin
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>


        </div>
    )


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