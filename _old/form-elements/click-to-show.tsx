import React from 'react';

export const ClickToShow: any = ({ children }) => {

  return (
    <div className="button-click-to-show">
      {children}
      <button className="text-center">
        Click to show
      </button>
    </div>
  );
};
