import React, { useEffect, useState } from 'react';
import { classNames } from '../utils';
import { Icon } from './icons/icon';
import { Popover } from './popover';

const sortTypes = [
  { value: 'name-desc', label: 'Name', icon: 'FaSortAlphaDown' },
  { value: 'name-asc', label: 'Name', icon: 'FaSortAlphaUp' },
  { value: 'date-desc', label: 'Date', icon: 'FaSortAlphaDown' },
  { value: 'date-asc', label: 'Date', icon: 'FaSortAlphaUp' },
];

export const PageSort = ({ sortValue, onChange }) => {
  const activeSort = sortTypes.find(sort => sort.value === sortValue) || sortTypes[0];
  const SortComponents = () => {
    return (
      <div className="text-sm flex flex-col">
        {sortTypes.map((sort, index) => (
          <button className={classNames(sort.value === sortValue ? 'bg-cyan-100' : '', 'flex gap-2 items-center hover:scale-125 p-2 transition-all duration-200')} onClick={e => onChange(sort)} key={index}>
            <Icon name={sort.icon as any} />
            <span>{sort.label}</span>
          </button>
        ))}
      </div>
    );
  };
  return (
    <Popover content={<SortComponents />} position="relative" offsetY={20} offsetX={25}>
      <button>
        <Icon name={activeSort.icon as any} />
      </button>
    </Popover>
  );
};

export const sortTreeItem = (treeItems, siteTreeSort) => {
  if (!siteTreeSort) return treeItems;
  const [sort, order] = siteTreeSort.split('-');
  treeItems = treeItems.sort((a, b) => {
    if (sort === 'name') {
      const aValue = a.data.title || a.data.name || a.data.slug;
      const bValue = b.data.title || b.data.name || a.data.slug;
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else {
      const aValue = a.modifydate || a.createdate;
      const bValue = b.modifydate || b.createdate;
      return order === 'asc' ? new Date(aValue).getTime() - new Date(bValue).getTime() : new Date(bValue).getTime() - new Date(aValue).getTime();
    }
  });
  return treeItems;
};
