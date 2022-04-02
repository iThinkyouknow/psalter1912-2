import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Platform
    , Dimensions
    , SectionList
    , TouchableHighlight
    , Image
    , PanResponder
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

// import styles from './creeds-text.styles';
import {
    colors,
    sizes,
    font_sizes,
    zIndex,
    native_elements,
    buttons,
    border_radii
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text,
    text_formatter
} from '../../common/Text';

import FontSlider from '../../common/Font-slider';

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';

import { Rounded_Button } from '../../common/Rounded-Button';


import { } from '../../utils/alert';
import { slide_down_animation, slide_side_animation, slide_down_to } from '../../utils/animation';

import { is_present_type, is_string, no_op, composer, save_font_size } from '../../utils/functions';
import { show_misc_actions_modal_obj, hide_tabs_action } from '../../../Navigator-Common';
import {
    touch_release_actions
    , scroll_swipe_actions
    , long_press_actions
} from '../../utils/touch-gestures';

import {
    bible_toggle_back_to_book_buttons
    , set_new_font_size
    , set_copy_share_btn
    , set_bible_header_scroll_details
} from '../../redux/actions/state-actions';

import {
    get_bible_chapter_list
    , get_bible_init
    , get_bible_passage
} from '../../redux/actions/bible-actions';

import {
    on_psalter_change
} from '../Psalter/Psalter'
import { MISC_ACTION_TEXT_TYPES } from '../Misc-Actions-Screen/Misc-Actions-Screen';

let main_view_ref = null;

const Header_Text_Component = (font_size) => (font_family) => (other_style) => (text) => {
    return (
        <Animated_Text text_align={'center'}
            font_size={font_size}
            font_family={font_family}
            style={other_style} >
            {text}
        </Animated_Text>
    );
};

const floating_header_animation = slide_down_to(10)(0)(-250);
const floating_header_animation_position = floating_header_animation.animated_value;
const floating_header_animation_slide_up = floating_header_animation.slide_up;
const floating_header_animation_slide_down = floating_header_animation.slide_down;

const _Floating_Header = (title) => (description) => (font_size) => {
    const transform_style = {
        transform: [{ translateY: floating_header_animation_position }]
    }
    const text_font_size = Math.min(font_size * 2, 60);
    const desc_font_size = Math.min(font_size * 1.2, 40);

    return (
        <Animated.View style={[{
            paddingHorizontal: sizes.large * 1.5
            , paddingTop: 3 * sizes.default + native_elements.status_bar
            , marginBottom: 0
            , alignSelf: 'stretch'
            , backgroundColor: colors.dark_cerulean
            , position: 'absolute'
            , top: 0
            , left: 0
            , right: 0
        }, transform_style]}>
            {Header_Text_Component(text_font_size)('Durwent')()(title)}
            {(description.length > 0) && Header_Text_Component(desc_font_size)()({ marginTop: sizes.default })(description)}
        </Animated.View>
    );
};

const list_header_component = (title) => (description) => (font_size) => {
    return (
        <View style={{
            paddingHorizontal: sizes.large * 1.5,
            paddingTop: 3 * sizes.default + native_elements.status_bar,
            marginBottom: 0
        }}>
            {Header_Text_Component(font_size * 2)('Durwent')()(title)}
            {(description.length > 0) && Header_Text_Component(font_size * 1.2)()({ marginTop: sizes.default })(description)}
        </View>
    );
};

const bible_key_extractor = (item, index) => `${item.title}-${index}`;

const bible_body_component = (font_size) => ({ item, index }) => {
    const text_component = (
        <Animated_Text font_size={font_size} text_align={'justify'}
            style={{ marginTop: sizes.large, paddingHorizontal: sizes.large * 1.5 }}>
            <Default_Text text_align={'justify'} font_size={font_size}>{`${index + 1}. `}</Default_Text>
            {text_formatter(font_size)(item.filter(text => !text.is_footnote))(`bible-text`)}
        </Animated_Text>
    );

    return text_component;
};

const flatlist_on_scroll = (props) => (e) => {
    const y = e.nativeEvent.contentOffset.y
    if (y > 200) {
        if ((props.scroll_details.y || 0) < y) {
            floating_header_animation_slide_up();
        } else if ((props.scroll_details.y || 0) > y) {
            floating_header_animation_slide_down();
        }
    } else {
        floating_header_animation_slide_up();
    }
};

const flatlist_on_scroll_begin = (props) => (e) => {
    props.dispatch(set_bible_header_scroll_details({
        ...(e.nativeEvent.contentOffset || {})
    }));
};

const Bible_Text_Component = (props) => (touch_actions) => (scroll_swipe_actions) => (chapter) => (font_size) => {

    return (
        <FlatList data={chapter.content.slice(1)}
            scrollEventThrottle={300}
            ref={ref => main_view_ref = ref}
            ListHeaderComponent={list_header_component(chapter.title)(chapter.description)(font_size)}
            keyExtractor={bible_key_extractor}
            renderItem={bible_body_component(font_size)}
            scrollEnabled={true}
            onScrollBeginDrag={flatlist_on_scroll_begin(props)}
            onScroll={flatlist_on_scroll(props)}
            onScrollEndDrag={scroll_swipe_actions}
            {...touch_actions.panHandlers}
        />
    );
};


const library_slide_down_animation = slide_down_animation(500)(12);


const library_container_slide_anim = slide_side_animation(100)(0)(Dimensions.get('window').width);

const select_book_action = (dispatch) => (book_index) => () => {
    dispatch(get_bible_chapter_list(book_index));
    library_container_slide_anim.slide();
};


const book_button = ({ width }) => (selected_index) => (select_book_action) => (book_start_index) => (item, index) => { //work on
    const box_width = Math.floor(width / 6);

    const true_index = is_present_type('number')(book_start_index) ? book_start_index + index : index;

    const border_style = (true_index === 18 && is_present_type('string')(item))
        ? { borderWidth: 2, borderColor: colors.blue }
        : {};

    const bible_books_button = {
        alignItems: 'center',
        justifyContent: 'center'
    };

    const bible_books_button_dyn = {
        width: box_width,
        height: box_width,
    };

    const text_extra_style = {
        color: (true_index === selected_index) ? colors.blue : colors.white
    };

    return (
        <TouchableHighlight onPress={select_book_action(true_index)}
            style={[bible_books_button, bible_books_button_dyn, border_style]}
            key={`bible-book-button-${item}-${index}`}>
            <View>
                {Header_Text_Component(font_sizes.large)()(text_extra_style)(item)}
                <View style={{
                    marginTop: sizes.default,
                    height: 1,
                    width: Math.floor(width / 8),
                    backgroundColor: colors.dark_cerulean
                }} />
            </View>

        </TouchableHighlight>
    );
};


const book_buttons_section_header = (book_button_component_loaded) => ({ section: { title, data, book_start_index } }) => {

    const buttons_component = data.map(book_button_component_loaded(book_start_index));

    return (
        <View style={{ marginTop: sizes.default * 3 }}>
            {Header_Text_Component(font_sizes.x_large)()()(title)}
            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                {buttons_component}
            </View>
        </View>
    );
}

const bible_library_key_extractor = (item, index) => `bible-book-button-${item}-${index}`;


const bible_library = (book_list) => (book_buttons_section_header_loaded) => {
    const ot = book_list.slice(0, 39);
    const nt = book_list.slice(39);

    const sections = [
        { data: ot, title: 'Old Testament', book_start_index: 0 },
        { data: nt, title: 'New Testament', book_start_index: 39 }
    ];

    const bible_library_style = {
        flexShrink: 0,
        marginTop: sizes.large,
        marginBottom: sizes.x_large + 40
    };


    return (
        <SectionList sections={sections}
            renderSectionHeader={book_buttons_section_header_loaded}
            renderItem={() => null}
            keyExtractor={bible_library_key_extractor}
            style={bible_library_style}
        />
    );
};

const chapter_key_extractor = (item, index) => `${item}-${index}`;

const chapter_header = (width) => (title) => {
    return (
        Header_Text_Component(font_sizes.x_large)()({ marginTop: sizes.default * 3, width })(title)
    );
};


const chapter_button = (book_button_loaded) => ({ item, index }) => {
    return book_button_loaded(item, index);
};

const chapter_library = (chapter_header_loaded) => (book_chapters_array = []) => (ch_button_loaded) => {
    const bible_library_style = {
        flexShrink: 0,
        marginTop: sizes.large,
        marginBottom: sizes.x_large + 40
    };

    return (
        <FlatList data={book_chapters_array}
            ListHeaderComponent={chapter_header_loaded}
            keyExtractor={chapter_key_extractor}
            renderItem={ch_button_loaded}
            numColumns={6}
            style={bible_library_style} />
    );
};

const close_library_button = ({ width }) => {
    const child_component = (
        <Default_Text text_align={'center'}>
            Cancel
        </Default_Text>
    );

    return Rounded_Button(child_component)(library_slide_down_animation.slide)(width)
};

const back_to_books_btn = ({ width }) => {
    const child_component = (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: buttons.small, height: buttons.small }}
                source={require('../../../images/icons/icon-back-arrow.png')} />
            <Default_Text>
                Chapters
            </Default_Text>
        </View>
    );

    return Rounded_Button(child_component)(library_container_slide_anim.slide)(width)
};

const _library_bottom_buttons_container = (width) => (close_library_button) => (back_to_books_button) => {
    const library_bottom_container_style = {
        width,
        justifyContent: 'space-around',
        position: 'absolute',
        flexDirection: 'row',
        bottom: sizes.default,
        height: 40,
        marginBottom: sizes.medium,
        // backgroundColor: 'blue'
    };

    return (
        <View style={library_bottom_container_style}>
            {close_library_button}
            {back_to_books_button}
        </View>
    );
};

const library_bottom_buttons_container = _library_bottom_buttons_container(Dimensions.get('window').width);

const select_chapter_action = (dispatch) => (book_index) => (chapter_index) => () => {
    dispatch(get_bible_passage(book_index)(chapter_index));
    library_slide_down_animation.slide();
    library_container_slide_anim.slide();
    main_view_ref && main_view_ref.scrollToOffset({ offset: 0 });

};

const _show_back_to_books_button = () => {
    let should_show = true;

    return (width) => (dispatch) => ({ value }) => {
        if (should_show && value < width - 20) {
            should_show = false;
            return dispatch(bible_toggle_back_to_book_buttons(true));

        } else if (!should_show && value > width - 20) {
            should_show = true;
            return dispatch(bible_toggle_back_to_book_buttons(false));
        }
    };
};

const show_back_to_books_button = _show_back_to_books_button();


const on_psalter_and_score_tab_select = (dispatch) => (current_book_index) => (current_psalm) => (psalter_psalm) => (psalm_to_psalter_obj) => (tab_index) => () => {
    if ((tab_index === 0 || tab_index === 1) && current_book_index === 18 && current_psalm !== psalter_psalm) {
        on_psalter_change(dispatch)(psalm_to_psalter_obj[current_psalm])();
    }
};

const swipe_right_action = (dispatch) => (per_book_ch_last_index_array) => (book_index) => (ch_index) => () => {
    if (ch_index === 0) {
        if (book_index === 0) {
            const last_book_index = per_book_ch_last_index_array.length - 1;
            dispatch(get_bible_passage(last_book_index)(per_book_ch_last_index_array[last_book_index]));

        } else if (book_index > 0) {
            const prev_book_index = book_index - 1;
            dispatch(get_bible_passage(prev_book_index)(per_book_ch_last_index_array[prev_book_index]));
        }
    } else if (ch_index > 0) {
        dispatch(get_bible_passage(book_index)(ch_index - 1));
    }
    main_view_ref && main_view_ref.scrollToOffset({ offset: 0 });
};

const swipe_left_action = (dispatch) => (per_book_ch_last_index_array) => (book_index) => (ch_index) => () => {
    if (ch_index === per_book_ch_last_index_array[book_index]) {
        const last_book_index = per_book_ch_last_index_array.length - 1;

        if (book_index === last_book_index) {
            dispatch(get_bible_passage(0)(0));
        } else if (book_index < last_book_index) {
            const next_book_index = book_index + 1;
            dispatch(get_bible_passage(next_book_index)(0));
        }
    } else if (ch_index < per_book_ch_last_index_array[book_index]) {
        dispatch(get_bible_passage(book_index)(ch_index + 1));
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

class Bible_Text extends Component {

    constructor(props) {
        super(props);
        library_container_slide_anim.animated_value.addListener(show_back_to_books_button(Dimensions.get('window').width)(props.dispatch));

    }

    componentDidMount() {
        setTimeout(() => {
            const bible_storage_key = 'Bible-KJV';
            const divisions = 4;
            const keys = Array.from({ length: divisions }, (_, i) => `${bible_storage_key}${i}`);
            AsyncStorage.multiGet(keys)
                .then(key_strings => {

                    const json_string = key_strings
                        .filter(([_, string]) => string)
                        .map(([_, string]) => string)
                        .join('');

                    let json;
                    try {
                        json = JSON.parse(json_string);
                    } catch (error) {
                        console.log('unable to parse bible json error:', error);
                        json = require('../../../data/Bible-KJV.json');
                    }

                    json && this.props.dispatch(get_bible_init(json));
                })
                .catch((err) => {
                    console.error(err);
                });
        }, 1000);
    }

    componentWillUnmount() {
        library_container_slide_anim.animated_value.removeListener();
    }

    render() {
        const {
            navigator
            , dispatch
            , book_list
            , bible_passage = {}
            , current_book_index = NaN
            , current_chapter_index = NaN
            , selection_chapter_list = []
            , selection_selected_book_title = ''
            , selection_book_index = NaN
            , tab_bar_selected_index = NaN
            , psalter_psalm = NaN
            , first_psalter_index_of_each_psalm_obj = {}
            , per_book_ch_last_index_array = []
            , bible_should_show_back_to_books_button
            , copy_share_btn_props
            , text_font_size
        } = this.props;

        hide_tabs_action(navigator)();

        const library_dynamic_style = {
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            bottom: Dimensions.get('window').height,
            // bottom: 0,
            transform: [
                { translateY: library_slide_down_animation.animated_value }
            ]
        };

        const library_style = {
            position: 'absolute',
            left: 0,
            backgroundColor: colors.black,
            opacity: 0.8,
            zIndex: zIndex.small,
            alignItems: 'center'
        };

        const book_button_component_dimensions = book_button(Dimensions.get('window'));
        const book_button_component = book_button_component_dimensions(current_book_index)(select_book_action(dispatch));

        const book_buttons_section_header_loaded = book_buttons_section_header(book_button_component);

        const bible_library_container_style = {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            overflow: 'hidden',
            left: -Dimensions.get('window').width,
            transform: [
                { translateX: library_container_slide_anim.animated_value }
            ]
        };

        const select_chapter_action_w_book_index = select_chapter_action(dispatch)(selection_book_index);

        const selection_chapter_index = (selection_book_index === current_book_index)
            ? current_chapter_index
            : 0;

        const chapter_button_component = chapter_button(book_button_component_dimensions(selection_chapter_index)(select_chapter_action_w_book_index)(0));

        const chapter_lib_header = chapter_header(Dimensions.get('window').width)(selection_selected_book_title);

        const back_to_books_btn_present = bible_should_show_back_to_books_button ? back_to_books_btn(Dimensions.get('window')) : undefined;

        const change_psalter_on_tab_action = (
            current_book_index === 18
            && current_chapter_index + 1 !== psalter_psalm
        )
            ? on_psalter_and_score_tab_select(dispatch)(current_book_index)(current_chapter_index + 1)(psalter_psalm)(first_psalter_index_of_each_psalm_obj)
            : () => () => {
            };

        const [swipe_right_loaded, swipe_left_loaded] = [swipe_right_action, swipe_left_action].map(swipe_action => swipe_action(dispatch)(per_book_ch_last_index_array)(current_book_index)(current_chapter_index));

        const set_font_size_wo_font_size = set_font_size(dispatch);

        const one_third_screen_width = Math.floor(Dimensions.get('window').width / 3)
        const touch_release_actions_loaded = touch_release_actions(swipe_right_loaded)(swipe_left_loaded)(longPressFns.onPanResponderRelease())(one_third_screen_width);

        const set_copy_share_btn_props_loaded = set_copy_share_btn_props(dispatch);

        const touch_actions = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
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

        const tab_actions = [
            change_psalter_on_tab_action
        ];

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props}>
                <Animated.View style={[library_style, library_dynamic_style]}>
                    <Animated.View style={bible_library_container_style}>
                        {bible_library(book_list)(book_buttons_section_header_loaded)}
                        {chapter_library(chapter_lib_header)(selection_chapter_list)(chapter_button_component)}
                    </Animated.View>

                    {library_bottom_buttons_container(close_library_button(Dimensions.get('window')))(back_to_books_btn_present)}
                </Animated.View>

                {is_string(bible_passage.title)
                    ? Bible_Text_Component(this.props)(touch_actions)(scroll_swipe_actions_loaded)(bible_passage)(text_font_size)
                    : <View style={{ flex: 1 }} />
                }

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    height: native_elements.nav_bar_std,
                    paddingHorizontal: sizes.large,
                    paddingVertical: sizes.default / 2
                }}>
                    {Rounded_Button(<Default_Text
                        text_align={'center'}>Select</Default_Text>)(library_slide_down_animation.slide)(Dimensions.get('window').width)}
                </View>

                {!copy_share_btn_props.isHidden &&
                    (<Copy_Share_Tooltip
                        onPress={() => {
                            set_copy_share_btn_props_loaded();
                            navigator.showModal(show_misc_actions_modal_obj(MISC_ACTION_TEXT_TYPES.BIBLE));
                        }}
                        onCancel={() => {
                            set_copy_share_btn_props_loaded();
                        }}
                        top={copy_share_btn_props.top - 2 * sizes.x_large}
                        left={copy_share_btn_props.left - 50} />)
                }

                <FontSlider value={text_font_size} onSlidingComplete={set_font_size_wo_font_size} />

                {is_string(bible_passage.title) &&
                    _Floating_Header(bible_passage.title)(bible_passage.description)(text_font_size)
                }
            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        book_list: state.bible.bible_book_list
        , bible_passage: state.bible.bible_passage
        , current_book_index: state.bible.bible_passage.book_index
        , current_chapter_index: state.bible.bible_passage.chapter_index
        , selection_chapter_list: state.bible.selection_bible_chapter_list.chapter_list
        , selection_selected_book_title: state.bible.selection_bible_chapter_list.title
        , selection_book_index: state.bible.selection_bible_chapter_list.book_index
        , per_book_ch_last_index_array: state.bible.bible_per_book_ch_last_index_array
        , tab_bar_selected_index: state.tab_bar_selected_index
        , psalter_psalm: state.psalter.content.psalm
        , first_psalter_index_of_each_psalm_obj: state.psalter.first_psalter_index_of_each_psalm_obj

        // state reducer
        , bible_should_show_back_to_books_button: state.bible_should_show_back_to_books_button
        , text_font_size: state.text_font_size
        , copy_share_btn_props: state.copy_share_btn_props
        , scroll_details: state.bible_scroll_details
    };
}

export default connect(mapStateToProps, null)(Bible_Text);
