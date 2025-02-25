import React from 'react';
import { IconButtonDelete } from '../common/icon-button-delete';
import { Icon } from '../common/icons/list';


export const RowHandler: React.FC<any> = ({ row }) => {

    const deleteHandler = (item) => {
        console.log('deleteHandler', item);
    }

    const rowEditHandler = (item) => {
        console.log('rowEditHandler', item);
    }

    const rowJSONViewHandler = (item) => {
        console.log('rowJSONViewHandler', item);
    }

    const rowCloneHandler = (item) => {
        console.log('rowCloneHandler', item);
    }

    return (
        <div className='flex gap-0 mr-5'>
            <button title='Edit' onClick={e => rowEditHandler(row)} className='p-1 bg-gray-100  border-white border-2 rounded-full  hover:scale-125 block transition-all duration-200 shadow '>
                <Icon name='FaEdit' color="blue" />
            </button>
            <button title='View JSON' onClick={e => rowJSONViewHandler(row)} className='p-1 bg-gray-100 border-2  border-white rounded-full shadow hover:scale-125 block transition-all duration-200'>
                <Icon name='FaEye' color="orange" />
            </button>
            <button title='Clone' onClick={e => rowCloneHandler(row)} className='p-1 bg-gray-100 border-2  border-white rounded-full shadow hover:scale-125 block transition-all duration-200'>
                <Icon name='FaRegClone' color="green" />
            </button>
            <IconButtonDelete deleteHandler={e => deleteHandler(row)} className='p-1 bg-gray-100 border-2  border-white rounded-full shadow hover:scale-125 block transition-all duration-200' />
        </div>
    );
};
