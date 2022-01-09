import { useEffect, useState } from 'react';
import './TagDropdown.css'

function TagDropdown(props) {
    var tags = props.tags;
    var handleSelect = props.handleSelect;
    console.log("Rendering TagDropdown");

    return (
        <div  className="w-100 position-relative">
            <div className=" rounded position-absolute py-2 px-4 w-100 bg-white shadow border">
                <div className="row">
                    {tags.map((shown_tag) => <TagDropdownTag key={shown_tag + "key"} tag={shown_tag} handleSelect={handleSelect}/> /* <TagDropdownTag tag_name={shown_tag} handleSelect={handleSelect} /> */ )}
                </div>
            </div>
        </div>


    )

}


function TagDropdownTag(props) {

    var tag_name = props.tag;
    var tag_description = 'lorem ipsum dolor sit amet consectetur';
    var handleSelect = props.handleSelect;
    return (
        <div onClick={() => {handleSelect(tag_name)}} className="col-6 col-lg-4 py-1 px-1 rounded-3 tag-hover">
            <div className="row">
                <div>
                    <p className="d-inline-block px-2 rounded tag-name mb-1">
                        {tag_name}
                    </p>
                </div>

            </div>
            <div className="row">
                <div>
                    <p className='px-2'>
                        {tag_description}
                    </p>
                </div>
            </div>

        </div>
    )
}

export default TagDropdown;

