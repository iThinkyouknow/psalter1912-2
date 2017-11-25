import React from 'react';
import {
    View,
    Text
} from 'react-native';

import styles, {colors} from './index.styles';

export default function App(props) {
    props.navigator.setStyle({
        navBarTransparent: true,
        // navBarHidden: true,
        // navBarTransparent: true,
        drawUnderNavBar: true,
        navBarBackgroundColor: colors.ocean,
        screenBackgroundColor: colors.ocean,


    });


    return (
        <View style={[styles.background]}>
            <Text >Hello World</Text>
        </View>
    );
};