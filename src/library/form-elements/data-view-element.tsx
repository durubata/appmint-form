import { isEmpty } from './common-imports';
import React, { useEffect, useState } from 'react';
import * as objectPath from 'object-path';
import { IconButtonDelete } from '../common/icon-button-delete';

export const DataViewElement = (props: { data; name; schema }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const watchedData = {};
    const paths = props.schema.watchedPaths?.includes('root') ? Object.keys(props.data) : props.schema.watchedPaths;
    paths?.forEach(path => {
      const value = objectPath.get(props.data, path);
      if (value) {
        watchedData[path] = value;
      }
    });
    setData(watchedData);
  }, [props.data]);

  return (
    <div className="w-full shadow border-white border-8 bg-gray-50 p-10">
      {isEmpty(data) && <div className="text-center text-gray-500">No Data</div>}
      {Object.keys(data).map((key, index) => {
        return (
          <div key={index} className="flex flex-row justify-between">
            <DataDisplay key={key} path={key} pathData={data[key]} />
          </div>
        );
      })}
    </div>
  );
};

const primitiveType = ['string', 'number', 'boolean'];

const DataDisplay = (props: { path; pathData }) => {
  const onDelete = () => { };

  let renderValue;
  if (primitiveType.includes(typeof props.pathData)) {
    renderValue = props.pathData;
  }

  if (props.pathData?.url && props.pathData?.path) {
    renderValue = <FileThumbnail url={props.pathData.url} path={props.pathData.path} deleteClick={onDelete} />;
  }

  if (Array.isArray(props.pathData)) {
    renderValue = props.pathData.map((item, index) => {
      return <DataDisplay key={index} path={`${props.path}.${index}`} pathData={item} />;
    });
  }

  if (typeof props.pathData === 'object') {
    renderValue = (
      <div className="flex flex-row justify-between">
        {Object.keys(props.pathData).map((key, index) => {
          return (
            <div key={index} className="flex flex-row justify-between">
              {key}
              <DataDisplay key={key} path={`${props.path}.${key}`} pathData={props.pathData[key]} />
            </div>
          );
        })}
      </div>
    );
  }
  if (!renderValue) {
    console.log('Unknown data type', props.path, props.pathData);
  }
  return (
    <div className="cursor-pointer flex items-center gap-2">
      {renderValue}
      <IconButtonDelete className="" color={'gray'} size={10} deleteHandler={onDelete} />{' '}
    </div>
  );
};
