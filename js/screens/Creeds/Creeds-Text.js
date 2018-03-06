import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    FlatList,
    Animated,
    Platform
} from 'react-native';

// import styles from './creeds-text.styles';
import {
    colors,
    sizes,
    font_sizes,
    zIndex,
    native_elements,
    buttons
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text
} from '../../common/Text';

import Default_bg from '../../common/Default-bg';

import {} from '../../utils/alert';

const Creeds_Text_Flatlist = (title) => (description) => (body) => {

    const key_extractor = (item, i) => `creeds-body-text-${i}`;
    const Header_Text_Component = (font_size) => (other_style) => (text) => {
        return (
            <Animated_Text text_align={'center'}
                           font_size={font_size}
                           style={other_style}
                           font_weight={'bold'}>
                {text}
            </Animated_Text>
        );
    };

    const Creeds_Body_Header = (title) => (description) => (header) => {
        const creeds_body_header_style = {
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: native_elements.status_bar + native_elements.nav_bar_std
        };



        return (
            <View style={creeds_body_header_style}>
                {(title !== header) && Header_Text_Component(font_sizes.x_large)()(title)}
                {description.length > 0 && Header_Text_Component(font_sizes.large)()(description)}
                {Header_Text_Component(font_sizes.xx_large)({marginTop: sizes.default})(header)}
            </View>
        );
    };

    const Creeds_Body_Component = (section_header) => ({item, index}) => {
        const [title, body, extra] = item.content;

        const title_text = title.map(({text}) => text).join(' ');
        const title_component = (section_header !== title_text) ? Header_Text_Component(font_sizes.large)({marginTop: sizes.large})(title_text) : null;

        const text_formatter = (body) => (i) => (key_prefix) => (was_n) => (combined_text_array) => {
            const {text} = body[i];

            const get_text_component = (body) => (i) => (key_prefix) => (was_n) => {
                const current_text = body[i];
                const {is_bold, is_superscript, is_italics, is_list, text} = current_text;

                const text_style = {
                    fontStyle: is_italics ? 'italic' : 'normal',
                    textAlignVertical: is_superscript ? 'top' : 'center'
                };

                if (is_superscript && Platform.OS === 'ios') {
                    return (
                        <View key={`creed-${key_prefix}-para-${i}`} style={{marginTop: -2, alignItems: 'flex-start', width: 8 * text.length, height: 16}}>
                            <Animated_Text font_size={is_superscript ? font_sizes.x_small : font_sizes.default}
                                           font_weight={is_bold ? 'bold' : 'normal'}
                                           style={text_style}>
                                {(i === 0 || is_superscript || was_n) ? text : ` ${text}`}
                            </Animated_Text>
                        </View>
                    );
                } else {
                    return (
                        <Animated_Text key={`creed-${key_prefix}-para-${i}`} font_size={is_superscript ? font_sizes.x_small : font_sizes.default}
                                       font_weight={is_bold ? 'bold' : 'normal'}
                                       style={text_style}>
                            {(i === 0 || is_superscript || was_n) ? text : ` ${text}`}
                        </Animated_Text>
                    );
                }
            };

            const text_component = get_text_component(body)(i)(key_prefix)(was_n);
            const new_combined_text_array = [...combined_text_array, text_component];
            const new_was_n = /\n/.test(text);
            const new_index = i + 1;

            if (new_index >= body.length) return new_combined_text_array;

            return text_formatter(body)(new_index)(key_prefix)(new_was_n)(new_combined_text_array);
        };

        const body_para_component = text_formatter(body)(0)(`body`)(false)([]);
        const extra_para_component = (Array.isArray(extra) && extra.length > 0) ? text_formatter(extra)(0)(`extra`)(false)([]) : null;

        const component_wrapper = (text_component) => (
            <Animated_Text text_align={'justify'} style={{marginVertical: sizes.default}}>
                {text_component}
            </Animated_Text>
        );

        const body_component = component_wrapper(body_para_component);
        const extra_component = (extra_para_component !== null && extra_para_component !== undefined) ? component_wrapper(extra_para_component) : null;

        return (
            <View>
                {title_component}
                {body_component}
                {extra_component}
            </View>
        );
    };

    return (
        <FlatList data={body.content}
                  ListHeaderComponent={Creeds_Body_Header(title)(description)(body.header)}
                  keyExtractor={key_extractor}
                  renderItem={Creeds_Body_Component(body.header)} style={{paddingHorizontal: sizes.large * 1.5}}
                   />
    );
}

class Creeds_Text extends Component {

    render() {
        const {creed_body_title, creed_body_description, creed_body} = this.props;
        return (
            <View>
                {Creeds_Text_Flatlist(creed_body_title)(creed_body_description)(creed_body)}
            </View>
        );
    }

};


function mapStateToProps(state) {
    return {
        creed_body_title: state.creed_body.title,
        creed_body_description: state.creed_body.description,
        creed_body: state.creed_body.body
    };
}

export default connect(mapStateToProps, null)(Creeds_Text);