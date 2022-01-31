import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai";
import Image from "../../helperFunctions/Image";
import { Input, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
const Chatbox = (props) => {
	Chatbox.propTypes = {
		closeChat: PropTypes.func,
		socket: PropTypes.object,
		roomid: PropTypes.string || PropTypes.number,
		user: PropTypes.string
	};
	var time; var hours; var minutes; var seconds;
	const [message, setMessage] = useState("");
	const [messageList, setMessageList] = useState([]);
	const [file, setFile] = useState([]);
	const [IsFileSelected, setIsFileSelected] = useState(false);

	// Caculate Current Time
	function CaculateTimeNow() {
		if (new Date(Date.now()).getHours() > 10) {
			hours = new Date(Date.now()).getHours();
		} else {
			hours = "0" + new Date(Date.now()).getHours();
		}

		if (new Date(Date.now()).getMinutes() > 10) {
			minutes = new Date(Date.now()).getMinutes();
		} else {
			minutes = "0" + new Date(Date.now()).getMinutes();
		}

		if (new Date(Date.now()).getSeconds() > 10) {
			seconds = new Date(Date.now()).getSeconds();
		} else {
			seconds = "0" + new Date(Date.now()).getSeconds();
		}

		time = hours + ":" + minutes + ":" + seconds;
		return time;
	}

	// Send text/file
	async function SendMessage() {
		if (file.length != 0) {
			CaculateTimeNow();
			const data = {
				body: file,
				user: props.username,
				filename: file.name,
				time: time
			};
			setFile([]);
			let isMounted = true;
			if (isMounted) {
				await props.socket.emit("sendmessage", data);
				setIsFileSelected(false);
				setMessage("");
				setMessageList((list) => [...list, data]);
			}
			return () => { isMounted = false; };
		}
		else if (message != "" && message != undefined) {
			CaculateTimeNow();
			// Setting data 
			const data = {
				roomid: props.roomid,
				user: props.username,
				message: message,
				time: time,
			};
			// Send message socket
			await props.socket.emit("sendmessage", data);
			setMessage("");
		}
	}

	// Close Chat
	function CloseChat() {
		setMessageList([]);
		const data = {
			roomid: props.roomid
		};
		props.socket.emit("leave", data);
		props.closeChat(false);
	}

	// Selecting file for upload
	function selectFile(event) {
		let file = event.target.files[0];
		setMessage(file.name);
		setIsFileSelected(true);
		setFile(file);
	}

	// Auto scrolling to most current message
	const messagesEndRef = useRef(null);
	const scrollToBottom = () => {
		if (messagesEndRef && messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};
	useEffect(() => scrollToBottom, [messageList]);

	// Receiving message
	useEffect(() => {
		let isMounted = true;
		props.socket.on("receivemessage", (data) => {
			// Add message to messagelist
			if (isMounted) {
				setMessageList((list) => [...list, data]);
			}
			return () => { isMounted = false; };
		});
	}, [props.socket]);

	function renderChat(data, index) {
		if (data.filename == undefined) {
			return (
				<div key={index} ref={messagesEndRef}>
					{data.user == props.username ?
						<div className="MyMessageBody">
							<div><h1 className="MyMessage">{data.message}</h1></div>
							<div><p className="Time">{data.time}</p></div>
						</div>
						:
						<div key={index} className="MessageBody">
							<div><p className="Time">{data.time}</p></div>
							<div><h1 className="Message">{data.message}</h1></div>
						</div>
					}
				</div>
			);
		}
		else {
			const blob = new Blob([data.body], { type: data.filetype });
			return (
				<div key={index} ref={messagesEndRef}>
					{data.user == props.username ?
						<div className="MyMessageBody">
							<div><h1 className="MyMessage"><Image filename={data.filename} blob={blob}></Image></h1></div>
							<div><p className="Time">{data.time}</p></div>
						</div>
						:
						<div key={index} className="MessageBody">
							<div><h1 className="Message"><Image filename={data.filename} blob={blob}></Image></h1></div>
						</div>
					}
				</div>
			);
		}
	}

	return <div className="ChatBox">
		<div className="ChatHeader">
			<p>Qlassroom Chat 	<AiOutlineClose className="CloseIcon" size={20} onClick={CloseChat} /></p>
		</div>
		<div className="ChatBody">
			{messageList.map(renderChat)}
		</div>
		<div className="ChatFooter">
			<label htmlFor="icon-button-file">
				<IconButton color="primary" aria-label="upload picture" component="span">
					<Input accept="image/*" id="icon-button-file" type="file" style={{ display: "none" }} onChange={selectFile} />
					<AddIcon />
				</IconButton>
			</label>
			<input className="MessageInput" type="text" placeholder="Type your message" value={message}  disabled={IsFileSelected ? true : false}
				onChange={(event) => setMessage(event.target.value)} onKeyPress={(event) => event.key === "Enter" && SendMessage()}>
			</input>
			<button className="SubmitMessage" onClick={SendMessage}>&#9658;</button>
		</div>
	</div>;
};

export default Chatbox;
