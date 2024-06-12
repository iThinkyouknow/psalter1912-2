import React from 'react';
import {
    TouchableHighlight
    , View
    , StyleSheet
} from 'react-native';

import {
    colors
    , border_radii
} from './common.styles';

const styles = StyleSheet.create({
    close_library_button_style: {
        flexDirection: 'row',
        borderRadius: border_radii.default,
        borderColor: colors.blue,
        borderWidth: 1,
        alignItems: 'center',
        overflow: 'hidden'
    }
});

export const Rounded_Button = (props) => {

    const close_library_button_dyn_style = {
        width: Math.floor(props.screen_width * 1 / 3)
    };

    return (
        <TouchableHighlight onPress={props.on_press}
                            underlayColor={colors.blue}
                            style={[styles.close_library_button_style, close_library_button_dyn_style]}>
            <View style={{flex: 1}}>
                {props.children}
            </View>
        </TouchableHighlight>
    );
};

