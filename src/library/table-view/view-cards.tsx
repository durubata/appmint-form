import React from 'react';
import { ColumnHead } from './column-head';
import { RowHandler } from './row-handler';
import { classNames } from '../utils';
import { flexRender } from '@tanstack/react-table';
import { TableColumns } from './table-columns';
import { ColumnFilters } from './column-filters';
import { TableCardRenderer } from './view-card-renderer';
import { CollectionTableCardPopup } from './view-card-popup';
import { IndeterminateCheckbox } from '../common/indeterminate-checkbox';

export const CollectionTableCardView = (props: { table; selectRow; selectedRows; slimRow; onRowEvent; options; itemRenderer; onRowDataEvent; datatype }) => {
  const { table, selectedRows, slimRow, selectRow, itemRenderer } = props;
  const [isOpen, setIsOpened] = React.useState(false);

  return (
    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <CollectionTableCardPopup isOpen={isOpen} close={() => setIsOpened(false)} />
      {/* Header Controls */}
      <div className="sticky top-0 z-10 bg-white p-4 border-b">
        <div className="flex items-center gap-4">
          <TableColumns table={table} />
          <ColumnFilters table={table} />
          {/* Additional header controls can be added here */}
        </div>
      </div>

      {/* Cards Container */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {table?.getRowModel().rows.map(row => {
          const isSelected = selectedRows.includes(row.id);
          // Use the custom cardRenderer if provided, else use GenericCardRenderer
          const Renderer = itemRenderer || TableCardRenderer;
          return (
            <Renderer
              key={row.id}
              row={row}
              selected={isSelected}
              onSelect={e => setIsOpened(true)}
              slimRow={slimRow}
            // Pass additional props if needed
            />
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="mt-6 p-4 border-t flex items-center justify-between">
        <IndeterminateCheckbox checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />
        <span className="text-sm text-gray-700">Page Rows ({table.getRowModel().rows.length})</span>
        {/* Additional footer controls can be added here */}
      </div>
    </div>
  );
};
