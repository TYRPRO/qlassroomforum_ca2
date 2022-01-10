import './TagDropdown.css'

function Tag(props) {
    return (
        <span contentEditable='false' className=" d-inline-block tag-name px-2 me-2 rounded" >
            {props.tag}
        </span>
    )
}

export default Tag;