import React from 'react';
export const ParagraphElement = ({ schema, name, value }) => {

  return <div className='w-full p-2' id={name} dangerouslySetInnerHTML={{ __html: value || schema?.default || 'Paragraph Content Here' }}></div>
};
