import React from 'react';
import {
    View,
    StyleSheet
    , SafeAreaView

} from 'react-native';

import {colors, background_color_fn} from './common.styles';

export default function Default_Bg(props = {}) {
    return (
        <View style={[styles.background_col, styles.flex, {bottom: 0}, props.style]}>
            {props.children}
            {(props.Tab_Bar !== undefined) && props.Tab_Bar}
        </View>
    )
};

const styles = StyleSheet.create({
    background_col: background_color_fn('dark_cerulean'),
    flex: {
        flex: 1
    }
});


export const Default_Bg_w_Tab_Bar = (props = {}) => {

    return (
        <Default_Bg style={props.style}>
            {props.children}
            {props.Tab_Bar}
        </Default_Bg>
    );
};