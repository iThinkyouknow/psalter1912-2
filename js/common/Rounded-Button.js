import React from 'react';
import {
    TouchableHighlight
    ,View
} from 'react-native';

import {
    colors
    , border_radii
} from './common.styles';

export const Rounded_Button = (child) => (on_press) => (screen_width) => {
    const close_library_button_style =
          {
              flexDirection: 'row',
              borderRadius: border_radii.default,
              borderColor: colors.blue,
              borderWidth: 1,
              alignItems: 'center',
              overflow: 'hidden',

              // backgroundColor: colors.blue
          };

    const close_library_button_dyn_style = {
        width: Math.floor(screen_width * 1 / 3)
    };

    return (
        <TouchableHighlight onPress={on_press}
                            underlayColor={colors.blue}
                            style={[close_library_button_style, close_library_button_dyn_style]}>
            <View style={{flex: 1}}>
                {child}
            </View>
        </TouchableHighlight>
    );
};
