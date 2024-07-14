import React, { HTMLProps } from 'react';
import { toSentenceCase } from '../utils';

interface Column {
  header: string;
  accessorKey?: string;
  accessorFn?: (info: any) => any;
}

const idColumn = {
  field: `sk`,
  header: 'UID',
  accessorKey: `sk`,
  enableColumnOrdering: false,
  hidden: true,
  sortable: true,
  filterable: true,
  width: 150,
}

export const convertSchemaToColumns = (schema: any, auditField = true): Column[] => {
  const columns: Column[] = [];

  if (schema.properties) {
    for (const [key, field] of Object.entries(schema.properties)) {
      const value = field as any;
      if (value.hidden || value.hideInTable) continue
      if (value.type === 'object' && value.properties) {
        for (const subKey of Object.keys(value.properties)) {
          if (value.properties[subKey].hidden || value.properties[subKey].hideInTable) continue
          columns.push({
            header: `${key.charAt(0).toUpperCase() + key.slice(1)}.${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`,
            accessorKey: `${key}.${subKey}`,
          });
        }
      } else {
        columns.push({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          accessorKey: key,
        });
      }
    }
  }


  if (auditField) {
    return [
      idColumn,
      ...columns,
      ...getAudit(),
    ];
  }
  return columns;
};

export const getTableColumns = (props: any) => {
  const { schema, hideAudit } = props
  const columns = Object.keys(schema.properties)
    .filter(key => schema.properties[key].type !== 'object' && schema.properties[key].type !== 'array' && schema.properties[key].hidden !== true && schema.properties[key].hideInTable !== true)
    .map((key: any) => {
      return {
        field: `${key}`,
        accessorKey: `${key}`,
        header: `${toSentenceCase(key)}`,
        enableColumnOrdering: true,
        sortable: true,
        filterable: true,
        type: schema.properties[key].type,
        width: 150,
      };
    })
  const audit = hideAudit ? [] : getAudit()

  return [
    idColumn,
    ...columns,
    ...audit,
  ];
}

export const getTableColumnsLight: (schema: any) => any[] = (schema) => [
  `id`,
  ...Object.keys(schema.properties)
    .filter(key => schema.properties[key].type !== 'object' && schema.properties[key].type !== 'array' && schema.properties[key].hidden !== true && schema.properties[key].hideInTable !== true)
    .map((key: any) => `${key}`),
  'status', 'author', 'datatype', 'subschema', 'createdate', 'modifydate'
];

const getAudit = () => {
  return ['status', 'author', 'datatype', 'subschema', 'createdate', 'modifydate'].map(item => ({
    field: `${item}`,
    accessorKey: `${item}`,
    header: `${toSentenceCase(item)}`,
    enableColumnOrdering: false,
    sortable: true,
    filterable: true,
    disableClickEventBubbling: true,
    width: 150,
  }));
};

export const renderRowActions = ({ row, staticRowIndex, table, editHandler, deleteHandler, cloneHandler }) => {
  return <div className='flex gap-5'>
    <button onClick={() => deleteHandler(row, staticRowIndex, table)}>Delete</button>
    <button onClick={() => cloneHandler(row, staticRowIndex, table)}>Clone</button>
    <button onClick={() => editHandler(row, staticRowIndex, table)}>Edit</button>
  </div>
};



export function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}