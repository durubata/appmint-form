import React, { useState } from 'react';
import { classNames, toTitleCase } from '../utils';
import { Icon } from '../common/icons/icon';
import { iconButtonClass, iconClass } from '../common/constants';
import { withTooltip } from '../common/tooltip';

export const tableButtonNames = [
  { name: 'refresh', icon: 'FaSync' },
  { name: 'delete', icon: 'FaTrash', className: 'text-red-500', confirm: true },
  { name: 'add', icon: 'FaPlus' },
  { name: 'select', icon: 'FaCheck' },
  // { name: 'Edit', icon: 'FaEdit' },
  { name: 'export', icon: 'FaFileExport' },
  { name: 'import', icon: 'FaFileImport' },
  // { name: 'Print', icon: 'FaPrint' },
];

const ButtonTP = withTooltip('button', 'bottom', 5, 0);
export const TableButtons: React.FC<any> = ({ onTableEvent, options, selectedRows }) => {
  const [buttonStates, setButtonStates] = useState({});

  const onClick = async (e, option) => {
    let name = e.currentTarget.name;
    const button = tableButtonNames.find(button => button.name === name);
    if (button?.confirm && !buttonStates[name]) {
      setButtonStates({ ...buttonStates, [name]: true });
      setTimeout(() => {
        setButtonStates({ ...buttonStates, [name]: false });
      }, 3000);
      return;
    } else if (button?.confirm && buttonStates[name]) {
      setButtonStates({ ...buttonStates, [name]: false });
    }

    if (onTableEvent) {
      await onTableEvent(name, option);
    }
  };

  const isReadOnly = options?.readOnly === true;
  return (
    <div className="flex gap-2 items-center mr-2">
      {tableButtonNames.map(button => {
        if (button.name !== 'refresh' && isReadOnly) return null;
        return (
          <ButtonTP onClick={onClick} title={toTitleCase(button.name)} key={button.name} name={button.name} type="button" className={classNames(iconButtonClass, button.className, 'relative')}>
            <Icon name={buttonStates[button.name] ? 'FaCheck' : button.icon} className={iconClass} />
            {button.name === 'select' && selectedRows.length > 0 && <span className='absolute -top-2 w-4 h-4 -right-2 flex items-center justify-center rounded-full text-xs bg-purple-700 text-white'>{selectedRows.length}</span>}
          </ButtonTP>
        );
      })}
    </div>
  );
};
