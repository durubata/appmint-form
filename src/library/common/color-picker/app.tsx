import React, { useEffect, useState } from 'react';
import { GithubPicker, SketchPicker, ChromePicker, PhotoshopPicker } from 'react-color';
import { useColorPickerStore } from './color-picker-store';
import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker';
import { Popover } from '../popover';
import { useShallow } from 'zustand/shallow';
import { colorUtils } from '../color-utils';
import { IconRenderer } from '../icons/icon-renderer';

export const CommonColorPicker = (props: { color; updateColor; type; toggle?; useFloatBox?; floatBoxPos?; style?; icon?; className?}) => {
  const [colorTemp, setColorTemp] = useState('#000000');
  const [gradient, setGradient] = useState('rgba(255, 255, 255, 1)');
  const { color, setColor } = useColorPickerStore(useShallow(state => ({ color: state.color, setColor: state.setColor })));
  const [popoverState, setPopoverState] = useState({ timestamp: Date.now(), isOpen: false });
  const { valueToHSL, valueToHSV, valueToHex, valueToCmyk, rgbaArr, hslArr } = useColorPicker(gradient, setGradient);

  useEffect(() => {
    setColorTemp(props.color);
  }, [props.color]);

  const handleChangeComplete = _color => {
    const rgb = `rgba(${Object.values(_color.rgb).join(',')})`;
    if (props.updateColor) props.updateColor(_color);
    setColor(rgb);
    // setPopoverState({ timestamp: Date.now(), show: false });
  };

  const handleGradientChange = _color => {
    setGradient(_color);
    const gColor = { hex: valueToHex(), rgb: rgbaArr };
    if (_color.includes('gradient')) {
      gColor['gradient'] = _color;
    }

    if (props.type === 'gradient') {
      // const [r, g, b, a] = gColor.rgb;
      // gColor['rgb'] = { r, g, b, a };
    }
    if (props.updateColor) props.updateColor(gColor);
  };

  const handleChange = _color => {
    const rgb = `rgba(${Object.values(_color.rgb).join(',')})`;
    setColorTemp(rgb);
  };

  const onCancel = () => {
    setColorTemp(color);
    setPopoverState({ timestamp: Date.now(), isOpen: false });
  }

  const onAccept = () => {
    setColor(colorTemp);
    setPopoverState({ timestamp: Date.now(), isOpen: false });
  }

  const getPicker = () => {
    let selPicker;
    switch (props.type) {
      case 'sketch':
        selPicker = <SketchPicker className="sketch-picker" onChangeComplete={handleChangeComplete} color={colorTemp || '#000'} onChange={handleChange} />;
        break;
      case 'chrome':
        selPicker = <ChromePicker className="chrome-picker" onChangeComplete={handleChangeComplete} color={colorTemp || '#000'} onChange={handleChange} />;
        break;
      case 'photoshop':
        selPicker = <PhotoshopPicker className="photoshop-picker" onChangeComplete={handleChangeComplete} color={colorTemp || '#000'} onChange={handleChange} onCancel={onCancel} onAccept={onAccept} />;
        break;
      case 'gradient':
        selPicker = (
          <div className="p-2 shadow bg-white border-gray-100 border-2">
            <ColorPicker height={250} value={gradient} onChange={handleGradientChange} />
          </div>
        );
        break;
      default:
        selPicker = <GithubPicker className="github-picker" onChangeComplete={handleChangeComplete} color={colorTemp || '#000'} onChange={handleChange} />;
        break;
    }

    if (props.useFloatBox) {
      const pos = props.floatBoxPos || { top: '20px', left: '25px' };
      return <div style={{ position: 'absolute', zIndex: 100, ...pos }}>{selPicker}</div>;
    } else {
      return selPicker;
    }
  };


  const toggleButton = () => {
    return (<Popover position="context" offsetY={0} content={getPicker()}  >
      <button className={props.className} onClick={e => setPopoverState({ timestamp: Date.now(), isOpen: !popoverState.isOpen })} style={{ ...props.style, backgroundColor: colorTemp }} >
        {typeof props.icon === 'string' ? <IconRenderer color={colorTemp ? colorUtils.getInverseColor(colorTemp) : undefined} icon={props.icon} className={' '} /> : props.icon}
      </button>
    </Popover >);
  };
  return <div className="color-picker-wrapper">{props.toggle ? toggleButton() : getPicker()}</div>;
};



