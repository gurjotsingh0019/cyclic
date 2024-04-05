import React, { useEffect, useState } from 'react';

const GetDominantColor = ({ imageUrl, children }) => {
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    const getDominantColor = async () => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const pixels = imageData.data;
          const numPixels = pixels.length;
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < numPixels; i += 4) {
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
          }
          r = Math.floor(r / (numPixels / 4));
          g = Math.floor(g / (numPixels / 4));
          b = Math.floor(b / (numPixels / 4));
          setBackgroundColor(`rgb(${r}, ${g}, ${b})`);
        };
      } catch (error) {
        console.error('Error retrieving dominant color:', error);
      }
    };

    getDominantColor();
  }, [imageUrl]);

  return <>{children(backgroundColor)}</>;
};

export default GetDominantColor;