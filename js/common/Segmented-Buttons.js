import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Image
    , StyleSheet
    , TouchableHighlight
    , Platform
} from 'react-native';

import {
    colors
    , sizes
    , font_sizes
    , zIndex
    , native_elements
    , buttons
    , border_radii
} from '../common/common.styles';

import {
    Default_Text
    , Animated_Text
} from '../common/Text';

import Default_bg, {Default_Bg_w_Tab_Bar} from '../common/Default-bg';

import {} from '../utils/alert';
import {
    is_string
    , no_op
} from '../utils/functions';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 32,
        borderRadius: border_radii.default,
        borderColor: colors.blue,
        borderWidth: 1,
        alignItems: 'center',
        overflow: 'hidden'
    },
    border_left_style: {
        borderColor: colors.blue,
        borderLeftWidth: 1
    }
});

const button_renderer = (selected_tint, selected_tab_index) => ({text, on_press}, index) => {
    const tint = is_string(selected_tint)
        ? selected_tint
        : colors.blue;

    const is_selected = (selected_tab_index === index);

    const bg_color_obj = {
        backgroundColor: is_selected ? tint : 'transparent'
    };

    const border_left_style = index === 0
        ? null
        : styles.border_left_style;

    const underlay_color = (is_selected) ? colors.dark_cerulean : 'transparent';
    const key = `segment-buttons-${text}-${index}`;

    return (
        <TouchableHighlight key={key}
                            style={[{flex: 1}, border_left_style, bg_color_obj]}
                            underlayColor={underlay_color}
                            onPress={on_press}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Default_Text text_align={'center'}>
                    {text}
                </Default_Text>
            </View>
        </TouchableHighlight>
    );
};


export default Segmented_Buttons = (width, buttons_array = [{ text: '', on_press: no_op}], selected_tint = '', selected_tab_index) => {

    const buttons = buttons_array.map(button_renderer(selected_tint, selected_tab_index));

    return (
        <View style={[styles.container, {width}]}>
            {buttons}
        </View>
    );
};