import React from 'react';
import { Icon } from '../common/icons/icon';
import { Popover } from '../form-view/common-imports';

export const TableColumns: React.FC<any> = ({ table }) => {
    const content = (
        // <div className="inline-block border border-gray-100 shadow rounded text-xs text-gray-600">
        <div className="inline-block">
            <div className="px-2 py-1 border-b border-gray-200">
                <label className="text-gray-600 text-xs font-bold flex items-center">
                    <input
                        {...{
                            type: 'checkbox',
                            checked: table.getIsAllColumnsVisible(),
                            onChange: table.getToggleAllColumnsVisibilityHandler(),
                            className: 'text-gray-600 rounded-lg border border-gray-400 mr-2',
                        }}
                    />
                    <span>Toggle All</span>
                </label>
            </div>
            {table.getAllLeafColumns().map(column => {
                return (
                    <div key={column.id} className="px-2 py-1 even:bg-slate-100">
                        <label className="text-gray-600 text-xs flex items-center">
                            <input
                                {...{
                                    type: 'checkbox',
                                    className: 'text-gray-600 rounded-lg border border-gray-400 mr-2',
                                    checked: column.getIsVisible(),
                                    onChange: column.getToggleVisibilityHandler(),
                                }}
                            />
                            <span>{column.id}</span>
                        </label>
                    </div>
                );
            })}
        </div>
    );

    return (
        <Popover content={content} position="context" offsetX={-20} offsetY={-40}>
            <button className="">
                <Icon name="BiColumns" />{' '}
            </button>
        </Popover>
    );
};
