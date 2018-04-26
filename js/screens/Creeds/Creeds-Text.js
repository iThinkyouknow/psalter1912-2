import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Platform
    , PanResponder
    , Dimensions
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
import {is_present, is_present_type} from '../../utils/functions';

import {swipe_side_action, swipe} from '../../utils/touch-gestures'

import styles from './Creeds-Text.styles';

import {lock_in_creed_body} from '../../redux/actions/creeds-actions'


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

const Creeds_Text_Flatlist = (swipe_action) => (styles) => (title) => (description) => (body) => {

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
                  renderItem={Creeds_Body_Component(body.header)} style={styles.flatlist_padding_horizontal}
                  {...swipe_action.panHandlers} />
    );
};

const tab_2_actions = (navigator) => () => navigator.popToRoot();

const select_tab = (tab_2_actions) => (tab_index) => () => {
    if (tab_index === 2) {
        tab_2_actions();
    }
};

const go_to_prev_creed = (dispatch) => (library_books_info) => (library_type_index) => (selected_creed_index) => {
    const prev_creed_index = selected_creed_index - 1;
    const prev_has_two_levels_deep = (library_books_info[library_type_index][prev_creed_index]['levels_deep'] === 2);
    const prev_creed_last_ch_index = library_books_info[library_type_index][prev_creed_index]['last_ch_index'];

    const prev_creed_prev_ch_last_article_index = prev_has_two_levels_deep
        ? library_books_info[library_type_index][prev_creed_index]['last_article_index'].slice(-1)[0]
        : undefined;
    dispatch(lock_in_creed_body(library_type_index)(prev_creed_index)(prev_creed_last_ch_index)(prev_creed_prev_ch_last_article_index));
};

const swipe_right = (dispatch) => (library_books_info) => (library_type_index) => (selected_creed_index) => (selected_chapter_index) => (selected_article_index) => () => {
    //library_type_index => selected_creed_index => selected_chapter_index => selected_article_index =>


    if (is_present_type('number')(selected_article_index)) {
        if (selected_article_index > 0) {
            dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(selected_chapter_index)(selected_article_index - 1));

        } else if (selected_article_index === 0) {
            if (selected_chapter_index > 0) {
                const prev_ch_index = selected_chapter_index - 1;
                const prev_ch_last_article_index = library_books_info[library_type_index][selected_creed_index]['last_article_index'][prev_ch_index];
                dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(prev_ch_index)(prev_ch_last_article_index));

            } else if (selected_chapter_index === 0) {
                if (selected_creed_index > 0) {
                    go_to_prev_creed(dispatch)(library_books_info)(library_type_index)(selected_creed_index);
                }
            }
        }

    } else if (!is_present_type('number')(selected_article_index)) {

        if (selected_chapter_index > 0) {
            dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(selected_chapter_index - 1)());

        } else if (selected_chapter_index === 0) {
            if (selected_creed_index > 0) {
                go_to_prev_creed(dispatch)(library_books_info)(library_type_index)(selected_creed_index);
            }
        }
    }
};




class Creeds_Text extends Component {

    render() {
        const {
            creed_body_title
            , creed_body_description
            , creed_body
            , creeds_library
            , tab_bar_selected_index
            , library_type_index
            , selected_creed_index
            , selected_chapter_index
            , selected_article_index
            , navigator
            , dispatch
        } = this.props;

        const select_tab_wo_tab_index = select_tab(tab_2_actions(navigator));

        const tab_actions = [
            select_tab_wo_tab_index
        ];

        const swipe_right_loaded = swipe_right(dispatch)(creeds_library)(library_type_index)(selected_creed_index)(selected_chapter_index)(selected_article_index);

        const on_swipe_loaded = swipe_side_action(Math.floor(Dimensions.get('window').width / 3))(swipe_right_loaded)();

        const swipe_action_loaded = swipe(on_swipe_loaded);

        return (
            <Default_Bg_w_Tab_Bar navigator={navigator}
                                  dispatch={dispatch}
                                  tab_bar_selected_index={tab_bar_selected_index}
                                  other_actions_array={tab_actions}>
                {Creeds_Text_Flatlist(swipe_action_loaded)(styles)(creed_body_title)(creed_body_description)(creed_body)}
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
        , creeds_library: state.creeds_library
        , tab_bar_selected_index: state.tab_bar_selected_index
        , library_type_index: state.creed_body.library_type_index
        , selected_creed_index: state.creed_body.selected_creed_index
        , selected_chapter_index: state.creed_body.selected_chapter_index
        , selected_article_index: state.creed_body.selected_article_index
    };
}

export default connect(mapStateToProps, null)(Creeds_Text);
