import React, { useState } from 'react';
import { IconButtonDelete } from '../common/icon-button-delete';
import { isEmpty } from '../utils';

export const TableGroup: React.FC<any> = props => {
    const [columns, setColumns] = useState<any>([]);

    const addToTextInput = item => {
        setColumns(Array.from(new Set([...columns, item])));
    };

    const deleteHandler = item => {
        setColumns(columns.filter(column => column !== item));
    };

    const onDrop = e => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text');
        console.log('onDrop', data);
        addToTextInput(data);
    };

    const onDragOver = e => {
        e.preventDefault();
    };

    return (
        <div onDragEnter={onDragOver} onDragOver={onDragOver} onDragLeave={onDragOver} onDragEnd={onDragOver} onDrop={onDrop} className=" shadow p-4 w-full rounded-xl border border-gray-200  flex gap-2 flex-wrap my-4">
            {Array.isArray(columns) &&
                columns.map((item, i) => (
                    <div key={i} className="cursor-pointer px-2 py-1 text-sm rounded-full bg-gray-50">
                        {item} <IconButtonDelete className="" color={'gray'} size={10} controlRef={item} deleteHandler={deleteHandler} />{' '}
                    </div>
                ))}
            {isEmpty(columns) && <div className="text-gray-400 text-xs">Drag and drop columns here to group</div>}
        </div>
    );
};
