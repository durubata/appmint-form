import React from 'react';
import { classNames } from '../utils';


export const MapElementNew = (props: { id; className; style; center; zoom; mapPoints; refresh?}) => {

  return (
    <div className={classNames('w-full h-full', props.className)} style={props.style}>
      MapElementNew
    </div>
  );
};
