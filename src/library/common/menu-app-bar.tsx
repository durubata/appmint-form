import * as React from 'react';
import { withTooltip } from './tooltip';
import { classNames } from '../utils';
import { Icon } from './icons/icon';

const ButtonTP = withTooltip('button', 'bottom', -10, 0);

export const MenuAppBar = (props: { close; name; title; restore; docked?; canDock?; extension; collapsed; setDocked; setCollapsed }) => {
  const [pinned, setPinned] = React.useState(false);

  const pinBox = () => {
    const activeBoxes = document.querySelectorAll('.pined-float-box');
    activeBoxes.forEach(box => {
      box.classList.remove('pined-float-box');
    });

    if (!pinned) {
      const active = document.querySelector('.' + props.name);
      active.classList.add('pined-float-box');
    }

    setPinned(!pinned);
  };

  const stopBubble = e => {
    e.stopPropagation();
  };

  const isPined = document.querySelector('.' + props.name + '.pined-float-box') ? true : false;
  return (
    <div className="drag-zone floatbox-menubar" onClick={stopBubble}>
      <div className=" static text-gray-300 bg-gray-900 shadow transition-all duration-300  h-10 text-sm flex items-center justify-between pr-2 rounded-t-md">
        <div className="  flex items-center justify-between overflow-auto mr-28">
          <ButtonTP className="p-2" title="Dialog Menu">
            <Icon name='FaHamburger' />
          </ButtonTP>
          <span className=" whitespace-nowrap text-ellipsis">{props.title}</span>
        </div>
        {props.extension && <div className="mr-32">{props.extension}</div>}
        <div className={classNames(props.collapsed ? 'gap-0' : 'gap-1', 'flex absolute bg-gray-900 right-2  items-center justify-between ')}>
          <ButtonTP title="Reset Size" style={{ background: 'transparent' }} onClick={props.restore} color="inherit" className=" p-1">
            <Icon name="MdOutlineSettingsBackupRestore" color="white" />
          </ButtonTP>
          <ButtonTP title="Pin above all" onClick={pinBox} className={classNames(isPined ? 'bg-cyan-700' : '', 'p-1 rounded')}>
            <Icon name="BsPin" />
          </ButtonTP>
          {props.canDock && (
            <ButtonTP title={props.docked ? 'Docked' : 'UnDocked'} onClick={e => props.setDocked(!props.docked)} className="p-1">
              <Icon name={props.docked ? 'BsWindowFullscreen' : 'BiSolidDockRight'} />
            </ButtonTP>
          )}
          <ButtonTP title={props.collapsed ? 'Restore' : 'Collapse'} onClick={e => props.setCollapsed(!props.collapsed)} className="p-1">
            <Icon name={props.collapsed ? 'FaRegWindowMaximize' : 'FaWindowMinimize'} />
          </ButtonTP>
          <ButtonTP title="Close" onClick={props.close} className="p-1">
            <Icon name='FaXmark' />
          </ButtonTP>
        </div>
      </div>
    </div>
  );
};
