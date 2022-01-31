/* eslint-disable no-unused-vars */
import React, { useState } from "react";
//import {useEffect} from "react";
import io from "socket.io-client";
import Chatbox from "./Chatbox";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { useSelector } from "react-redux";
//import { getUserDetails } from "../../store/actions/Common";
import "./chat.css";
const baseUrl = "https://qlassroombackend.herokuapp.com/";
//const baseUrl = "https://qlassroomforum.herokuapp.com/";

//const socket = io.connect(baseUrl);

const Chat = () => {
	const userDetails = useSelector((state) => state.Common.userDetails.user_id);
	//const dispatch = useDispatch();

	//const [username] = useState(userDetails.first_name + userDetails.last_name);
	const [username] = useState(useSelector((state) => state.Common.userDetails.user_id));
	const [roomid] = useState("E6262626");
	const [showchat, setShowchat] = useState(false);

	function JoinRoom() {
		const data = {
			roomid: roomid,
			username: userDetails,
		};
		//socket.emit("join", data);

	}

	const CloseChat = (data) => {
		setShowchat(data);
	};

	//useEffect(() => getUserDetails(dispatch), []);

	return <div>
		{!showchat ?
			<div className="ChatCircle" ><BsFillChatLeftDotsFill className="ChatCircleIcon" size={30} /></div>
			:
			<Chatbox roomid={roomid} username={userDetails} closeChat={CloseChat} />
		}
	</div>;
};

export default Chat;
