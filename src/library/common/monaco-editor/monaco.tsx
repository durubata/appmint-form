import React, { useEffect, useState, useRef } from 'react';
import { CodeEditorAppBar } from './app-bar';
import { FloatBoxWithPortal } from '../float-box';
import { IconRenderer } from '../icons/icon-renderer';
import { Suspense } from 'react';

// Add Monaco to the window object
declare global {
  interface Window {
    monaco: any;
  }
}

// Simple Monaco Editor component using dynamic import
const MonacoEditorCDN = React.lazy(() => {
  return import('monaco-editor').then((monaco) => {
    // Create a component that uses Monaco
    const MonacoEditor = (props: any) => {
      const containerRef = useRef<HTMLDivElement>(null);
      const editorRef = useRef<any>(null);

      // Create editor on mount
      useEffect(() => {
        if (containerRef.current && !editorRef.current) {
          try {
            const editor = monaco.editor.create(containerRef.current, {
              value: props.value || '',
              language: props.language || 'javascript',
              theme: props.theme === 'vs-dark' ? 'vs-dark' : 'vs',
              automaticLayout: true,
              minimap: { enabled: false },
              ...props.options
            });

            editorRef.current = editor;

            // Call onMount callback
            if (props.onMount) {
              props.onMount(editor, monaco);
            }

            // Set up change handler
            editor.onDidChangeModelContent(() => {
              if (props.onChange) {
                props.onChange(editor.getValue());
              }
            });

            // Clean up on unmount
            return () => {
              editor.dispose();
            };
          } catch (error) {
            console.error('Error creating Monaco editor:', error);
          }
        }
      }, []);

      // Update editor value when props.value changes
      useEffect(() => {
        if (editorRef.current && props.value !== undefined) {
          try {
            const currentValue = editorRef.current.getValue();
            if (currentValue !== props.value) {
              editorRef.current.setValue(props.value);
            }
          } catch (error) {
            console.error('Error updating editor value:', error);
          }
        }
      }, [props.value]);

      // Update editor language when props.language changes
      useEffect(() => {
        if (editorRef.current && props.language) {
          try {
            const model = editorRef.current.getModel();
            if (model) {
              monaco.editor.setModelLanguage(model, props.language);
            }
          } catch (error) {
            console.error('Error updating editor language:', error);
          }
        }
      }, [props.language]);

      // Update editor theme when props.theme changes
      useEffect(() => {
        if (props.theme) {
          try {
            monaco.editor.setTheme(props.theme);
          } catch (error) {
            console.error('Error updating editor theme:', error);
          }
        }
      }, [props.theme]);

      return (
        <div
          ref={containerRef}
          style={{
            width: props.width || '100%',
            height: props.height || '600px'
          }}
        />
      );
    };

    return { default: MonacoEditor };
  }).catch((error) => {
    console.error('Failed to load Monaco editor:', error);

    // Fallback to a simple editor
    const SimpleEditor = (props: any) => {
      const [value, setValue] = useState(props.value || '');

      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (props.onChange) {
          props.onChange(newValue);
        }
      };

      return (
        <div>
          <label htmlFor="monaco-simple-editor" className="sr-only">Code Editor</label>
          <textarea
            id="monaco-simple-editor"
            value={value}
            onChange={handleChange}
            placeholder="Enter code here"
            aria-label="Code Editor"
            style={{
              width: props.width || '100%',
              height: props.height || '600px',
              fontFamily: 'monospace',
              padding: '10px',
              backgroundColor: props.theme === 'vs-dark' ? '#1e1e1e' : '#ffffff',
              color: props.theme === 'vs-dark' ? '#d4d4d4' : '#000000',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
      );
    };

    return { default: SimpleEditor };
  });
});

// Monaco editor loading placeholder
const EditorLoading = () => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    color: '#ffffff'
  }}>
    Loading editor...
  </div>
);

const computeStyle = () => {
  const pageScroll = document.getElementById('page-editor-container');
  if (!pageScroll) return { top: 100, left: '10%', width: '80%', maxWidth: 1200, height: 600 };
  const mousePos = pageScroll.getBoundingClientRect().height / 2 - 300;
  const left = '10%';
  return { top: mousePos, left: left, width: '80%', maxWidth: 1200, height: 600 };
};

export const MonacoCodeEditor = (props) => {
  const [mode, setMode] = useState(props.mode || 'javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [options, setOptions] = useState({});
  const [value, setValue] = useState('');
  const [name, setName] = useState(props.name);
  const [currentLine, setCurrentLine] = useState(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [useWindow, setUseWindow] = useState(props.useWindow || false);
  const [style, setStyle] = useState(useWindow ? computeStyle() : {});
  const [editorHeight, setEditorHeight] = useState(props.height || 600);
  const [updateTimeout, setUpdateTimeOut] = useState(null);

  useEffect(() => {
    if (typeof props.value === 'object') {
      setValue(JSON.stringify(props.value, null, 2));
    } else {
      setValue(props.value || '');
    }
  }, [props.value]);

  useEffect(() => {
    setOptions({ mode: mode });
  }, [mode]);

  useEffect(() => {
    if (editorRef.current && currentLine) {
      try {
        editorRef.current.setPosition({ lineNumber: currentLine, column: 1 });
        editorRef.current.focus();
        editorRef.current.revealLineInCenter(currentLine);
      } catch (error) {
        console.error('Error setting editor position:', error);
      }
    }
  }, [currentLine]);

  useEffect(() => {
    if (editorRef.current && monacoRef.current && props.showActiveLine) {
      try {
        const numberOfLines = editorRef.current.getModel().getLineCount();
        editorRef.current.revealLine(numberOfLines, {
          scrollType: monacoRef.current.editor.ScrollType.Smooth,
        });
        editorRef.current.revealLine(numberOfLines);
        editorRef.current.revealLineInCenter(numberOfLines);
      } catch (error) {
        console.error('Error revealing active line:', error);
      }
    }
  }, [editorRef.current?.getModel()?.getLineCount(), props.showActiveLine]);

  const handleEditorClick = (position) => {
    if (props.onEditorClick) {
      props.onEditorClick(position);
    }
  };

  const editorDidMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    if (editor.onMouseDown) {
      editor.onMouseDown((e) => {
        if (e.target && e.target.position) {
          handleEditorClick(e.target.position);
        }
      });
    }

    // Ensure Handlebars suggestions work
    if (monacoInstance && monacoInstance.languages.getLanguages().every(lang => lang.id !== 'handlebars')) {
      try {
        monacoInstance.languages.register({ id: 'handlebars' });
      } catch (error) {
        console.error('Error registering handlebars language:', error);
      }
    }
  };


  const onChange = (newValue) => {
    setValue(newValue);
    if (props.onChange) {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      const timeout = setTimeout(() => {
        props.onChange(newValue);
      }, 500);
      setUpdateTimeOut(timeout);
    }
  };

  const onSave = () => {
    if (props.save) {
      props.save(name, value);
    }
  };

  const onClose = () => {
    if (props.close) {
      props.close(value);
    }
  };

  const toggleUseWindow = () => {
    setStyle(computeStyle());
    setEditorHeight(600);
    setUseWindow(!useWindow);
  };

  const saveButton = props.save ? (
    <div className="editor-state-buttons">
      <button className="editor-button-save" aria-label="save" onClick={onSave}>
        <IconRenderer icon='Save' size={15} />
      </button>
    </div>
  ) : null;

  const useWindowButton = (
    <div className="editor-state-buttons">
      <button className="editor-button-save" aria-label="toggle window" onClick={toggleUseWindow}>
        <IconRenderer icon="Expand" size={15} />
      </button>
    </div>
  );

  const codeBarProps = {
    setName,
    name: props.name || 'new',
    mode,
    setMode,
    setTheme,
    onClose,
    onSave: props.save ? onSave : null,
  };

  const appBar = <CodeEditorAppBar {...codeBarProps} />;

  const getComponent = () => {
    const editorComponent = (
      <Suspense fallback={<EditorLoading />}>
        <MonacoEditorCDN
          options={options}
          language={mode.toLowerCase()}
          value={value}
          onChange={onChange}
          width="100%"
          height={editorHeight}
          theme={theme}
          onMount={editorDidMount}
        />
      </Suspense>
    );

    if (useWindow) {
      return (
        <FloatBoxWithPortal
          title="Code Editor"
          key="code-editor"
          name="code-editor"
          id="code-editor"
          close={onClose}
          style={style}
          overridePos={false}
          codeBar={codeBarProps}
          usePortal={true}
        >
          {editorComponent}
        </FloatBoxWithPortal>
      );
    } else {
      return (
        <div className="relative">
          {props.showAppBar ? <div className="mt-2">{appBar}</div> : props.value !== value && saveButton}
          <div style={{ minWidth: props.width || 600 }}></div>
          {props.expandable && useWindowButton}
          {editorComponent}
        </div>
      );
    }
  };
  return <div className="code-editor">{getComponent()}</div>;
};
