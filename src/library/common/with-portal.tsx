import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const withPortal = WrappedComponent => {
  return ({ usePortal, id, ...props }) => {
    const [container, setContainer] = useState(null);
    const [isIframe, setIsIframe] = useState(false);

    useEffect(() => {
      setIsIframe(window.self !== window.top);
    }, []);

    useEffect(() => {
      if (usePortal) {
        console.log('usePortal', isIframe);
        const targetDocument = isIframe ? window.top.document : document;

        let newContainer = targetDocument.getElementById(id + '-portal');
        if (!newContainer) {
          newContainer = targetDocument.createElement('div');
          newContainer.id = id + '-portal';
          targetDocument.body.appendChild(newContainer);
        }
        setContainer(newContainer);

        return () => {
          if (newContainer && newContainer.childNodes.length === 0) {
            try {
              targetDocument.body.removeChild(newContainer);
            } catch (e) {
              console.error(e);
            }
          }
        };
      }
    }, [id, usePortal, isIframe]);

    const content = <WrappedComponent {...props} />;

    if (usePortal && container) {
      return ReactDOM.createPortal(content, container);
    }

    return content;
  };
};

export default withPortal;
