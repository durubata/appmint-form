import React from 'react';
import { CollectionForm } from './library/form-view';
import { CollectionTable } from './library/table-view';

// Delete me
export const Thing = () => {
  return <div>the snozzberries taste like snozzberries</div>;
};

export const AppmintForm = (props: { initData, rules, schema, theme, datatype, id }) => {
  const { initData, schema, theme, datatype, rules, id } = props;
  return <CollectionForm data={initData || {}} path={''} schema={schema} accessMode={''} theme={theme || {}} rules={rules} datatype={datatype} id={id} />
}

export const AppmintTable = (props: { title, rules, schema, theme, datatype, description, id }) => {
  const { schema, theme, datatype, description, rules, title } = props;
  return <CollectionTable theme={theme} rules={rules} title={title} description={description} data={{}} path={''} schema={schema} accessMode={''} datatype={datatype} />
}