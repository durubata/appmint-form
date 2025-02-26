import React, { useEffect, useRef, useState } from 'react';
import { localStorageUtils } from '../utils/localstorage';
import withPortal from './with-portal';
import { Icon } from './icons/icon';
import { dragElement } from '../utils/drag-element';
// import { CodeEditorAppBar } from './code-editor/app-bar';
import { MenuAppBar } from './menu-app-bar';

const defaultStyle = {
  left: '20%',
  top: 'calc(30% / 4)',
  width: '70%',
  height: '70%',
};

const dockedStyle = {
  right: '50px',
  top: '60px',
  width: '400px',
  height: '80vh',
  left: 'unset',
  display: 'block',
};

export function FloatBox(props: { name; title; close; children; style?; resizable?; canDock?; docked?; overridePos?; hideMenuBar?; codeBar?; onResized?; frameDocument?}) {
  const startStyle = props.style ? { ...props.style } : defaultStyle;
  const [style, setStyle] = useState({ ...startStyle, display: 'none' });
  const [config, setConfig] = useState<any>();
  const [propName, setPropName] = useState<string>();
  const [configPath, setConfigPath] = useState<string>();
  const [isResizing, setIsResizing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [docked, setDocked] = useState();

  const ref = useRef<any>(null);

  useEffect(() => {
    window.addEventListener('resize', checkWindowPosition);
    return () => {
      window.removeEventListener('resize', checkWindowPosition);
    };
  }, []);

  useEffect(() => {
    let resizeObserver;
    if (ref.current && props.onResized) {
      resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          props.onResized({ width, height });
        }
      });
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver?.disconnect();
    };
  }, [ref.current]);

  useEffect(() => {
    if (propName) {
      const top = ref.current.offsetTop;
      const left = ref.current.offsetLeft;
      dragElement('.' + propName, { top: top + 'px', left: left + 'px' });
      ref.current.click();

      if (props.overridePos) {
        setStyle(props.style);
      } else if (props.name !== 'float-window') {
        const savedConfig = localStorageUtils.get(configPath);
        if (typeof savedConfig === 'object') {
          if (savedConfig && savedConfig.style) {
            setStyle({ ...style, ...savedConfig.style, display: 'block' });
            setConfig(savedConfig);
          } else {
            setStyle({ ...startStyle, display: 'block' });
            localStorageUtils.remove(configPath);
          }
        } else {
          setStyle({ ...startStyle, display: 'block' });
        }
      } else {
        setStyle(props.style);
      }

      if (props.docked) dockUnDockComponent('dock');
    }
  }, [propName, props.style, props.docked]);

  useEffect(() => {
    const pName = 'float-box-' + props.name;
    setPropName(pName);
    setConfigPath(`${pName}`);
    makeActive(null);
  }, [props.style, props.name, props.title, props.codeBar]);

  useEffect(() => {
    if (docked) {
      if (style.width !== dockedStyle.width && style.height !== dockedStyle.height) {
        savePosition();
      }
      dockUnDockComponent('dock');
    } else {
      if (style.width === dockedStyle.width && style.height === dockedStyle.height) {
        dockUnDockComponent('un-dock');
      }
    }
  }, [docked]);

  const dockUnDockComponent = (mode: 'dock' | 'un-dock') => {
    if (mode === 'dock') {
      const newStyle = { ...style, ...dockedStyle };
      setStyle(newStyle);
    } else if (mode === 'un-dock') {
      const savedConfig = localStorageUtils.get(configPath);
      let newStyle = { ...style };
      Object.keys(dockedStyle).forEach(key => {
        newStyle[key] = dockedStyle[key];
      });
      newStyle = { ...newStyle, ...(savedConfig?.style || {}), display: 'block' };
      setStyle(newStyle);
    }
  };

  const checkWindowPosition = () => {
    const topPosition = ref.current.offsetTop;
    if (topPosition < 0) {
      ref.current.style.top = '0px';
    }
    //check if is out of the screen then reset it
    const leftPosition = ref.current.offsetLeft;
    if (leftPosition < 0) {
      ref.current.style.left = '0px';
    }

    const rightPosition = ref.current.offsetLeft + ref.current.offsetWidth;
    if (rightPosition > window.innerWidth) {
      ref.current.style.left = window.innerWidth - ref.current.offsetWidth + 'px';
    }

    //check height make sure is small than the screen height except if screen is small than 800px
    const height = ref.current.offsetHeight;
    if (height > window.innerHeight && window.innerHeight > 800) {
      ref.current.style.height = window.innerHeight - 50 + 'px';
    }
  };

  const savePosition = () => {
    if (collapsed || docked) return;
    checkWindowPosition();
    const rect = ref.current.getBoundingClientRect();
    const pos = { left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px', height: rect.height + 'px' };
    localStorageUtils.set(`${configPath}`, JSON.stringify({ style: pos }));
  };

  const startResizing = mouseDownEvent => {
    setIsResizing(true);

    const startWidth = ref.current.offsetWidth;
    const startHeight = ref.current.offsetHeight;
    const startX = mouseDownEvent.clientX;
    const startY = mouseDownEvent.clientY;

    const doResize = mouseMoveEvent => {
      const newWidth = startWidth + mouseMoveEvent.clientX - startX;
      const newHeight = startHeight + mouseMoveEvent.clientY - startY;
      setStyle({ ...style, width: newWidth + 'px', height: newHeight + 'px' });
    };

    const stopResizing = () => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResizing);
      setIsResizing(false);
      savePosition();
    };

    window.addEventListener('mousemove', doResize);
    window.addEventListener('mouseup', stopResizing);
  };

  const makeActive = e => {
    e?.stopPropagation();
    const activeBoxes = document.querySelectorAll('.active-float-box');
    if (activeBoxes) {
      activeBoxes.forEach(box => {
        box.classList.remove('active-float-box');
      });
    }

    const active = document.querySelector('.' + propName);
    if (active) {
      active.classList.add('active-float-box');
      active.classList.remove('active');
    }
  };
  const restore = () => {
    setStyle({ ...startStyle, display: 'block' });
    savePosition();
  };

  let barExt;
  if (props.codeBar) {
    const { setName, mode, setMode, setTheme, onClose, onSave } = props.codeBar;
    // barExt = <CodeEditorAppBar setName={setName} name={props.name ? props.name : 'new'} mode={mode} setMode={setMode} setTheme={setTheme} onClose={onClose} onSave={onSave} />;
  }
  return (
    <div className={propName} style={collapsed ? { ...style, height: '40px', width: '300px' } : style} onMouseUp={savePosition} ref={ref} onMouseDown={makeActive} onClick={makeActive}>
      <div className="inner-container">
        <MenuAppBar
          close={props.close}
          extension={collapsed ? null : barExt}
          title={props.title}
          name={propName}
          restore={restore}
          docked={docked}
          canDock={props.canDock}
          collapsed={collapsed}
          setDocked={setDocked}
          setCollapsed={setCollapsed}
        />
        {!collapsed && (
          <div className="content-zone">
            <div className="content-zone-scroll">{props.children}</div>
          </div>
        )}
      </div>
      {!collapsed && props.resizable && (
        <div className="resize-handle cursor-nwse-resize absolute bottom-1 right-1 rotate-90 z-10" onMouseDown={startResizing}>
          <Icon name="GiResize" />
        </div>
      )}
    </div>
  );
}

const FloatBoxWithPortal = withPortal(FloatBox);
export { FloatBoxWithPortal };
