import React, { useEffect, useRef, useState } from 'react';
import BundledEditor from './bundle-editor'
// import { useFileManagerStore } from 'components/content/file-manager/fm-store';
import { objectRegisterUtil } from '../../../src/library/utils/callback-util';

export const RichEditor = (props: { id; data: any; updateContent: any; inline: boolean; immediate: boolean, height?, className?}) => {
  // const { showFileManager, closeFileManager } = useFileManagerStore(state => state, () => true);

  const [id, setId] = useState(props.id);
  const editorRef = useRef(null);
  const [content, setContent] = useState(props.data);

  useEffect(() => {
    setId(props.id);
    setContent(props.data);
  }, [props.id, props.data]);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const onBlur = update => {
    props.updateContent(id, update);
  };

  const handleFilePicker = (callback, value, meta) => {
    // Define what happens when the file is selected
    const onFileSelected = (files) => {
      files.forEach(file => {
        const ext = file.path.split('.').pop().toLowerCase();
        const title = file.path.split('/').pop();
        const fileUrl = file.url;

        // Check if it's an image or other file type
        if (meta.filetype === 'image' && ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
          callback(fileUrl, { alt: title });
        } else if (meta.filetype === 'file') {
          callback(fileUrl, { text: title, title: title });
        }
      });
      // closeFileManager(callbackId)
    }

    // Assuming showFileManager is your method to open the file manager
    // const callbackId = objectRegisterUtil.registerCallback(onFileSelected);
    // showFileManager(callbackId);
  };

  return (
    <>
      <BundledEditor
        onInit={(_evt, editor) => editorRef.current = editor}
        initialValue={content}
        init={{
          height: props.height || 350,
          menubar: false,
          plugins: [
            'advlist', 'searchreplace', 'accordion', 'save', 'table', 'emoticons', 'wordcount', 'a11ychecker', 'advcode', 'advtable', 'autolink', 'checklist', 'markdown', 'nonbreaking',
            'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'autosave', 'visualblocks', 'directionality', 'code', 'visualchars', 'pagebreak',
            'powerpaste', 'fullscreen', 'importcss', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'quickbars', 'codesample',
          ],
          toolbar: 'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
            ' align numlist bullist checklist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | ' +
            ' code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          file_picker_callback: handleFilePicker
        }}
        // onChange={(e) => setContent(e.target.getContent())}
        onBlur={(e) => onBlur(e.target.getContent())}
      />
    </>
  );
}