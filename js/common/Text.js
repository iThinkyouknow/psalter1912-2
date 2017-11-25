import React from 'react';
import {
  Text,
  StyleSheet
} from 'react-native';

import {
  colors,
  font_size_fn,
  text_align_fn,
  font_weight_fn,
  line_height_fn
} from './common.styles';

export default function Default_Text(props = {}) {
  const {font_size = 'default', text_align = 'left', font_weight = 'normal', line_height = 1.3, style, text, children} = props;
  const _font_size = font_size_fn(font_size);
  const text_alignment = text_align_fn(text_align);
  const _font_weight = font_weight_fn(font_weight);
  const _line_height = line_height_fn(line_height)(_font_size.fontSize);

  return (
    <Text style={[styles.white_color, _font_size, _font_weight, text_alignment, _line_height, style]}>
      {text}
      {children}
    </Text>
  )
};

const styles = StyleSheet.create({
  white_color: {
    color: colors.white
  }
});