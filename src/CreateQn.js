
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AddLinkIcon from '@mui/icons-material/AddLink';
import Bold from './wysiwyg_editor/bold'

function CreateQn() {


  const [qnTitle, set_qnTitle] = useState('');
  const [qnBody, set_qnBody] = useState([]);


  return (
    <div className="container">
      <div className='row'>
        <div className='col-12 col-lg-8'>
          <h3>Ask a Question</h3>
          <div className=' bg-white py-3 px-4 shadow-sm border'>
            <form>
              <div className="form-group">
                <label htmlFor='qn_title'>Question Title</label>
                <div className=' form-text mt-0'>
                  Be specific and imagine you are asking a question to another person.
                </div>
                <input type="text" name='qn_title' className=' form-control' placeholder={'e.g. Find the intercept between y=2x and 12=2y+x. '}></input>

                <label htmlFor='qn_body' className='mt-2'>Body</label>
                <div className=' form-text mt-0'>
                  Include all the information someone would need to answer your question
                </div>
                <div id='wysiwyg_editor'>
                  
                  <div id='editor_toolbar' className=' btn-group'>
                    <div className='btn btn-outline-secondary' onClick={() => {modifyDesign('bold')}}>
                    <FormatBoldIcon/>
                    </div>
                    <div className='btn btn-outline-secondary' onClick={() => {modifyDesign('italic')}}>
                    <FormatItalicIcon />
                    </div>
                    <div className='btn btn-outline-secondary' onClick={() => {modifyDesign('createLink')}}>
                      <AddLinkIcon />
                    </div>

                  </div>
                  <div contentEditable='true' id='qn_body_textarea' className='form-control' style={{overflow: 'scroll',resize:'vertical', wordBreak: 'break-word',minHeight: '12vh'}}>
                  </div>
                </div>

                <label className='wip mt-3'>Tags</label>
                <div className=' form-text mt-0'>
                  Add some tags to help others find your question.
                </div>
                <input type='text' name='qn_tags' className='form-control'></input>
              </div>
            </form>
          </div>
        </div>
        <div className='col-lg-4'>
          <h5 >Left</h5>
        </div>
      </div>
    </div>
  );


  function onlyInEditor() {
    var current_selection_id = window.getSelection().anchorNode.parentElement.id;
    if (current_selection_id === 'qn_body_textarea') {
      return true;

    }
    else {
      return false;

    }
  }

// Don't delete these functions. The current method of changing design is not supported by W3C.
// Most browsers are phasing out execCommand();

//   function highlightText() {
// //    if(onlyInEditor()) {

//       var text_area = document.getElementById('qn_body_textarea').innerHTML;
//       console.log(text_area)
//       var store_br = [...text_area.matchAll(new RegExp(/<br>/, 'gi'))].map(a => a.index)
//       console.log(store_br);


//       var array_qn_body = document.getElementById('qn_body_textarea').innerHTML.split('');
//       var selected = window.getSelection().getRangeAt(0);
//       console.log(array_qn_body)
//       array_qn_body[selected.startOffset] = '<b>' + array_qn_body[selected.startOffset];
//       array_qn_body[selected.endOffset] = array_qn_body[selected.endOffset] + '</b>';
//       console.log(array_qn_body);
//       var string_output = array_qn_body.join('');
//       console.log(string_output);

//       document.getElementById('qn_body_textarea').innerHTML = string_output;
//     }
// //  }

  // function highlightText() {
  //   var selected = window.getSelection();
  //   var selected_range = selected.getRangeAt(0);
  //   var text_area = document.getElementById('qn_body_textarea');


  //   var startOffset = selected_range.startOffset;
  //   var endOffset = selected_range.endOffset;
  //   for(var i = startOffset; i < endOffset; i++ ) {
  //     var range = document.createRange();
  //     range.setStart(text_area, i);
  //     range.setEnd(text_area, i);
  //     range.surroundContents(document.createElement('b'));

  //   }
  //   // selected.surroundContents(document.createElement('strong'));
  // }
  
  // function highlightText() {

  //   console.log(window.getSelection());
  //   console.log(window.getSelection().getRangeAt(0));
  //   var selected_range = window.getSelection().getRangeAt(0);
  //   var startOffset = selected_range.startOffset;
  //   var endOffset = selected_range.endOffset;
  //   var text_area = document.getElementById('qn_body_textarea');


  //   var array_split = []
  //   var start_split = text_area.innerText.slice(0, startOffset);
  //   array_split.push(start_split);

  //   for(var i = startOffset; i < endOffset; i++ ) {
  //     var selected_split = text_area.innerText.slice(i, i+1);
  //     array_split.push('<b>' + selected_split + '</b>');
  //   }
  //   var end_split = text_area.innerText.slice(endOffset);
  //   array_split.push(end_split);
    

  //   //var selected_split = text_area.innerText.slice(startOffset, endOffset);
  //   console.log(array_split);
  //   text_area.innerHTML = array_split.join('');
  // }

  function modifyDesign(action) {
    if(onlyInEditor()) {

      if(action === 'createLink') {
        
      }
      else {
        document.execCommand(action, false, null);
      }

    }

  }
}

export default CreateQn;