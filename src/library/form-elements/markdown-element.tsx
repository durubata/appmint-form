import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { getElementTheme, twMerge } from './common-imports';
import { getCodeString } from 'rehype-rewrite';
import mermaid from 'mermaid';

export const MarkdownElement = (props: { path; name, validate, Value, change, blur, className, ui, theme }) => {

  const handleChange = newContent => {
    if (props.change) {
      props.change(newContent);
    }
  };

  const handleBlur = newContent => {
    if (props.blur) {
      props.blur(newContent);
    }
  };

  const { classes, style } = (props.ui || {})['markdown'] || {};
  const controlTheme = getElementTheme('markdown', props.theme);

  return (
    <div>
      <MDEditor
        onChange={(newValue = '') => handleBlur(newValue)}
        textareaProps={{
          placeholder: 'Please enter Markdown text',
        }}
        height={600}
        value={props.value}
        previewOptions={{
          components: {
            code: Code,
          },
        }}
        className={twMerge(props.className, controlTheme.className, classes?.join(' '))}
        style={style}
        id={props.path}
      />
    </div>
  );
};


const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);
const Code = ({ inline, children = [], className, ...props }) => {
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState(null);
  const isMermaid = className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code = children ? getCodeString(props.node.children) : children[0] || '';

  useEffect(() => {
    if (container && isMermaid && demoid.current && code) {
      mermaid
        .render(demoid.current, code)
        .then(({ svg, bindFunctions }) => {
          container.innerHTML = svg;
          if (bindFunctions) {
            bindFunctions(container);
          }
        })
        .catch(error => {
          console.log('error:', error);
        });
    }
  }, [container, isMermaid, code, demoid]);

  const refElement = useCallback(node => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <Fragment>
        <code id={demoid.current} style={{ display: 'none' }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </Fragment>
    );
  }
  return <code className={className}>{children}</code>;
};
