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

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';

import {} from '../../utils/alert';
import {is_present_type, no_op, composer} from '../../utils/functions';

import {
    touch_release_actions
    , scroll_swipe_actions
    , tap_to_change_font_size
} from '../../utils/touch-gestures';

import styles from './Creeds-Text.styles';

import {lock_in_creed_body} from '../../redux/actions/creeds-actions';
import {creeds_text_set_new_font_size} from '../../redux/actions/state-actions';


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

const Creeds_Body_Component = (section_header) => (font_size) => ({item, index}) => {
    const [title, body, extra] = item.content;

    const title_text = title.map(({text}) => text).join(' ');

    const title_component = (section_header !== title_text) ?
        Header_Text_Component(font_size + 2)({marginTop: sizes.large})(title_text)
        : null;

    const body_para_component = text_formatter(font_size)(body)(0)(`body`)(false)([]);

    const extra_para_component = (Array.isArray(extra) && extra.length > 0)
        ? text_formatter(font_size)(extra)(0)(`extra`)(false)([])
        : null;

    const component_wrapper = (text_component) => (
        <Animated_Text font_size={font_size} text_align={'justify'} style={{paddingVertical: sizes.default}}>
            {text_component}
        </Animated_Text>
    );

    const [
        body_component,
        extra_component
    ] = [body_para_component, extra_para_component].map(component => is_present_type('object')(component) ? component_wrapper(component) : null);


    return (
        <View>
            {title_component}
            {body_component}
            {extra_component}
        </View>
    );
};


const Creeds_Text_Flatlist = (swipe_action) => (scroll_swipe_actions) => (styles) => (title) => (description) => (body) => (font_size) => {

    const Creeds_Body_Header = (
        <View style={styles.creeds_body_header}>
            {(title !== body.header) && Header_Text_Component(font_size + 4)()(title)}
            {description.length > 0 && Header_Text_Component(font_size + 2)()(description)}
            {Header_Text_Component(font_size + 8)({marginTop: sizes.default})(body.header)}
        </View>
    );

    return (
        <FlatList data={body.content}
                  ListHeaderComponent={Creeds_Body_Header}
                  keyExtractor={key_extractor}
                  renderItem={Creeds_Body_Component(body.header)(font_size)} style={styles.flatlist_padding_horizontal}
                  onScrollEndDrag={scroll_swipe_actions}
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

const go_to_next_creed = (dispatch) => (library_books_info) => (library_type_index) => (selected_creed_index) => {
    const next_creed_index = selected_creed_index + 1;
    const next_has_two_levels_deep = (library_books_info[library_type_index][next_creed_index]['levels_deep'] === 2);

    const next_creed_next_ch_last_article_index = next_has_two_levels_deep
        ? 0
        : undefined;
    dispatch(lock_in_creed_body(library_type_index)(next_creed_index)(0)(next_creed_next_ch_last_article_index));
};

const swipe_left = (dispatch) => (library_books_info) => (library_type_index) => (selected_creed_index) => (selected_chapter_index) => (selected_article_index) => () => {

    const {last_ch_index = NaN, last_article_index = []} = library_books_info[library_type_index][selected_creed_index];

    if (is_present_type('number')(selected_article_index)) {
        const last_article_index_int = last_article_index[selected_chapter_index];

        if (selected_article_index < last_article_index_int) {
            dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(selected_chapter_index)(selected_article_index + 1));

        } else if (selected_article_index === last_article_index_int) {
            if (selected_chapter_index < last_ch_index) {
                const next_ch_index = selected_chapter_index + 1;
                dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(next_ch_index)(0));

            } else if (selected_chapter_index === last_ch_index) {
                if (selected_creed_index < library_books_info[library_type_index].length - 1) {
                    go_to_next_creed(dispatch)(library_books_info)(library_type_index)(selected_creed_index);
                }
            }
        }

    } else if (!is_present_type('number')(selected_article_index)) {

        if (selected_chapter_index < last_ch_index) {
            dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(selected_chapter_index + 1)());

        } else if (selected_chapter_index === last_ch_index) {
            if (selected_creed_index < library_books_info[library_type_index].length - 1) {
                go_to_next_creed(dispatch)(library_books_info)(library_type_index)(selected_creed_index);
            }
        }
    }
};

const set_font_size = (dispatch) => (new_font_size) => {
    composer([
        creeds_text_set_new_font_size,
        dispatch
    ])(new_font_size);
};

const tap_to_change_font_size_action = tap_to_change_font_size();



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
            , creeds_text_font_size
            , navigator
            , dispatch
        } = this.props;

        const select_tab_wo_tab_index = select_tab(tab_2_actions(navigator));

        const tab_actions = [
            select_tab_wo_tab_index
        ];

        const [swipe_right_loaded, swipe_left_loaded] = [
            swipe_right,
            swipe_left
        ].map(swipe_action => swipe_action(dispatch)(creeds_library)(library_type_index)(selected_creed_index)(selected_chapter_index)(selected_article_index));

        const one_third_screen_width = Math.floor(Dimensions.get('window').width / 3);
        const set_font_size_wo_font_size = set_font_size(dispatch);

        const tap_to_change_font_size_loaded = tap_to_change_font_size_action(set_font_size_wo_font_size)(creeds_text_font_size);

        const touch_release_actions_loaded = touch_release_actions(swipe_right_loaded)(swipe_left_loaded)(tap_to_change_font_size_loaded)(one_third_screen_width);

        const touch_actions = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderRelease: touch_release_actions_loaded
        });

        const scroll_swipe_actions_loaded = Platform.OS === 'android'
            ? scroll_swipe_actions(swipe_left_loaded)(swipe_right_loaded)
            : no_op;

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props}>
                {Creeds_Text_Flatlist(touch_actions)(scroll_swipe_actions_loaded)(styles)(creed_body_title)(creed_body_description)(creed_body)(creeds_text_font_size)}
            </Default_Bg>
        );
    }

}



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
        // state reducer
        , creeds_text_font_size: state.creeds_text_font_size
    };
}

export default connect(mapStateToProps, null)(Creeds_Text);
