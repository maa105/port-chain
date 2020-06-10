import React from 'react';
import { useSelector } from 'react-redux';
import './global-loader.component.css';

const GlobalLoader = () => {
  const { show } = useSelector((state) => state.globalLoader);
  return (
    show ?
      <div className="global-loader-container">
        <div>
          <div className="global-loader"></div>
        </div>
      </div> :
      null
  );
};

export default GlobalLoader;
