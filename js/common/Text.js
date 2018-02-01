import React from 'react';
import {
    Text,
    StyleSheet,
    Animated
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
        opacity,
        style, text, children
    } = props;

    const extra_styles = [
        font_size_fn(font_size),
        text_align_fn(text_align),
        font_weight_fn(font_weight),
        line_height_fn(line_height)(font_size),
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
        <Text style={[styles.default, extra_styles]}>
            {text}
            {children}
        </Text>
    );
};

export function Animated_Text(props = {}) {
    const {text, children} = props;
    const extra_styles = extra_styles_fn(props);

    return (
        <Animated.Text style={[styles.default, extra_styles]}>
            {text}
            {children}
        </Animated.Text>
    );
}

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