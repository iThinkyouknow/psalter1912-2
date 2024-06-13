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

import Superscript_chars from '../../data/Superscript-Chars.json';
import { 
    is_string
    , is_array
    , getty
 } from '../utils/functions';

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
        line_height_fn(line_height, font_size),
        {fontFamily: font_family},
        {opacity},
        style
    ].reduce((acc, item) => {
        const value = (typeof item === 'object') ? Object.values(item)[0] : undefined;
        if (value !== null && value !== undefined) return Object.assign(acc, item);
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

export const main_title = (title, font_size) => {
    return (
        <Default_Text
            text_align={'center'}
            font_size={font_size}
            style={{color: colors.gold}}
            font_family={'Durwent'}
        >
            {title}
        </Default_Text>
    )
}


const styles = StyleSheet.create({
    default: {
        color: colors.white,
        opacity: 1,
        ...font_size_fn('default'),
        ...font_weight_fn('normal'),
        ...line_height_fn(line_heights.default, font_sizes['default'])
    }
});


// text utils

const replace_with_superscript = (string) => {
    if (!is_string(string)) {
        return ""
    }

    let str_arr = string.split('');
    if (str_arr.some((c) => Superscript_chars[c] === undefined)) {
        return `[${string}]`;
    } else {
        return str_arr.reduce((acc, char) => {
            acc += Superscript_chars[char];
            return acc;
        }, '');
    }
}

export const text_formatter = (font_size, body = [{ text: '' }], key_prefix) => {
    const textElements = body.reduce((texts_array, text_attrib, i) => {
        const { is_bold, is_superscript, is_italics, text } = text_attrib;
        let was_n = /\n/.test((body[0, i - 1] || {}).text);
        const text_style = {
            fontStyle: is_italics ? 'italic' : 'normal',
            textAlignVertical: is_superscript ? 'top' : 'center'
        };

        const punctuation_regex = /^(?:\.|\;|\,|\?|\:| |\!)/i;
        const is_start_w_punctuation = punctuation_regex.test(text);

        if (is_superscript) {
            texts_array.push(
                <Animated_Text key={i}
                    font_size={font_size * 1}
                    font_weight={is_bold ? 'bold' : 'normal'}
                    style={text_style}>
                    {replace_with_superscript(text)}
                </Animated_Text>
            );
        } else {
            texts_array.push(
                <Animated_Text font_size={font_size}
                    key={i}
                    font_weight={is_bold ? 'bold' : 'normal'}
                    style={text_style}>
                    {(i === 0 || was_n || is_start_w_punctuation) ? text : ` ${text}`}
                </Animated_Text>
            );
        }
        return texts_array;
    }, []);
    return textElements;
}

export const format_psalter_no = (no) => {
    return `Psalter ${no}`;
}

export const format_text = (formatted_no, title, content, psalm, meter) => {
    const joinedContent = content.map((para, stanzaIndex) => {
        return para.map((text, lineIndex) => {
            return lineIndex === 0
                ? `${stanzaIndex + 1}. ${text}`
                : text
        }).join('\n');
    }).join('\n\n');
    return [formatted_no, `${title}`, `Psalm ${psalm}`, `Meter: ${meter}\n`, joinedContent].join('\n')
};

export const format_psalter_texts = ({ psalter }) => {
    const { title, content, psalm, meter, no } = psalter;
    const formatted_psalter_no = format_psalter_no(no);
    const text = is_array(content) ? format_text(formatted_psalter_no, title, content, psalm, meter) : '';
    const share_subject = `${formatted_psalter_no} - ${title}`;

    return {
        text, share_subject
    };
};

export const format_creeds_text = ({
    creed_body_title
    , creed_body_description
    , creed_body
}) => {

    const { header, content } = creed_body;

    const content_text = content.map(({ content }) => {
        let to_format_content = getty(content, '0.0.text', '') === header
            ? content.slice(1)
            : content;

        const content_text = to_format_content
            .map((para) => {
                return para
                    .map(({ text, is_superscript }) => {
                        return is_superscript === true
                            ? replace_with_superscript(text)
                            : text
                    })
                    .join(' ');
            }).join('\n\n');

        return content_text;
    }).join('\n\n\n');



    const text = [
        (creed_body_title !== header) ? creed_body_title : ""
        , creed_body_description
        , `${header}\n`
        , content_text
    ]
        .filter(text => is_string(text))
        .join('\n').trim();

    const share_subject = `${creed_body_title} - ${header}`;

    return {
        text, share_subject
    };
};

export const format_bible_text = (props) => {
    const { bible_passage } = props;
    const { title, content } = bible_passage;

    const body_content = content
        .slice(1)
        .map((texts, verseIndex) => {
            return texts
                .filter(({ is_footnote }) => is_footnote !== true)
                .map(({ text }, textIndex) => {
                    return textIndex === 0
                        ? `${verseIndex + 1}. ${text}`
                        : text
                })
                .join(' ');
        })
        .join('\n\n');

    const text = [
        title,
        body_content
    ].join('\n\n');

    return { text, share_subject: title };
};
