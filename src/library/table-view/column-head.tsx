import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { classNames } from '../utils';
import { Icon } from '../form-elements/common-imports';

const sortIcons = {
    asc: <Icon name="HiOutlineArrowNarrowUp" />,
    desc: <Icon name="HiOutlineArrowNarrowDown" />,
    none: <Icon name="CgArrowsVAlt" />,
};

export const ColumnHead: React.FC<any> = ({ header }) => {
    const columnFilterValue = header.column.getFilterValue();

    const canSort = header.column.getCanSort();
    const sortDirection = header.column.getIsSorted();

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', header.id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        const draggedId = e.dataTransfer.getData('text/plain');
        // if (draggedId !== header.id) {
        //     onGroupToggle(draggedId, header.id);
        // }
    };

    return (
        <thead className="sticky top-0" onDragOver={handleDragOver} onDrop={handleDrop}>
            <div className="header-item text-gray-500 group">
                <div className="flex gap-1 items-center mb-1">
                    <div className="drag-handle cursor-grabbing " draggable onDragStart={handleDragStart}>
                        <Icon name="RiDraggable" />
                    </div>
                    <div onClick={header.column.getToggleSortingHandler()} className={classNames(`sort-button`, canSort ? 'sortable' : '', 'w-full whitespace-nowrap text-ellipsis text-sm')}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {canSort && (
                        <div className="sort-icon group-hover:opacity-80 opacity-30 transition-all duration-200" onClick={header.column.getToggleSortingHandler()}>
                            {sortDirection ? sortIcons[sortDirection] : sortIcons.none}
                        </div>
                    )}
                </div>
            </div>
        </thead>
    );
};
