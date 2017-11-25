'use strict';

export const colors = {
  white: 'rgb(255, 255, 255)',
  ocean: 'rgb(0, 84, 147)'
};

export const sizes = {
    small: 5,
    default: 8,
    medium: 10,
    large: 15
};




export const background_color_fn = (col) => {
  return {
    backgroundColor: colors[col] || col
  };
};
