import React from 'react';
import { View } from 'react-native';

export default function Overlay_Wrapper(props) {
    return (
        <View>
            {props.children}
        </View>
    )
}

Overlay_Wrapper.options = (props) => {
    return {
        layout: {
            componentBackgroundColor: 'transparent',
          },
        overlay: {
            interceptTouchOutside: true,
        },
    };
};
