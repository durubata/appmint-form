import { Icon } from './common-imports';
import React, { useState } from 'react';

export const RatingInput = (props: { path; change; blur; value; data; schema: { scale; update; total; min; max } }) => {
  const [rating, setRating] = useState<number>(props.value || 0);
  const [hover, setHover] = useState<number>(0);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    if (props.blur) {
      props.blur(newRating);
    }
  };

  const { scale = 5, total } = props.schema;
  return (
    <div className="flex items-center">
      <div className="flex justify-start items-center gap-2 text-xs">
        {[...Array(scale)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <span key={ratingValue} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)}>
              {ratingValue <= (hover || rating) ? (
                <button onClick={() => handleRating(ratingValue)}>
                  {' '}
                  <Icon name="FaStar" className=" fill-yellow-400 stroke-yellow-500 " />
                </button>
              ) : (
                <button onClick={() => handleRating(ratingValue)}>
                  {' '}
                  <Icon name="FaRegStar" className=" fill-yellow-400 stroke-yellow-500 " />
                </button>
              )}
            </span>
          );
        })}
        {total && <span>{total}</span>}
      </div>
    </div>
  );
};
