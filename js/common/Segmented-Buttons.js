import React, {Component} from 'react';
import {
    View
    , StyleSheet
    , TouchableOpacity
} from 'react-native';

import {
    border_radii
    , user_font_color
    , user_tint_color
} from '../common/common.styles';

import {
    Default_Text
} from '../common/Text';

import {
    no_op
} from '../utils/functions';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 32,
        borderRadius: border_radii.default,
        borderWidth: 1,
        alignItems: 'center',
        overflow: 'hidden'
    },
    border_left_style: {
        borderLeftWidth: 1
    }
});

const button_renderer = (user_settings, selected_tab_index) => ({text, on_press}, index) => {
    const tint = user_tint_color(user_settings)

    const is_selected = (selected_tab_index === index);

    const bg_color_obj = {
        backgroundColor: is_selected ? tint : 'transparent'
    };

    const border_left_style = index === 0
        ? null
        : styles.border_left_style;
    const key = `segment-buttons-${text}-${index}`;
    
    return (
        <TouchableOpacity key={key}
                            style={[{flex: 1}, border_left_style, {borderColor: tint}, bg_color_obj]}
                            onPress={on_press}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Default_Text style={user_font_color(user_settings)} text_align={'center'}>
                    {text}
                </Default_Text>
            </View>
        </TouchableOpacity>
    );
};


export default Segmented_Buttons = (width, buttons_array = [{ text: '', on_press: no_op}], user_settings, selected_tab_index) => {

    const buttons = buttons_array.map(button_renderer(user_settings, selected_tab_index));

    return (
        <View style={[styles.container, {width, borderColor: user_settings.tint_color}]}>
            {buttons}
        </View>
    );
};