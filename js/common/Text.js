import React from 'react';
import {
  Text,
  StyleSheet
} from 'react-native';

import {
  colors,
  font_sizes,
  font_size_fn,
  text_align_fn,
  font_weight_fn,
  line_height_fn,
  line_heights,
} from './common.styles';

export default function Default_Text(props = {}) {
  const {
            text_align,
            font_weight,
            font_size,
            line_height,
            style, text, children} = props;

  const extra_styles = [
    font_size_fn(font_size),
    text_align_fn(text_align),
    font_weight_fn(font_weight),
    line_height_fn(line_height)(font_size),
    style
  ].reduce((acc, item) => {
    if (item !== null && item !== undefined) return {...acc, ...item};
    return acc;
  }, {});


  return (
    <Text style={[styles.default, extra_styles]}>
      {text}
      {children}
    </Text>
  )
};

const styles = StyleSheet.create({
  default: {
    color: colors.white,
    ...font_size_fn('default'),
    ...text_align_fn('left'),
    ...font_weight_fn('normal'),
    ...line_height_fn(line_heights.default)(font_sizes['default'])
  }
});