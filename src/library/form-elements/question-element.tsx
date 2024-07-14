import React, { useState } from 'react';
import { classNames } from '../utils';
import { SliderRangeElement } from './slider-range';


export const QuestionElement = (props: { update, mode, schema, path, name, data }) => {
  const [minMax, setMinMax] = useState(props.data || [0, 0])

  const handleUpdate = (e, minOrMax) => {
    e.preventDefault()
    const newMinMax = [...minMax]

    const isNumber = !isNaN(e.target.value)
    if (!isNumber) return
    const value = parseFloat(e.target.value)
    if (minOrMax === 'min' && value > minMax[1]) return
    if (minOrMax === 'max' && value < minMax[0]) return
    newMinMax[minOrMax === 'min' ? 0 : 1] = e.target.value
    setMinMax(newMinMax)
    props.update(props.path, newMinMax)
  };

  const variant = props.schema['x-control-variant'] || 'number'

  const [min, max] = minMax
  return (
    <div className='flex gap-2 items-center w-full  '>
    </div>
  );
}