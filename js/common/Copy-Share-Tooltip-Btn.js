import React, {Component} from 'react';

import {
    TouchableOpacity
    , StyleSheet
} from  'react-native';

import {
    Default_Text
} from '../common/Text';

import {
    font_sizes
    , zIndex
    , sizes
    , border_radii
    , user_font_color
} from '../common/common.styles'


const tooltip_style = StyleSheet.create({
    cancel_layer: {
        left: 0
        , top: 0
        , position: 'absolute'
        , zIndex: zIndex.xx_large
        , ...StyleSheet.absoluteFill
    },
    tooltip: {
        position: 'absolute'
        , justifyContent: 'center'
        , padding: sizes.medium
        , borderRadius: border_radii.default
        , backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }
});
export default Copy_Share_Tooltip = (props) => {
    const {
        onCancel
        , onPress
        , style
        , top
        , left
        , user_settings
    } = props;
    const color_style = user_font_color(user_settings)
    return (
        <TouchableOpacity onPress={onCancel}
            activeOpacity={0}
            style={[tooltip_style.cancel_layer]}>
            <TouchableOpacity style={[tooltip_style.tooltip, {
                top: top
                , left: left
            }, style]}

                onPress={onPress}>
                <Default_Text style={color_style}  font_size={font_sizes.small} text_align={'center'}>Copy / Share</Default_Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
};