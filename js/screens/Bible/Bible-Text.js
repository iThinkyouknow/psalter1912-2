import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Platform
    , Dimensions
    , SectionList
    , TouchableOpacity
    , Image
    , ImageBackground
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';


import {
    colors,
    sizes,
    font_sizes,
    zIndex,
    native_elements,
    buttons,
    user_font_color,
    user_tint_color
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text,
    text_formatter
} from '../../common/Text';

import FontSlider from '../../common/Font-slider';

import Default_Bg from '../../common/Default-bg';

import { Rounded_Button } from '../../common/Rounded-Button';

import { slide_down_animation, slide_side_animation, slide_down_to } from '../../utils/animation';

import { is_string, is_number, no_op, composer, save_font_size } from '../../utils/functions';
import { show_misc_actions_modal_obj } from '../../../Navigator-Common';

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
import { Navigation } from 'react-native-navigation';
import { on_pinch_text_size } from '../../utils/functions';
import { pinch_text_gesture, swipe_gesture, long_press_gesture } from '../../utils/touch-gestures';
import { set_navigation_colors } from '../../..';

let main_view_ref = null;

const Header_Text_Component = (font_size, font_family, other_style, text) => {
    return (
        <Animated_Text text_align={'center'}
            font_size={font_size}
            font_family={font_family}
            style={other_style} >
            {text}
        </Animated_Text>
    );
};

const floating_header_animation = slide_down_to(10, 0, -500);
const floating_header_animation_position = floating_header_animation.animated_value;
const floating_header_animation_slide_up = floating_header_animation.slide_up;
const floating_header_animation_slide_down = floating_header_animation.slide_down;

const _Floating_Header = ({bible_passage, text_font_size: font_size, user_settings}) => {
    const {title, description} = bible_passage;
    const transform_style = {
        transform: [{ translateY: floating_header_animation_position }]
    }
    const text_font_size = Math.min(font_size * 2, 60);
    const desc_font_size = Math.min(font_size * 1.2, 40);

    return (
        <Animated.View style={[{
            marginBottom: 0
            , alignSelf: 'stretch'
            , position: 'absolute'
            , top: 0
            , left: 0
            , right: 0
        }, transform_style]}>
            <ImageBackground style={[{backgroundColor: user_settings.background_color || colors.dark_cerulean}]} src={user_settings.background_image}>
                <View style={[{paddingTop: 3 * sizes.default + native_elements.status_bar, paddingHorizontal: sizes.large * 1.5,  backgroundColor: `rgba(0, 0, 0, ${user_settings.background_opacity})`}]}>
                    {Header_Text_Component(text_font_size, 'Durwent', user_font_color(user_settings), title)}
                    {(description.length > 0) && Header_Text_Component(
                        desc_font_size, 
                        undefined, 
                        { marginTop: sizes.default }, 
                        description
                    )}
                </View>
            </ImageBackground>
            
        </Animated.View>
    );
};

const list_header_component = ({bible_passage, text_font_size, user_settings}) => {
    const {title, description} = bible_passage;
    const color_style = user_font_color(user_settings)
    return (
        <View style={{
            paddingHorizontal: sizes.large * 1.5,
            paddingTop: 3 * sizes.default + native_elements.status_bar,
            marginBottom: 0
        }}>
            {Header_Text_Component(text_font_size * 2, 'Durwent', color_style, title)}
            {(description.length > 0) && Header_Text_Component(text_font_size * 1.2, undefined, { marginTop: sizes.default, ...color_style }, description)}
        </View>
    );
};

const bible_key_extractor = (item, index) => `${item.title}-${index}`;

const bible_body_component = ({text_font_size, user_settings}) => ({ item, index }) => {
    const text_component = (
        <Animated_Text font_size={text_font_size} text_align={'justify'}
            style={{ marginTop: sizes.large, paddingHorizontal: sizes.large * 1.5, ...user_font_color(user_settings) }}>
            <Default_Text style={user_font_color(user_settings)} text_align={'justify'} font_size={text_font_size}>{`${index + 1}. `}</Default_Text>
            {text_formatter(text_font_size, item.filter(text => !text.is_footnote), `bible-text`, user_settings)}
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

const Bible_Text_Component = (props) => {
    return (    
        <FlatList data={props.bible_passage.content.slice(1)}
            scrollEventThrottle={300}
            ref={ref => main_view_ref = ref}
            ListHeaderComponent={list_header_component(props)}
            keyExtractor={bible_key_extractor}
            renderItem={bible_body_component(props)}
            scrollEnabled={true}
            onScrollBeginDrag={flatlist_on_scroll_begin(props)}
            onScroll={flatlist_on_scroll(props)}
            contentInsetAdjustmentBehavior={"never"}
            />
    );
};


const library_slide_down_animation = slide_down_animation(500, 12);


const library_container_slide_anim = slide_side_animation(100, 0, Dimensions.get('window').width);

const select_book_action = (dispatch) => (book_index) => () => {
    dispatch(get_bible_chapter_list(book_index));
    library_container_slide_anim.slide();
};


const book_button = (selected_index, select_book_action, {user_settings}) => (book_start_index) => (item, index) => {
    const {width} = Dimensions.get('window');
    const box_width = Math.floor(width / 6);

    const true_index = is_number(book_start_index) ? book_start_index + index : index;

    const tint_color = user_tint_color(user_settings);

    const border_style = (true_index === 18 && is_string(item))
        ? { borderWidth: 2, borderColor: tint_color }
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
        color: (true_index === selected_index) ? (tint_color) : colors.white
    };

    return (
        <TouchableOpacity onPress={select_book_action(true_index)}
            style={[bible_books_button, bible_books_button_dyn, border_style]}
            key={`bible-book-button-${item}-${index}`}>
            <View>
                {Header_Text_Component(font_sizes.large, undefined, text_extra_style, item)}
                <View style={{
                    marginTop: sizes.default,
                    height: 1,
                    width: Math.floor(width / 8),
                    backgroundColor: tint_color
                }} />
            </View>

        </TouchableOpacity>
    );
};


const book_buttons_section_header = (book_button_component_loaded) => ({ section: { title, data, book_start_index } }) => {

    const buttons_component = data.map(book_button_component_loaded(book_start_index));

    return (
        <View style={{ marginTop: sizes.default * 3 }}>
            {Header_Text_Component(font_sizes.x_large, undefined, undefined, title)}
            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                {buttons_component}
            </View>
        </View>
    );
}

const bible_library_key_extractor = (item, index) => `bible-book-button-${item}-${index}`;


const bible_library = (book_list, book_buttons_section_header_loaded) => {
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

const chapter_header = (width, title) => {
    return (
        Header_Text_Component(font_sizes.x_large, undefined, { marginTop: sizes.default * 3, width }, title)
    );
};


const chapter_button = (book_button_loaded) => ({ item, index }) => {
    return book_button_loaded(item, index);
};

const chapter_library = (chapter_header_loaded, book_chapters_array = [], ch_button_loaded) => {
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

const close_library_button = ({ width }, {user_settings}) => {
    const child_component = (
        <Default_Text text_align={'center'}>
            Cancel
        </Default_Text>
    );

    const action = () => {
        library_slide_down_animation.slide();
        setTimeout(() => {
            Navigation.dismissOverlay('Overlay_Wrapper_Bible');
        }, 300);
    }

    return (
        <Rounded_Button user_settings={user_settings} on_press={action} screen_width={width}>
            {child_component}
        </Rounded_Button>
    );
};

const back_to_books_btn = ({ width }, {user_settings}) => {
    const child_component = (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: buttons.small, height: buttons.small }}
                source={require('../../../images/icons/icon-back-arrow.png')} />
            <Default_Text>
                Chapters
            </Default_Text>
        </View>
    );

    return (
        <Rounded_Button user_settings={user_settings} on_press={library_container_slide_anim.slide} screen_width={width}>
            {child_component}
        </Rounded_Button>
    );
};

const _library_bottom_buttons_container = (width) => (close_library_button) => (back_to_books_button) => {
    const library_bottom_container_style = {
        width,
        justifyContent: 'space-around',
        position: 'absolute',
        flexDirection: 'row',
        bottom: sizes.default,
        height: 40,
        marginBottom: sizes.medium
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
    dispatch(get_bible_passage(book_index, chapter_index));
    library_container_slide_anim.slide();
    library_slide_down_animation.slide();
    setTimeout(() => {
        Navigation.dismissOverlay('Overlay_Wrapper_Bible');
    }, 1000);
    main_view_ref && main_view_ref.scrollToOffset({ offset: 0 });

};

const _show_back_to_books_button = () => {
    let should_show = true;

    return (width, dispatch) => ({ value }) => {
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


const on_psalter_and_score_tab_select = ({dispatch, current_book_index, current_chapter_index, psalter_psalm, first_psalter_index_of_each_psalm_obj}) => {
    const current_psalm = current_chapter_index + 1;
    if (current_book_index === 18 && current_psalm !== psalter_psalm) {
        on_psalter_change(dispatch, (first_psalter_index_of_each_psalm_obj)?.[current_psalm])();
    }
};

const swipe_right_action = ({dispatch, per_book_ch_last_index_array, current_book_index, current_chapter_index}) => () => {
    if (current_chapter_index === 0) {
        if (current_book_index === 0) {
            const last_book_index = per_book_ch_last_index_array.length - 1;
            dispatch(get_bible_passage(last_book_index, per_book_ch_last_index_array[last_book_index]));

        } else if (current_book_index > 0) {
            const prev_book_index = current_book_index - 1;
            dispatch(get_bible_passage(prev_book_index, per_book_ch_last_index_array[prev_book_index]));
        }
    } else if (current_chapter_index > 0) {
        dispatch(get_bible_passage(current_book_index, current_chapter_index - 1));
    }
    main_view_ref && main_view_ref.scrollToOffset({ offset: 0 });
};

const swipe_left_action = ({dispatch, per_book_ch_last_index_array, current_book_index, current_chapter_index}) => () => {
    if (current_chapter_index === per_book_ch_last_index_array[current_book_index]) {
        const last_book_index = per_book_ch_last_index_array.length - 1;

        if (current_book_index === last_book_index) {
            dispatch(get_bible_passage(0, 0));
        } else if (current_book_index < last_book_index) {
            const next_book_index = current_book_index + 1;
            dispatch(get_bible_passage(next_book_index, 0));
        }
    } else if (current_chapter_index < per_book_ch_last_index_array[current_book_index]) {
        dispatch(get_bible_passage(current_book_index, current_chapter_index + 1));
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

let libraryBackButtonId;
let bottomTabEventListener;
let is_component_mounted = false;
class Bible_Text extends Component {

    constructor(props) {
        super(props);
        libraryBackButtonId = library_container_slide_anim.animated_value.addListener(show_back_to_books_button(Dimensions.get('window').width, props.dispatch));

    }

    componentDidMount() {
        is_component_mounted = true;
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

        bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
            if (unselectedTabIndex !== 3) return;
            if ([0, 1].some(idx => selectedTabIndex === idx)) {
                on_psalter_and_score_tab_select(this.props)
            }
           
        });
    }

    componentWillUnmount() {
        library_container_slide_anim.animated_value.removeListener(libraryBackButtonId);
        bottomTabEventListener && bottomTabEventListener.remove();
    }

    render() {
        const {
            dispatch
            , book_list
            , bible_passage = {}
            , current_book_index = NaN
            , current_chapter_index = NaN
            , selection_chapter_list = []
            , selection_selected_book_title = ''
            , selection_book_index = NaN
            , bible_should_show_back_to_books_button
            , copy_share_btn_props
            , text_font_size
        } = this.props;

        is_component_mounted && set_navigation_colors(this.props.componentId, this.props.user_settings);

        const statusBarHeight = Navigation.constantsSync().statusBarHeight;

        const library_dynamic_style = {
            paddingTop: statusBarHeight,
            height: Dimensions.get('window').height + statusBarHeight,
            width: Dimensions.get('window').width,
            bottom: Platform.OS === 'android' ? -statusBarHeight : 0,
            transform: [
                { translateY: library_slide_down_animation.animated_value}
            ]
        };

        const library_style = {
            position: 'absolute',
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: zIndex.small,
            alignItems: 'center'
        };

        const book_button_component = book_button(current_book_index, select_book_action(dispatch), this.props);

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

        const chapter_button_component = chapter_button(book_button(selection_chapter_index, select_chapter_action_w_book_index, this.props)(0));

        const chapter_lib_header = chapter_header(Dimensions.get('window').width, selection_selected_book_title);

        const back_to_books_btn_present = bible_should_show_back_to_books_button ? back_to_books_btn(Dimensions.get('window'), this.props) : undefined;

        const [swipe_right_loaded, swipe_left_loaded] = [swipe_right_action, swipe_left_action].map(swipe_action => swipe_action(this.props));

        const set_font_size_wo_font_size = set_font_size(dispatch);

        const set_copy_share_btn_props_loaded = set_copy_share_btn_props(dispatch);

        const LibraryComponent = (
            <Animated.View style={[library_style, library_dynamic_style]}>
                <Animated.View style={bible_library_container_style}>
                    {bible_library(book_list, book_buttons_section_header_loaded)}
                    {chapter_library(chapter_lib_header, selection_chapter_list, chapter_button_component)}
                </Animated.View>

                {library_bottom_buttons_container(close_library_button(Dimensions.get('window'), this.props))(back_to_books_btn_present)}
            </Animated.View>
        );

        Navigation.updateProps('Overlay_Wrapper_Bible', {
            children: LibraryComponent
        })

        const pinch = pinch_text_gesture(on_pinch_text_size(this.props));
        const swipe = swipe_gesture(swipe_left_loaded, swipe_right_loaded);
        const long_press = long_press_gesture(set_copy_share_btn_props_loaded);

        const gestures = Gesture.Race(pinch, swipe, long_press);

        return (
            <Default_Bg user_settings={this.props.user_settings}>
                {is_string(bible_passage.title)
                    ? (
                        <GestureDetector gesture={gestures}>
                            {Bible_Text_Component(this.props)}
                        </GestureDetector>
                    )
                    : <View style={{ flex: 1 }} />
                }

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    height: native_elements.nav_bar_std,
                    paddingHorizontal: sizes.large,
                    paddingVertical: sizes.default / 2
                }}>
                        <Rounded_Button
                            user_settings={this.props.user_settings}
                            on_press={() => {
                                Navigation.showOverlay({
                                    component: {
                                        id: 'Overlay_Wrapper_Bible',
                                        name: 'Overlay_Wrapper',
                                        passProps: {
                                            children: LibraryComponent
                                        }
                                    }
                                });
                                
                                setTimeout(() => {
                                    library_slide_down_animation.slide();
                                }, 50);
                            }} 
                            screen_width={Dimensions.get('window').width}
                        >
                            <Default_Text
                                style={{color: user_tint_color(this.props.user_settings)}}
                                text_align={'center'}
                            >
                                    Select
                            </Default_Text>
                        </Rounded_Button>
                </View>

                {!copy_share_btn_props.isHidden &&
                    (<Copy_Share_Tooltip
                        user_settings={this.props.user_settings}
                        onPress={() => {
                            set_copy_share_btn_props_loaded();
                            Navigation.showModal(show_misc_actions_modal_obj(MISC_ACTION_TEXT_TYPES.BIBLE, this.props.user_settings));
                        }}
                        onCancel={() => {
                            set_copy_share_btn_props_loaded();
                        }}
                        top={copy_share_btn_props.top - 2 * sizes.x_large}
                        left={copy_share_btn_props.left - 50} />)
                }

                <FontSlider value={text_font_size} onSlidingComplete={set_font_size_wo_font_size} user_settings={this.props.user_settings} />

                {is_string(bible_passage.title) &&
                    _Floating_Header(this.props)
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
        , user_settings: state.user_settings
        , copy_share_btn_props: state.copy_share_btn_props
        , scroll_details: state.bible_scroll_details
    };
}

export default connect(mapStateToProps, null)(Bible_Text);
