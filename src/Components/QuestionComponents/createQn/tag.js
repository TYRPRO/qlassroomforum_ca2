import React from "react";

import "./TagDropdown.css";
import ClearIcon from "@mui/icons-material/Clear";

function Tag(props) {
	return (
		<span className="d-flex tag-name me-2 my-1 rounded" >
			<p className=' mb-0 ps-2 d-inline text-nowrap'>{props.tag.label_name}</p>
			<div className=' py-0 ms-1 px-1 rounded btn-tag-del' type='button' onClick={() => props.handleRemove(props.tag.label_name)}>
				<ClearIcon sx={{ fontSize: 24 }} />
			</div>
		</span>
	);
}

export default Tag;