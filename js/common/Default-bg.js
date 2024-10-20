import React from 'react';
import {
    View
    , StyleSheet
    , ImageBackground
} from 'react-native';

import { Navigation } from 'react-native-navigation';

import {colors, background_color_fn} from './common.styles';

export default function Default_Bg(props = {}) {
    const tab_bar_height = Navigation.constantsSync().bottomTabsHeight;
    const background_image = props?.user_settings?.background_image ?? '';


    const background_color = props.user_settings?.background_color ?? colors.dark_cerulean;
    const background_opacity = props.user_settings?.background_opacity ?? 0;
    return (
        <ImageBackground style={[styles.flex, {backgroundColor: background_color}]} src={background_image}>
            <View style={[{backgroundColor: `rgba(0, 0, 0, ${background_opacity})`}, styles.flex, {paddingBottom: tab_bar_height}, props.style]}>
                
                    {props.children}
            
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
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