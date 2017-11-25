import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

import {colors, background_color_fn} from './common.styles';

export default function Default_bg(props = {}) {
  return (
    <View style={[styles.background_col, styles.flex, props.style]}>
      {props.children}
    </View>
  )
};

const styles = StyleSheet.create({
  background_col: background_color_fn('ocean'),
  flex: {
    flex: 1
  }
});