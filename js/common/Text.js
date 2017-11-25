import React from 'react';
import {
  Text,
  StyleSheet
} from 'react-native';

import {colors} from './common.styles';

export default function Default_Text(props = {}) {
  return (
    <Text style={[styles.white_color, props.style]}>
      {props.text}
      {props.children}
    </Text>
  )
};

const styles = StyleSheet.create({
  white_color: {
    color: colors.white
  }
});