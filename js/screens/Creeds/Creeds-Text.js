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
    Animated_Text,
    text_formatter
} from '../../common/Text';

import {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';

import {} from '../../utils/alert';
import {is_present} from '../../utils/functions';
import {change_creeds_chapter_lv} from '../../redux/actions/state-actions';

import styles from './Creeds-Text.styles';


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

const Creeds_Body_Component = (section_header) => ({item, index}) => {
    const [title, body, extra] = item.content;

    const title_text = title.map(({text}) => text).join(' ');

    const title_component = (section_header !== title_text) ?
        Header_Text_Component(font_sizes.large)({marginTop: sizes.large})(title_text)
        : null;

    const body_para_component = text_formatter(body)(0)(`body`)(false)([]);

    const extra_para_component = (Array.isArray(extra) && extra.length > 0)
        ? text_formatter(extra)(0)(`extra`)(false)([])
        : null;

    const component_wrapper = (text_component) => (
        <Animated_Text text_align={'justify'} style={{marginVertical: sizes.default}}>
            {text_component}
        </Animated_Text>
    );

    const [
              body_component,
              extra_component
          ] = [body_para_component, extra_para_component].map(component => is_present(component) ? component_wrapper(component) : null);


    return (
        <View>
            {title_component}
            {body_component}
            {extra_component}
        </View>
    );
};

const Creeds_Text_Flatlist = (styles) => (title) => (description) => (body) => {

    const Creeds_Body_Header = (
        <View style={styles.creeds_body_header}>
            {(title !== body.header) && Header_Text_Component(font_sizes.x_large)()(title)}
            {description.length > 0 && Header_Text_Component(font_sizes.large)()(description)}
            {Header_Text_Component(font_sizes.xx_large)({marginTop: sizes.default})(body.header)}
        </View>
    );

    return (
        <FlatList data={body.content}
                  ListHeaderComponent={Creeds_Body_Header}
                  keyExtractor={key_extractor}
                  renderItem={Creeds_Body_Component(body.header)} style={styles.flatlist_padding_horizontal}/>
    );
};

const tab_2_actions = (navigator) => () => navigator.popToRoot();

const select_tab = (tab_2_actions) => (tab_index) => () => {
    if (tab_index === 2) {
        tab_2_actions();
    }
};


class Creeds_Text extends Component {

    render() {
        const {
            creed_body_title
            , creed_body_description
            , creed_body
            , tab_bar_selected_index
            , navigator
            , dispatch
        } = this.props;

        const select_tab_wo_tab_index = select_tab(tab_2_actions(navigator));

        const tab_actions = [
            select_tab_wo_tab_index
        ];

        return (
            <Default_Bg_w_Tab_Bar navigator={navigator}
                                  dispatch={dispatch}
                                  tab_bar_selected_index={tab_bar_selected_index}
                                  other_actions_array={tab_actions}>
                {Creeds_Text_Flatlist(styles)(creed_body_title)(creed_body_description)(creed_body)}
            </Default_Bg_w_Tab_Bar>
        );
    }

};


function mapStateToProps(state) {
    return {
        creed_body_title: state.creed_body.title
        , creed_body_description: state.creed_body.description
        , creed_body: state.creed_body.body
        , creed_levels: state.creed.levels_deep || 0
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Creeds_Text);
