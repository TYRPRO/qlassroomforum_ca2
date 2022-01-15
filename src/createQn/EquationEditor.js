import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from "bootstrap/dist/js/bootstrap.bundle";
import { useEffect, useState, useRef } from "react";
import React from 'react';
import ReactDOM from 'react-dom';

import { MathJax, MathJaxContext } from 'better-react-mathjax'

function EquationEditor(props) {


    const config = {
        loader: { load: ['input/asciimath'] }
    }

    var append_ref = props.toAppend;
    useEffect(() => {
        var editor = new Modal(document.getElementById('equation_editor'), {
            backdrop: true,
            keyboard: true,
            focus: true,
        }
        )
        editor.hide();

        var editorEl = document.getElementById('equation_editor');
        editorEl.addEventListener('hide.bs.modal', function (e) {
            var appendElement = document.getElementById(append_ref);

            if(appendElement.innerHTML.length == 0) {
                document.getElementById(append_ref).remove();
            }

            props.handleBlur(true)
        })
    }, []);
    useEffect(() => {
        if (props.hide == false) {
            var editorEl = document.querySelector('#equation_editor');
            var editor = Modal.getInstance(editorEl);

            editor.show();
        }
    }, [props.hide])


    const [eqn_input, set_eqn_input] = useState('');
    function handleInputChange() {
        set_eqn_input(document.getElementById('eqn_input').value);
    }


    function appendEquation() {
        function EqnOutput() {
            return (
                <span className='d-inline shadow-sm border-light p-1'>
                    <MathJaxContext>
                        <MathJax dynamic='false' inline='true'>
                            {`\`${eqn_input}\``}
                        </MathJax>
                    </MathJaxContext>
                </span>
            )
        }
        ReactDOM.render(<EqnOutput/>, document.getElementById(append_ref));
        console.log(props.toIncrease)
        props.toIncrease[1](props.toIncrease[0] + 1);
        props.handleChange();
    }


    return (
        <div className="modal m-auto fade" id="equation_editor" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} >
            <div className="modal-dialog">
                <div id='editor_content' className="modal-content" tabIndex={0}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Insert Equation</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <input onChange={handleInputChange} id='eqn_input' type='url' className='form-control' placeholder='Type equations here...'></input>

                        <p className='mt-3 mb-0'>Result Equation</p>
                        <div className='rounded p-3 shadow align-top' style={{ backgroundColor: '#f6f6f6' }}>
                            <MathJaxContext config={config}>
                                <MathJax dynamic='true'>{`\`${eqn_input}\``}</MathJax>
                            </MathJaxContext>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Clear Formatting</button>
                        <button type="button" id='addLinkBtn' className="btn btn-primary" onClick={appendEquation}>Add Link</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EquationEditor;