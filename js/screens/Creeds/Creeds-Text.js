import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View
    , FlatList
    , Platform
    , PanResponder
    , Dimensions
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';
import {
    sizes
} from '../../common/common.styles';

import {
    Animated_Text,
    text_formatter
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';
import FontSlider from '../../common/Font-slider';
import Copy_Share_Tooltip from '../../common/Copy-Share-Tooltip-Btn';

import { is_object, is_number, no_op, composer, save_font_size } from '../../utils/functions';

import {
    touch_release_actions
    , scroll_swipe_actions
    , long_press_actions
} from '../../utils/touch-gestures';

import { show_misc_actions_modal_obj } from '../../../Navigator-Common'

import styles from './Creeds-Text.styles';

import { lock_in_creed_body } from '../../redux/actions/creeds-actions';
import {
    set_new_font_size
    , set_copy_share_btn
} from '../../redux/actions/state-actions';
import { MISC_ACTION_TEXT_TYPES } from '../Misc-Actions-Screen/Misc-Actions-Screen';

let main_view_ref = null;

const key_extractor = (item, i) => `creeds-body-text-${i}`;

const Header_Text_Component = (font_size, other_style, text) => {
    return (
        <Animated_Text text_align={'center'}
            font_size={font_size}
            style={other_style}
            font_weight={'bold'}>
            {text}
        </Animated_Text>
    );
};

const Creeds_Body_Component = (section_header, font_size) => ({ item }) => {
    const [title, body, extra] = item.content;

    const title_text = title.map(({ text }) => text).join(' ');

    const title_component = (section_header !== title_text) ?
        Header_Text_Component(font_size + 2, { marginTop: sizes.large }, title_text)
        : null;

    const body_para_component = text_formatter(font_size)(body)(`body`);

    const extra_para_component = (Array.isArray(extra) && extra.length > 0)
        ? text_formatter(font_size)(extra)(`extra`)
        : null;

    const component_wrapper = (text_component) => (
        <Animated_Text font_size={font_size} text_align={'justify'} style={{ paddingVertical: sizes.default }}>
            {text_component}
        </Animated_Text>
    );

    const [
        body_component,
        extra_component
    ] = [body_para_component, extra_para_component].map(component => is_object(component) ? component_wrapper(component) : null);


    return (
        <View>
            {title_component}
            {body_component}
            {extra_component}
        </View>
    );
};


const Creeds_Text_Flatlist = (swipe_action, scroll_swipe_actions, styles, {creed_body_title, creed_body_description, creed_body, text_font_size}) => {

    const Creeds_Body_Header = (
        <View style={styles.creeds_body_header}>
            {(creed_body_title !== creed_body.header) && Header_Text_Component(text_font_size * 1.2, undefined, creed_body_title)}
            {creed_body_description.length > 0 && Header_Text_Component(text_font_size * 1.1, undefined, creed_body_description)}
            {Header_Text_Component(text_font_size * 1.45, { marginTop: sizes.default }, creed_body.header)}
        </View>
    );

    return (
        <FlatList data={creed_body.content}
            ref={ref => main_view_ref = ref}
            ListHeaderComponent={Creeds_Body_Header}
            keyExtractor={key_extractor}
            renderItem={Creeds_Body_Component(creed_body.header, text_font_size)} 
            style={styles.flatlist_padding_horizontal}
            onScrollEndDrag={scroll_swipe_actions}
            contentInsetAdjustmentBehavior={"never"}
            {...swipe_action.panHandlers} />
    );
};


const go_to_prev_creed = (dispatch, library_books_info, library_type_index, selected_creed_index) => {
    const prev_creed_index = selected_creed_index - 1;
    const prev_has_two_levels_deep = (library_books_info[library_type_index][prev_creed_index]['levels_deep'] === 2);
    const prev_creed_last_ch_index = library_books_info[library_type_index][prev_creed_index]['last_ch_index'];

    const prev_creed_prev_ch_last_article_index = prev_has_two_levels_deep
        ? library_books_info[library_type_index][prev_creed_index]['last_article_index'].slice(-1)[0]
        : undefined;
    dispatch(lock_in_creed_body(library_type_index, prev_creed_index, prev_creed_last_ch_index, prev_creed_prev_ch_last_article_index));
};

const swipe_right = ({dispatch, creeds_library: library_books_info, library_type_index, selected_creed_index, selected_chapter_index, selected_article_index}) => () => {

    if (is_number(selected_article_index)) {
        if (selected_article_index > 0) {
            dispatch(lock_in_creed_body(library_type_index, selected_creed_index, selected_chapter_index, selected_article_index - 1));

        } else if (selected_article_index === 0) {
            if (selected_chapter_index > 0) {
                const prev_ch_index = selected_chapter_index - 1;
                const prev_ch_last_article_index = library_books_info[library_type_index][selected_creed_index]['last_article_index'][prev_ch_index];
                dispatch(lock_in_creed_body(library_type_index, selected_creed_index, prev_ch_index, prev_ch_last_article_index));

            } else if (selected_chapter_index === 0) {
                if (selected_creed_index > 0) {
                    go_to_prev_creed(dispatch, library_books_info, library_type_index, selected_creed_index);
                }
            }
        }

    } else if (!is_number(selected_article_index)) {

        if (selected_chapter_index > 0) {
            dispatch(lock_in_creed_body(library_type_index, selected_creed_index, selected_chapter_index - 1));

        } else if (selected_chapter_index === 0) {
            if (selected_creed_index > 0) {
                go_to_prev_creed(dispatch, library_books_info, library_type_index, selected_creed_index);
            }
        }
    }
    main_view_ref && main_view_ref.scrollToOffset({ offset: 0 });
};

const go_to_next_creed = (dispatch, library_books_info, library_type_index, selected_creed_index) => {
    const next_creed_index = selected_creed_index + 1;
    const next_has_two_levels_deep = (library_books_info[library_type_index][next_creed_index]['levels_deep'] === 2);

    const next_creed_next_ch_last_article_index = next_has_two_levels_deep
        ? 0
        : undefined;
    dispatch(lock_in_creed_body(library_type_index, next_creed_index, 0, next_creed_next_ch_last_article_index));
};

const swipe_left = ({dispatch, creeds_library: library_books_info, library_type_index, selected_creed_index, selected_chapter_index, selected_article_index}) => () => {

    const { last_ch_index = NaN, last_article_index = [] } = library_books_info[library_type_index][selected_creed_index];

    if (is_number(selected_article_index)) {
        const last_article_index_int = last_article_index[selected_chapter_index];

        if (selected_article_index < last_article_index_int) {
            dispatch(lock_in_creed_body(library_type_index, selected_creed_index, selected_chapter_index, selected_article_index + 1));

        } else if (selected_article_index === last_article_index_int) {
            if (selected_chapter_index < last_ch_index) {
                const next_ch_index = selected_chapter_index + 1;
                dispatch(lock_in_creed_body(library_type_index, selected_creed_index, next_ch_index, 0));

            } else if (selected_chapter_index === last_ch_index) {
                if (selected_creed_index < library_books_info[library_type_index].length - 1) {
                    go_to_next_creed(dispatch, library_books_info, library_type_index, selected_creed_index);
                }
            }
        }

    } else if (!is_number(selected_article_index)) {

        if (selected_chapter_index < last_ch_index) {
            dispatch(lock_in_creed_body(library_type_index, selected_creed_index, selected_chapter_index + 1));

        } else if (selected_chapter_index === last_ch_index) {
            if (selected_creed_index < library_books_info[library_type_index].length - 1) {
                go_to_next_creed(dispatch, library_books_info, library_type_index, selected_creed_index);
            }
        }
    }
    main_view_ref && main_view_ref.scrollToOffset({ offset: 0 });
};

const set_font_size = (dispatch) => (new_font_size) => {
    composer([
        set_new_font_size,
        dispatch
    ])(new_font_size);
    save_font_size(AsyncStorage, new_font_size);
};

const set_copy_share_btn_props = (dispatch) => (props) => {
    composer([
        set_copy_share_btn
        , dispatch
    ])(props);
};

const longPressFns = long_press_actions();

class Creeds_Text extends Component {

    componentDidMount() {
        main_view_ref && main_view_ref.scrollToOffset({ offset: 0 });
    }

    render() {
        const {
            text_font_size
            , copy_share_btn_props
            , dispatch
        } = this.props;

        const [swipe_right_loaded, swipe_left_loaded] = [
            swipe_right,
            swipe_left
        ].map(swipe_action => swipe_action(this.props));

        const one_third_screen_width = Math.floor(Dimensions.get('window').width / 3);
        const set_font_size_wo_font_size = set_font_size(dispatch);

        const touch_release_actions_loaded = touch_release_actions(swipe_right_loaded, swipe_left_loaded, longPressFns.onPanResponderRelease(), one_third_screen_width);

        const set_copy_share_btn_props_loaded = set_copy_share_btn_props(dispatch);

        const touch_actions = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: longPressFns.onPanResponderGrant(),
            onPanResponderMove: longPressFns.onPanResponderMove((e) => {
                set_copy_share_btn_props_loaded({
                    top: e.nativeEvent.pageY
                    , left: e.nativeEvent.pageX
                    , isHidden: false
                });
            })(() => {
                if (!copy_share_btn_props.isHidden) {
                    set_copy_share_btn_props_loaded();
                }
            }),
            onPanResponderRelease: touch_release_actions_loaded
        });

        const scroll_swipe_actions_loaded = Platform.OS === 'android'
            ? scroll_swipe_actions(swipe_left_loaded)(swipe_right_loaded)
            : no_op;

        return (
            <Default_Bg>
                {Creeds_Text_Flatlist(touch_actions, scroll_swipe_actions_loaded, styles, this.props)}

                {!copy_share_btn_props.isHidden &&
                    (<Copy_Share_Tooltip
                        onPress={() => {
                            set_copy_share_btn_props_loaded();
                            Navigation.showModal(show_misc_actions_modal_obj(MISC_ACTION_TEXT_TYPES.CREEDS));
                        }}
                        onCancel={() => {
                            set_copy_share_btn_props_loaded();
                        }}
                        top={copy_share_btn_props.top - 2 * sizes.x_large}
                        left={copy_share_btn_props.left - 50} />)
                }

                <FontSlider value={text_font_size} onSlidingComplete={set_font_size_wo_font_size} />
            </Default_Bg>
        );
    }

}


function mapStateToProps(state) {
    return {
        creed_body_title: state.creeds.creed_body.title
        , creed_body_description: state.creeds.creed_body.description
        , creed_body: state.creeds.creed_body.body
        , creed_levels: state.creeds.creed.levels_deep || 0
        , creeds_library: state.creeds.creeds_library
        , tab_bar_selected_index: state.tab_bar_selected_index
        , library_type_index: state.creeds.creed_body.library_type_index
        , selected_creed_index: state.creeds.creed_body.selected_creed_index
        , selected_chapter_index: state.creeds.creed_body.selected_chapter_index
        , selected_article_index: state.creeds.creed_body.selected_article_index
        // state reducer
        , text_font_size: state.text_font_size
        , copy_share_btn_props: state.copy_share_btn_props
    };
}

export default connect(mapStateToProps, null)(Creeds_Text);
