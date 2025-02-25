import { Icon } from '../common/icons/list';
import React, { useState } from 'react';

export const RatingInput = (props: { path, update, schema: { scale, update, total, title } }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    if (props.update) {
      props.update(props.path, newRating);
    }
  };

  const { scale = 5, total, title } = props.schema;
  return (
    <div className='flex justify-start'>
      <div className='flex justify-start items-center gap-2 text-xs'>
        {[...Array(scale)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <span key={ratingValue} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)}>
              {ratingValue <= (hover || rating) ? (
                <button title={title} onClick={() => handleRating(ratingValue)} > <Icon name='FaStar' className=' fill-yellow-400 stroke-yellow-500 ' /></button>
              ) : (
                <button title={title} onClick={() => handleRating(ratingValue)}> <Icon name='FaRegStar' className=' fill-yellow-400 stroke-yellow-500 ' /></button>
              )}
            </span>
          );
        })}
        {total && <span>{total}</span>}
      </div>
    </div>
  );
};
