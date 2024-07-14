import React, { useEffect, useState, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { CodeEditorAppBar } from './app-bar';
import { Popover } from '../popover';
import { Icon } from '../icons/list';
import { classNames } from '../../utils';


const computeStyle = () => {
  const pageScroll: any = document.getElementById('page-editor')
  const mousePos = pageScroll.scrollTop + 300;
  const left = '10%'
  return { top: mousePos, left: left, width: '80%', maxWidth: 1200, height: 600 };
}


export const MonacoCodeEditor = (props: { showActiveLine?: boolean; expandable?; mode: string; name: string; value: string; width?: number; height?: number; showAppBar?: boolean; useWindow?: boolean; close?; save?}) => {

  const [mode, setMode] = useState(props.mode || 'javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [options, setOptions] = useState({});
  const [value, setValue] = useState<string>('');
  const [name, setName] = useState(props.name);
  const [currentLine, setCurrentLine] = useState(null);
  const editorRef = useRef(null);
  const monaco = useMonaco();
  const [useWindow, setUseWindow] = useState(props.useWindow || false);
  const [style, setStyle] = useState(useWindow ? computeStyle() : {});
  const [editorHeight, setEditorHeight] = useState(props.height || 600);
  let editorInstance = null;
  let monacoInstance = null;

  useEffect(() => {
    // eventEmitterHelper.registerListener(eventEmitterEventTypes.PageEditor_Component_Details_Clicked, handleElementClick)
  }, [, name]);


  useEffect(() => {
    setValue(props.value || '');
  }, [props.value]);

  useEffect(() => {
    const nOptions = { mode: mode };
    setOptions(nOptions);
  }, [mode, props.height]);

  useEffect(() => {
    if (editorRef.current && currentLine) {
      editorRef.current.setPosition({ lineNumber: currentLine, column: 1 });
      editorRef.current.focus();
      editorRef.current.revealLineInCenter(currentLine);
    }
  }, [currentLine]);


  useEffect(() => {
    if (editorRef.current && props.showActiveLine) {
      const numberOfLines = editorRef.current.getModel().getLineCount();
      editorRef.current.revealLine(numberOfLines, {
        scrollType: monaco.editor.ScrollType.Smooth
      });
      editorRef.current.revealLine(numberOfLines);
      editorRef.current.revealLineInCenter(numberOfLines);
    }
  }, [editorRef.current?.getModel()?.getLineCount()]);


  // useEffect(() => {
  //   // Example: Scroll to a snippet after the component mounts
  //   // Replace "snippetToFind" with your code snippet
  //   const snippetToFind = "function";
  //   scrollToSnippet(snippetToFind);
  // }, [monaco]);


  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editorInstance = editor;
    monacoInstance = monaco;
  };

  const handleElementClick = (content) => {
    const lines = value.split('\n');
    const lineIndex = lines.findIndex(line => line.includes(content.split(':')[2]));
    if (lineIndex !== -1) {
      if (editorRef.current) {
        editorRef.current.setPosition({ lineNumber: lineIndex + 1, column: 1 });
        editorRef.current.focus();
        editorRef.current.revealLineInCenter(lineIndex + 1);
      }
    }
  };

  const setCursorPosition = (lineNumber, column) => {
    if (editorInstance) {
      editorInstance.setPosition({ lineNumber, column });
      editorInstance.focus();
    }
  };

  const selectCodeBlock = (startLine, startColumn, endLine, endColumn) => {
    if (editorInstance) {
      const range = new monacoInstance.Range(startLine, startColumn, endLine, endColumn);
      editorInstance.setSelection(range);
      editorInstance.focus();
    }
  };

  const scrollToSnippet = (snippet) => {
    if (!editorRef.current || !monaco) return;

    const model = editorRef.current.getModel();
    const range = model.findNextMatch(snippet, { lineNumber: 1, column: 1 }, false, false, null, false);

    if (range) {
      editorRef.current.revealLineInCenter(range.range.startLineNumber);
      editorRef.current.setPosition({ lineNumber: range.range.startLineNumber, column: range.range.startColumn });
      editorRef.current.focus();
    }
  };

  const scrollToSnippet2 = (snippet) => {
    if (!editorRef.current || !monaco) return;

    const model = editorRef.current.getModel();
    const match = model.findNextMatch(snippet, { lineNumber: 1, column: 1 }, false, false, null, true);

    if (match) {
      const position = match.range.getStartPosition();
      editorRef.current.setPosition(position);
      editorRef.current.revealPositionInCenter(position);
      editorRef.current.focus();
    }
  };


  const onChange = (newValue, event) => {
    setValue(newValue);
  };

  const onSave = () => {
    if (props.save) {
      props.save(name, value);
    }
  };

  const onClose = () => {
    if (props.close) {
      props.close();
    }
  };

  const toggleUseWindow = (e) => {
    setStyle(computeStyle());
    setEditorHeight(600);
    setUseWindow(!useWindow);
  };

  const saveButton = (
    <div className="editor-state-buttons">
      <button className="editor-button-save" aria-label="save" color="inherit" onClick={onSave}>
        <Icon name='FaSave' size={15} />
      </button>
    </div>
  );

  const useWindowButton = (
    <div className="editor-state-buttons">
      <button className="editor-button-save" aria-label="save" color="inherit" onClick={toggleUseWindow}>
        <Icon name='LuExpand' size={15} />
      </button>
    </div>
  );

  const codeBarProps = { setName, name: props.name || 'new', mode, setMode, setTheme, onClose, onSave };
  const appBar = <CodeEditorAppBar {...codeBarProps} />;
  const getComponent = () => {
    if (useWindow) {
      return (
        <Popover position='context' className='min-w-[600px] max-h-[800px] overflow-auto' offsetY={-20} content={
          <Editor options={options} language={mode} value={value} onChange={onChange} width="100%" height={editorHeight} theme={theme} onMount={editorDidMount} />
        }>
          <button className={classNames('text-sm group  rounded-full flex items-center gap-2 shadow bg-white border border-gray-100 hover:bg-cyan-100 px-4 py-1 min-w-')}>
            {props.icon && <Icon name={props.icon} className={'group-hover:scale-120 duration-300 ease-in-out transition-all'} />}
            <span> {props.title}</span>
          </button>
        </Popover>

        // <FloatBox title="Code Editor" key="code-editor" name="code-editor" close={onClose} style={style} overridePos={true} codeBar={codeBarProps}>
        // </FloatBox>
      );
    } else {
      return (
        <div className='relative'>
          {props.showAppBar ? <div className="mt-2">{appBar}</div> : props.value !== value && saveButton}
          <div style={{ minWidth: props.width || 600 }}></div>{props.expandable && useWindowButton}
          <Editor options={options} language={mode?.toLowerCase()} value={value} onChange={onChange} width="100%" height={editorHeight} theme={theme} onMount={editorDidMount} />
        </div>
      );
    }
  };

  return <div className="code-editor">{getComponent()}</div>;
};


// Example: Select text from line 2, column 4 to line 4, column 10
// selectCodeBlock(2, 4, 4, 10);
