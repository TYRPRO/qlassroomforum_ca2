import React, { useState, useEffect } from "react";

const Image = (props) => {
	const [imageSrc, setImageSrc] = useState("");

	useEffect(() => {
		const reader = new FileReader();
		reader.readAsDataURL(props.blob);
		reader.onloadend = function () {
			setImageSrc(reader.result);
		};
	}, [props.blob]);

	return <img style={{ width: "200px", height: "200px" }} src={imageSrc} alt={props.filename}></img>;
};

export default Image;
