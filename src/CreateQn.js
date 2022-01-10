
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AddLinkIcon from '@mui/icons-material/AddLink';
import TagDropdown from './createQn/TagDropdown';
import Tag from './createQn/tag';

function CreateQn() {


  const [qnTitle, set_qnTitle] = useState('');
  const [qnBody, set_qnBody] = useState([]);
  const [selected, set_selected] = useState();

  const [tags, set_tags] = useState(["Whole Numbers", "Measurement", "Geometry", "Fractions", "Speed"]);
  const [selected_tags, set_selected_tags] = useState([]);
  const [shown_tags, set_shown_tags] = useState(["Whole Numbers", "Measurement", "Geometry", "Fractions", "Speed"]);

  // useEffect(() => {
  //   console.log('editing shown_tags');
  //   var temp_shown_tag = shown_tags;
  //   for (var i = 0; i < tags.length; i++) {
  //     var skip = false;
  //     for (var x = 0; x < selected_tags.length; x++) {

  //       if (tags[i].name === selected_tags[x]) {
  //         skip = true;
  //       }
  //     }

  //     if (!skip) {
  //       temp_shown_tag.push(tags[i]);
  //     }

  //   }
  //   set_shown_tags(temp_shown_tag);
  //   console.log(shown_tags);
  // }, [selected_tags])

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
                  <div className='border w-100 rounded-top'>
                    <div id='editor_toolbar' className=' btn-group'>
                      <div className='btn btn-outline-secondary border-0' onClick={() => { modifyDesign('bold') }}>
                        <FormatBoldIcon />
                      </div>
                      <div className='btn btn-outline-secondary border-0' onClick={() => { modifyDesign('italic') }}>
                        <FormatItalicIcon />
                      </div>
                      <div className='btn btn-outline-secondary border-0' onClick={() => { modifyDesign('createLink') }}>
                        <AddLinkIcon />
                      </div>

                    </div>
                  </div>
                  <div contentEditable='true' id='qn_body_textarea' className='form-control' style={{ overflow: 'scroll', resize: 'vertical', wordBreak: 'break-word', minHeight: '12vh' }}>
                  </div>
                </div>

                <label className='wip mt-3'>Tags</label>
                <div className=' form-text mt-0'>
                  Add some tags to help others find your question.
                </div>
                <div className='form-control d-flex'> 

                  {selected_tags.map((selected_tags) => <Tag tag={selected_tags}></Tag>)}
                  <p contentEditable='true' className='mb-0 px-3 bg-secondary text-white'></p>

                </div>
                <TagDropdown tags={tags} handleSelect={addTagSelect}></TagDropdown>
              </div>
            </form>
          </div>
        </div>
        <div className='col-lg-4'>
          <h5 >Left</h5>
        </div>
      </div>
      <div className="modal fade" id="add_url" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Insert Link</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <input id='wysiwyg_link' type='url' className='form-control' placeholder='https://www.qlassroom.ai/'></input>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => clearFormatting(true)}>Clear Formatting</button>
              <button type="button" id='addLinkBtn' className="btn btn-primary" onClick={addURL}>Add Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );


  function addTagSelect(tag) {
    var temp_selected_tags = selected_tags;
    var temp_tags = [];

    for(var i = 0; i < tags.length; i++) {
      if(tags[i] == tag) {

      }else {
        temp_tags.push(tags[i]);
      }
    }

    temp_selected_tags.push(tag);

    set_tags(temp_tags);
    set_selected_tags(temp_selected_tags);
  }

  function removeTagSelect(tag) {
    var temp_selected_tags = [];
    var temp_tags = tags;

    for(var i = 0; i < selected_tags.length; i++) {
      if(selected_tags[i] == tag) {

      }else {
        temp_selected_tags.push(selected_tags[i]);
      }
    }

    temp_tags.push(tag);

    set_tags(temp_tags);
    set_selected_tags(temp_selected_tags);
  }

  function onlyInEditor() {
    var current_selection_id = window.getSelection().anchorNode.parentElement.id;
    if (current_selection_id === 'qn_body_textarea') {
      return true;

    }
    else {
      return false;

    }
  }

  function saveSelection() {
    if (window.getSelection()) {
      var selection = window.getSelection();

      if (selection.getRangeAt && selection.rangeCount) {
        var range = []
        for (var i = 0; i < selection.rangeCount; i++) {
          range.push(selection.getRangeAt(i));
        }
        return set_selected(range);
      }
    } else if (document.selection && document.selection.createRange) {
      return set_selected(document.selection.createRange());
    }
    return null;
  }



  function modifyDesign(action) {

    if (action === 'createLink') {
      saveSelection();
      var link_modal = new Modal(document.getElementById('add_url'), { backdrop: 'static', keyboard: false });
      document.getElementById('wysiwyg_link').value = '';
      link_modal.toggle();
    }
    else {
      console.log('seting', action);
      document.execCommand(action, false);
    }

  }

  function restoreSelection() {
    if (selected) {
      var selection = window.getSelection();
      selection.removeAllRanges();
      for (var i = 0, len = selected.length; i < len; i++) {
        selection.addRange(selected[i]);
      }
    } else if (document.selection && selected.select) {
      selected.select();
    }
  }


  function addURL() {

    var link_url = document.getElementById('wysiwyg_link').value;
    console.log(link_url);

    var link_modal_element = document.getElementById('add_url');
    var link_modal = Modal.getInstance(link_modal_element);
    link_modal.toggle();

    restoreSelection();

    document.execCommand('createLink', false, link_url);

  }

  function clearFormatting(removeLink) {
    if (removeLink) {
      restoreSelection();
      document.execCommand('unlink', false);
    }

    console.log('removing format');
    document.execCommand('removeFormat', false);
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

}
export default CreateQn;