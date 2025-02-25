import React, { useRef, useEffect, useState } from 'react';

export const useElementSelector = (): [any, any] => {
  const [element, setElement] = useState(null)
  const ref = useRef();

  useEffect(() => {
    setElement(ref)
  }, [element])


  return [ref, setElement];
};



