import React from 'react';
import './styles/Loader.css';

const Loader = ({ width, height, styleHeight, borderColor, border }) => {
  const parsedWidth = parseFloat(width);
  const parsedHeight = parseFloat(height);
  console.log('border', borderColor);
    return (
      <div class="lds-ring"style={{
        height: styleHeight,
      }}>
        <div style={{ width: width, height: height,border: border, borderColor: borderColor}}></div>
        <div style={{ width: width, height: height,border: border, borderColor: borderColor}}></div>
        <div style={{ width: width, height: height,border: border, borderColor: borderColor}}></div>
        <div style={{width: width, height: height,border: border, borderColor: borderColor}}></div>
      </div>
  );
};
export default Loader;