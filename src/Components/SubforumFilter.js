import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {setLevelFilter} from "../store/actions/Subforum"

const SubforumFilter = () => {
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <h4 className="p-4">Filter</h4>
      <form className="mx-5 justify-content-center">
        <label>Level:</label>
        <br />
        <select className="form-select" onChange={(event)=>dispatch(setLevelFilter(event.target.value))}>
          <option value="S1">Secondary 1</option>
          <option value="S2">Secondary 2</option>
          <option value="S3">Secondary 3</option>
          <option value="S4">Secondary 4</option>
          <option value="S5">Secondary 5</option>
        </select>
        <br />

        <input type="checkbox" className="me-3" id="unansweredCheckbox" name="unansweredCheckbox" value="unansweredCheckbox" />
        <label htmlFor="unansweredCheckbox">Unanswered</label>
        <div className="text-center p-3">
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default SubforumFilter;
