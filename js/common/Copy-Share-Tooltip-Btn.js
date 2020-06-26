import React, {Component} from 'react';

import {
    Dimensions
    , TouchableOpacity
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
    , colors
} from '../common/common.styles'


const tooltip_style = StyleSheet.create({
    cancel_layer: {
        left: 0
        , top: 0
        , position: 'absolute'
        , zIndex: zIndex.xx_large
    },
    tooltip: {
        position: 'absolute'
        , justifyContent: 'center'
        , padding: sizes.medium
        , opacity: 0.8
        , borderRadius: border_radii.default
        , backgroundColor: colors.black
    }
});
export default Copy_Share_Tooltip = (props) => {
    const {
        onCancel
        , onPress
        , style
        , top
        , left
    } = props;
    
    return (
        <TouchableOpacity onPress={onCancel}
            activeOpacity={0}
            style={[tooltip_style.cancel_layer, {
                width: Dimensions.get('window').width
                , height: Dimensions.get('window').height
            }]}>
            <TouchableOpacity style={[tooltip_style.tooltip, {
                top: top
                , left: left
            }, style]}

                onPress={onPress}>
                <Default_Text font_size={font_sizes.small} text_align={'center'}>Copy / Share</Default_Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
};