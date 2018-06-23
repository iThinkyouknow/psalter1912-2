import React from 'react';
import {
    Text,
    StyleSheet,
    Animated,
    Platform,
    View
} from 'react-native';

import {
    colors,
    font_sizes,
    font_size_fn,
    text_align_fn,
    font_weight_fn,
    line_height_fn,
    line_heights,
} from './common.styles';

const extra_styles_fn = (props) => {
    const {
        text_align,
        font_weight,
        font_size,
        line_height,
        font_family,
        opacity,
        style, text, children
    } = props;

    const extra_styles = [
        font_size_fn(font_size),
        text_align_fn(text_align),
        font_weight_fn(font_weight),
        line_height_fn(line_height)(font_size),
        {fontFamily: font_family},
        {opacity},
        style
    ].reduce((acc, item) => {
        const value = (typeof item === 'object') ? Object.values(item)[0] : undefined;
        if (value !== null && value !== undefined) return {...acc, ...item};
        return acc;
    }, {});

    return extra_styles;
};

export function Default_Text(props = {}) {
    const {text, children} = props;
    const extra_styles = extra_styles_fn(props);

    return (
        <Text allowFontScaling={false} style={[styles.default, extra_styles]}>
            {text}
            {children}
        </Text>
    );
};


export function Animated_Text(props = {}) {
    const {text, children} = props;
    const extra_styles = extra_styles_fn(props);

    return (
        <Animated.Text allowFontScaling={false} style={[styles.default, extra_styles]}>
            {text}
            {children}
        </Animated.Text>
    );
};

const composable_default_text = (text_align) => (font_weight) => (font_family) => (line_height) => (font_size) => (key) => (style) => (children) => {

    return (
        <Default_Text text_align={text_align}
                       font_weight={font_weight}
                       font_size={font_size}
                       line_height={line_height}
                       font_family={font_family}
                       key={key}
                       style={style}>
            {children}
        </Default_Text>
    );
};

// export const centered_text = composable_anim_text('center');
export const centered_text = composable_default_text('center');
export const bold_centered_text = centered_text('bold');
export const main_title = centered_text()('Durwent')();
export const main_title_2 = bold_centered_text()()('x-large')()();
export const sub_title = bold_centered_text()();
export const meter_text = centered_text()()();
export const normal_text = centered_text('normal')()(1.3);


const styles = StyleSheet.create({
    default: {
        color: colors.white,
        opacity: 1,
        ...font_size_fn('default'),
        ...text_align_fn('left'),
        ...font_weight_fn('normal'),
        ...line_height_fn(line_heights.default)(font_sizes['default'])
    }
});


// text utils

export const text_formatter = (font_size) => (body = [{text: ''}]) => (i) => (key_prefix) => (was_n) => (combined_text_array) => {
    const {text} = body[i];

    const get_text_component = (body) => (i) => (key_prefix) => (was_n) => {
        const current_text = body[i];
        const {is_bold, is_superscript, is_italics, is_list, text} = current_text;

        const text_style = {
            fontStyle: is_italics ? 'italic' : 'normal',
            textAlignVertical: is_superscript ? 'top' : 'center'
        };

        const punctuation_regex = /^(?:\.|\;|\,|\?|\:| |\!)/i;
        const is_start_w_punctuation = punctuation_regex.test(text);

        if (is_superscript && Platform.OS === 'ios') {
            return (
                <View key={`creed-${key_prefix}-para-${i}`} style={{marginTop: 0, alignItems: 'flex-start', width: 8 * text.length, height: 14}}>
                    <Animated_Text font_size={font_sizes.x_small}
                                   font_weight={is_bold ? 'bold' : 'normal'}
                                   style={text_style}>
                        {text}
                    </Animated_Text>
                </View>
            );
        } else if (is_superscript && Platform.OS === 'android') {
            return (
                <Animated_Text key={`creed-${key_prefix}-para-${i}`}
                               font_weight={is_bold ? 'bold' : 'normal'}
                               style={text_style}>
                    {`[${text}]`}
                </Animated_Text>
            );
        } else {
            return (
                <Animated_Text font_size={font_size}
                               key={`creed-${key_prefix}-para-${i}`}
                               font_weight={is_bold ? 'bold' : 'normal'}
                               style={text_style}>
                    {(i === 0 || was_n || is_start_w_punctuation) ? text : ` ${text}`}
                </Animated_Text>
            );
        }
    };

    const text_component = get_text_component(body)(i)(key_prefix)(was_n);
    const new_combined_text_array = [...combined_text_array, text_component];
    const new_was_n = /\n/.test(text);
    const new_index = i + 1;

    if (new_index >= body.length) return new_combined_text_array;

    return text_formatter(font_size)(body)(new_index)(key_prefix)(new_was_n)(new_combined_text_array);
};
