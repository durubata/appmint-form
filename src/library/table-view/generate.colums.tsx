import React, { HTMLProps } from 'react';
import { toSentenceCase, toTitleCase } from '../utils';
interface Column {
  header: string;
  accessorKey?: string;
  accessorFn?: (info: any) => any;
}

const idColumn = (idField = 'sk') => {
  return {
    field: idField,
    header: 'UID',
    accessorKey: idField,
    enableColumnOrdering: false,
    hidden: true,
    sortable: true,
    filterable: true,
    width: 150,
  };
};

// utils.js
export const determineMetaType = field => {
  if (field.format) {
    switch (field.format) {
      case 'uri':
      case 'url':
        // Further distinguish between image URLs and regular links
        if (field.mediaType && field.mediaType.startsWith('image/')) {
          return 'image';
        }
        return 'link';
      case 'date-time':
      case 'date':
        return 'date';
      case 'email':
        return 'email';
      case 'file':
        return 'file';
      case 'profile-image':
        return 'profileImage';
      // Add more formats as needed
      default:
        return null;
    }
  }

  if (field.enum) {
    return 'enum';
  }

  switch (field.type) {
    case 'boolean':
      return 'boolean';
    case 'number':
    case 'integer':
      return 'number';
    case 'array':
      return 'array';
    case 'object':
      return 'object';
    case 'string':
      return 'string';
    // Add more types as needed
    default:
      return null;
  }
};

export const convertSchemaToColumns = (idField, dataPrefix, schema, auditField = true, cellRenderers) => {
  const columns = [];

  const properties = schema?.properties || schema?.items?.properties || schema;
  if (properties) {
    for (const [key, field] of Object.entries(properties)) {
      const value: any = field;

      // Skip hidden fields
      if (value.hidden || value.hideInTable || value.hideIn?.includes('table')) continue;

      // Handle nested objects
      if (value.type === 'object' && value.properties) {
        for (const [subKey, subField] of Object.entries(value.properties)) {
          const subValue: any = subField;

          // Skip hidden sub-fields
          if (subValue.hidden || subValue.hideInTable) continue;

          const accessorKey = dataPrefix ? `${dataPrefix}.${key}.${subKey}` : `${key}.${subKey}`;

          columns.push({
            header: toSentenceCase(`${capitalizeFirstLetter(key)}.${capitalizeFirstLetter(subKey)}`),
            accessorKey,
            meta: determineMetaType(subValue), // Assign meta.type
          });
        }
      } else {
        const accessorKey = dataPrefix ? `${dataPrefix}.${key}` : `${key}`;

        columns.push({
          header: toSentenceCase(capitalizeFirstLetter(key)),
          accessorKey,
          meta: determineMetaType(value), // Assign meta.type
        });
      }
    }
  }

  // Assign cell renderers and other properties
  columns.forEach(column => {
    if (cellRenderers && cellRenderers[column.accessorKey]) {
      column.cell = cellRenderers[column.accessorKey];
    }
    column.filterFn = 'fuzzy';

    // Optionally, add additional metadata or properties here
  });

  if (auditField) {
    return [idColumn(idField), ...columns, ...getAudit()];
  }
  return columns;
};

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTableColumns = (props: any) => {
  const { schema, hideAudit } = props;
  const columns = Object.keys(schema.properties)
    .filter(key => schema.properties[key].type !== 'object' && schema.properties[key].type !== 'array' && schema.properties[key].hidden !== true && schema.properties[key].hideInTable !== true)
    .map((key: any) => {
      return {
        field: `${key}`,
        accessorKey: `data.${key}`,
        header: `${toSentenceCase(key)
          }`,
        enableColumnOrdering: true,
        sortable: true,
        filterable: true,
        type: schema.properties[key].type,
        width: 150,
      };
    });
  const audit = hideAudit ? [] : getAudit();

  return [idColumn, ...columns, ...audit];
};

export const getTableColumnsLight: (schema: any) => any[] = schema => [
  `id`,
  ...Object.keys(schema.properties)
    .filter(key => schema.properties[key].type !== 'object' && schema.properties[key].type !== 'array' && schema.properties[key].hidden !== true && schema.properties[key].hideInTable !== true)
    .map((key: any) => `${key} `),
  'status',
  'author',
  'datatype',
  'subschema',
  'createdate',
  'modifydate',
];

const getAudit = () => {
  return ['state', 'author', 'datatype', 'subschema', 'createdate', 'modifydate'].map(item => ({
    field: `${item} `,
    accessorKey: `${item} `,
    header: `${toSentenceCase(item)} `,
    enableColumnOrdering: false,
    sortable: true,
    filterable: true,
    disableClickEventBubbling: true,
    width: 150,
  }));
};

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />;
}
