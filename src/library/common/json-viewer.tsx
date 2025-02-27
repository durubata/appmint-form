import React from 'react';
import ReactJson, { ThemeKeys } from 'react-json-view';

enum iconStype {
  'circle' = 'circle',
  'square' = 'square',
  'triangle' = 'triangle',
}

const defaultProps = {
  theme: 'rjv-default' as ThemeKeys,
  collapsed: false,
  collapseStringsAfterLength: 15,
  onAdd: true,
  onEdit: true,
  onDelete: true,
  displayObjectSize: true,
  enableClipboard: true,
  indentWidth: 4,
  displayDataTypes: true,
  iconStyle: iconStype.triangle,
  style: {
    padding: '10px',
    borderRadius: '3px',
    margin: '10px 0px',
  },
};

export const JSONViewer = props => {
  const { json, allowEdit, allowAdd, allowDelete } = props;

  const onUpdate = update => {
    if (props.onUpdate) {
      props.onUpdate(update);
    }
  }


  const buildCollectionTree = () => {
    return (
      <div className="">
        <ReactJson
          {...defaultProps}
          name={false}
          src={json}
          onEdit={
            allowEdit
              ? e => {
                onUpdate({ src: e.updated_src });
              }
              : false
          }
          onDelete={
            allowDelete
              ? e => {
                onUpdate({ src: e.updated_src });
              }
              : false
          }
          onAdd={
            allowAdd
              ? e => {
                onUpdate({ src: e.updated_src });
              }
              : false
          }
        />
      </div>
    );
  };
  return buildCollectionTree();
};
