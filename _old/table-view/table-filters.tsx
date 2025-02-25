

import React, { useEffect } from 'react';
import { Icon } from '../common/icons/list';
import { DebouncedInput } from '../common/debounced-input';
import { classNames } from '../utils';
import { Popover } from '../common/popover';
import { buttonClass, buttonHoverClass } from '../../src/library/utils/constants';

export const TableFilters: React.FC<any> = ({ table }) => {
    const [filter, setFilter] = React.useState<any>({});

    useEffect(() => {
        const _filter = table.getAllLeafColumns().map(column => {
            return {
                [column.id]: column.filterValue
            }
        })
    }, [table]);

    const clearAllFilters = () => {
        table.getAllLeafColumns().map(column => {
            column.setFilterValue('');
        })
        setFilter({});
    }

    const setColumnFilter = (column, value) => {
        column.setFilterValue(value)
        setFilter({ ...filter, [column.id]: value });
    }

    const content = (
        // <div className="inline-block border border-gray-100 shadow rounded text-xs text-gray-600">
        <div className="inline-block">
            <div className="px-2 py-1  mb-2">
                <button
                    className={classNames(buttonClass, buttonHoverClass)}
                    onClick={clearAllFilters}
                >
                    <Icon name='FaXmark' />  <span>Clear All</span>
                </button>
            </div>
            {table.getAllLeafColumns().map(column => {
                return (
                    <div key={column.id} className="px-2 py-1 even:bg-slate-100">
                        <label className='text-gray-600 text-xs flex items-center gap-2'>
                            <span className=' text-ellipsis w-24 whitespace-nowrap '>{column.id}:</span>
                            <DebouncedInput
                                className="filter-input  border rounded  border-gray-300 text-xs  px-2 py-1 "
                                onChange={value => setColumnFilter(column, value)}
                                placeholder={`Search...`}
                                type="text"
                                value={filter[column.id] || ''}
                            />
                        </label>
                    </div>
                )
            })}
        </div>
    );

    return <Popover className={''} content={content} position="context" offsetX={-20} offsetY={-40} >
        <button title='Filter' className=""><Icon name='FiFilter' /> </button>
    </Popover>
};
