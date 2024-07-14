import React, { useEffect, useState } from 'react';
import { generateFakeData } from './table-util';
import { convertSchemaToColumns } from './generate.colums';
import { ColumnHead } from './column-head';
import { TableGroup } from './table-group';
import { RowHandler } from './row-handler';
import { classNames } from '../utils';
import { buttonClass, buttonHoverClass, iconClass } from '../utils/constants';
import { Icon } from '../common/icons/list';
import {
    useReactTable, flexRender, getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    PaginationState,
} from '@tanstack/react-table'
import { TableSearch } from './table-search';
import { TablePagination } from './table-pagination';
import { TableColumns } from './table-columns';
import { TableFilters } from './table-filters';
import { IndeterminateCheckbox } from '../common/indeterminate-checkbox';

export const CollectionTable = (props: { title, theme, rules, description, data, path, schema, accessMode?, inlineEdit?, datatype }) => {
    const [data, setData] = useState<any>([]);
    const [columns, setColumns] = useState<any>([]);
    // const [creatingRowIndex, setCreatingRowIndex] = useState<number | undefined>();
    // const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalSearch, setGlobalSearch] = useState('')
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    useEffect(() => {
        const columns = convertSchemaToColumns(props.schema);
        setColumns(columns);
        setData(generateFakeData(columns, 100));

    }, []);

    const table = useReactTable({
        data,
        columns,
        state: {
            columnVisibility,
            rowSelection,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        debugTable: true,
    })
    return (
        <div className="px-4 sm:px-6 lg:px-8 h-full">
            <div className="sm:flex sm:items-center mt-6">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">{props.title}</h1>
                    <p className="mt-2 text-sm text-gray-700">{props.description}</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2 items-center">
                    <TableSearch globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
                    <button type="button" className={classNames(buttonClass, buttonHoverClass)}  >
                        <Icon name='FaPlus' className={iconClass} />
                        <span>Add{props.title}</span>
                    </button>
                </div>
            </div>
            <TableGroup />
            <div className="mt-8 flow-root h-[calc(100%-250px)] w-[calc(100vw-450px)] overflow-auto">
                <div className="-mx-4 -my-2  sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className=' sticky top-0 z-10 bg-white w-full'>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-white flex gap-1 items-center">
                                            <TableColumns table={table} />
                                            <TableFilters table={table} />
                                        </th>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" >
                                                <ColumnHead header={header} />
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {table?.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <RowHandler row={row} />
                                        </td>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="p-1">
                                        <IndeterminateCheckbox
                                            {...{
                                                checked: table.getIsAllPageRowsSelected(),
                                                indeterminate: table.getIsSomePageRowsSelected(),
                                                onChange: table.getToggleAllPageRowsSelectedHandler(),
                                            }}
                                        />
                                    </td>
                                    <td colSpan={20}>Page Rows ({table.getRowModel().rows.length})</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <TablePagination table={table} />
        </div>
    )
}
