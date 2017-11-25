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

export const font_weights = {
  normal: 'normal',
  regular: '400',
  bold: 'bold',
  bold_2: '700',
  thin: '300',
  ultralight: '100'
};

export const font_weight_fn = (weight) => {
  const font_weight = (_font_weights) => (_weight) => {
    if (_font_weights[_weight] !== undefined && _font_weights[_weight] !== null) {
      return _font_weights[_weight];

    } else if (!isNaN(_weight)) {
      return _weight;

    } else {
      return _font_weights['normal'];
    }
  };

  return {
    fontWeight: font_weight(font_weights)(weight)
  }
}



export const font_sizes = {
  x_small: 12,
  small: 14,
  default: 16,
  large: 18,
  x_large: 20,
  xx_large: 24,
  xxx_large: 48
};

export const font_size_fn = (size) => {
  const font_size = (_font_sizes) => (_size) => {
    if (_font_sizes[_size] !== undefined && _font_sizes[_size] !== null) {
      return _font_sizes[_size];
    } else if (!isNaN(_size)) {
      return _size;
    } else {
      return _font_sizes['default'];
    }
  };

  return {
    fontSize: font_size(font_sizes)(size)
  };
};

export const line_height_fn = (multiplier = 1.3) => (font_size = 16) => {
  if (isNaN(multiplier) || isNaN(font_size)) {
    return {
      lineHeight: Math.round(1.3 * 16)
    }
  }
  return {
    lineHeight: Math.round(multiplier * font_size)
  }
};

export const text_align_fn = (alignment) => {

  const text_align = {
    auto: 'auto',
    left: 'left',
    right: 'right',
    center: 'center',
    justify: 'justify'
  };

  return {textAlign: text_align[alignment] || text_align['left']};

};



export const background_color_fn = (col) => {
  return {
    backgroundColor: colors[col] || col
  };
};
