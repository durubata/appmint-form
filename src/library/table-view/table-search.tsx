

import React, { useState } from 'react';
import { DebouncedInput } from '..//common/debounced-input';
import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'
import { SortingFn } from '@tanstack/react-table';

export const TableSearch: React.FC<any> = ({ globalSearch, setGlobalSearch }) => {
    return (
        <div className=''>
            <DebouncedInput
                className="p-2 font-lg shadow border border-block rounded-lg text-sm border-gray-200 w-64"
                placeholder="Search all columns..."
                onChange={value => setGlobalSearch(value)}
                type="text"
                value={globalSearch ?? ''}
            />
        </div>

    );
};