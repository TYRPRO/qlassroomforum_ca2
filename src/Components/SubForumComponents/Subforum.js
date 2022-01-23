import React, { useEffect } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { useSelector, useDispatch } from "react-redux";
import { getPosts, populateCurrentPosts, setCurrentPageNum, filterPosts } from "../../store/actions/Subforum";

import "./subForum.css";
import "../../Common/common.css";
import Channel from "../ChannelComponents/Channel";
import "../HomeComponents/Home.css";
import Post from "../PostComponent/Post";

const Subforum = () => {
	const isLoadingPosts = useSelector((state) => state.Subforum.isLoadingPosts);
	const currentPage = useSelector((state) => state.Subforum.currentPage);
	const maxPage = useSelector((state) => state.Subforum.maxPage);
	const posts = useSelector((state) => state.Subforum.posts);
	const currentPagePosts = useSelector((state) => state.Subforum.currentPagePosts);
	const dispatch = useDispatch();
	const pathname = window.location.pathname;
	const subforum_id = pathname.split("/")[2];

	function NextPage() {
		if (currentPage < maxPage) {
			dispatch(populateCurrentPosts(posts.slice(currentPage * 4, (currentPage * 4) + 4)));
			dispatch(setCurrentPageNum(currentPage + 1));
		}
	}
	function PrevPage() {
		if (currentPage != 1) {
			dispatch(populateCurrentPosts(posts.slice((currentPage - 2) * 4), ((currentPage - 1) * 4)));
			dispatch(setCurrentPageNum(currentPage - 1));
		}
	}

	const ChannelDataHandler = (ChannelFilterData) => {
		filterPosts(dispatch, ChannelFilterData);

	};

	useEffect(() => {
		getPosts(dispatch, subforum_id, toast);
	}, []);

	return (
		<React.Fragment>
			<ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
			<div className="row m-2 container">
				<div className="container-fluid">
					<div className='container'>
						{isLoadingPosts ? <h1 className="text-center">Loading Posts...</h1> :
							<div className='row'>
								<Channel onFilterPost={ChannelDataHandler} hideSubject={true} subforum_id={subforum_id} />
								<div className="col-lg-9">
									<div className="post-margin">
										<label>{currentPage == 1 ? currentPage : (currentPage - 1) * 4}-{posts.length > currentPage * 4 ? currentPage * 4 : posts.length} of {posts.length} Questions</label>
										<Post Posts={currentPagePosts} />
									</div>
									<div className="d-flex justify-content-between">
										<div onClick={PrevPage} style={{ cursor: "pointer" }}><i className="fa fa-caret-left"></i><b className="PrevPage">Prev Page</b></div>
										<p className="">{currentPage} out of {maxPage}</p>
										<div onClick={NextPage} style={{ cursor: "pointer" }}><b className="NextPage">Next Page</b><i className="fa fa-caret-right"></i></div>
									</div>
								</div>
							</div>
						}
					</div>
				</div >
			</div>
		</React.Fragment>
	);
};

export default Subforum;
