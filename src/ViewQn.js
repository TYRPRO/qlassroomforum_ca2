import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ViewQn() {

    const { post_id } = useParams();

    const [post_title, set_post_title] = useState('');
    const [post_content, set_post_content] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8000/posts/${post_id}`)
            .then(function (response) {
                var data = response.data
                set_post_title(data.post_title);
                set_post_content(data.post_content);
            }).catch(function (error) {
                console.log(error);
            })
    })

    return (
        <div className="container-fluid">
            <div className='row wip'>header</div>
            <div className='row'>
                <div class='col-3 wip'>
                    sidebar
                </div>
                <div class="col-9">
                    {post_id}
                    <h1>{post_title}</h1>
                    <p>{post_content}</p>
                </div>

            </div>

        </div>
    )
}

export default ViewQn;