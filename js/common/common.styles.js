'use strict';


export const native_elements = {
  status_bar: 20,
  nav_bar_std: 44,
  nav_bar_x: 96,
  tab_bar: 49
};

export const colors = {
  white: 'rgb(255, 255, 255)',
  ocean: 'rgb(0, 84, 147)'
};

export const sizes = {
    small: 5,
    default: 8,
    medium: 12,
    large: 16
};

export const border_radii = {
  small: 2.5,
  default: 5,
  large: 7.5,
  x_large: 10,
  xx_large: 12.5,
  xxx_large: 15
}

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
    }
  };

  return {
    fontWeight: font_weight(font_weights)(weight)
  }
};

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
    }
  };

  return {
    fontSize: font_size(font_sizes)(size)
  };
};

export const line_heights = {
  default: 1.3
};

export const line_height_fn = (line_height) => (font_size) => {

  const get_value = (presets) => (val) => {
    if (!isNaN(val)) return val;
    if (typeof val === 'string') {
      return presets[val];
    }

    return presets['default'];
  };

  const _line_height = get_value(line_heights)(line_height);
  const _f_size = get_value(font_sizes)(font_size);

  return (_line_height !== undefined && _f_size !== undefined) ? {lineHeight: _line_height * _f_size} : undefined;
};

export const text_align_fn = (alignment) => {

  const text_align = {
    auto: 'auto',
    left: 'left',
    right: 'right',
    center: 'center',
    justify: 'justify'
  };

  return {textAlign: text_align[alignment]};
};



export const background_color_fn = (col) => {
  return {
    backgroundColor: colors[col] || col
  };
};
