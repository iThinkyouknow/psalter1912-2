import React, {Component} from 'react';
import {
    Alert
    , View
    , FlatList
    , SectionList
    , PanResponder
    , Animated
    , TextInput
    , Dimensions
    , KeyboardAvoidingView
    , Keyboard
    , Platform
    , TouchableHighlight
    , Image
    , StyleSheet
    , AsyncStorage
    , Slider
} from 'react-native';
import {connect} from 'react-redux';



import styles from './index.styles';
import {colors, sizes, font_sizes, zIndex, native_elements, buttons, is_iPhone_X} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text,
    centered_text,
    bold_centered_text,
    main_title,
    main_title_2,
    sub_title,
    meter_text,
    normal_text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';
import {Rounded_Button} from '../../common/Rounded-Button';
import music_slider from '../../common/music-slider';

import {
    psalter_init,
    lock_in,
    set_sung_count_all,
    set_sung_date
} from '../../redux/actions/psalter-actions';

import {
    psalter_text_input
    , toggle_text_as_valid
    , set_input_as_search
    , set_can_search
    , psalter_text_set_new_font_size
} from '../../redux/actions/state-actions';

import {
    search_psalter
} from '../../redux/actions/search-actions';

import {
    get_bible_passage
} from '../../redux/actions/bible-actions';

import music_player from '../../utils/music-player';
import {is_present_type, no_op, composer} from '../../utils/functions';
import {slide_down_animation, fade_animation, slide_side_animation} from '../../utils/animation';
import {
    string_input_error_alert,
    wrong_number_error_alert,
    not_enough_characters_search_alert
    , perhaps_change_to_psalter_input_alert
} from '../../utils/alert';

import {
    scroll_swipe_actions
    , tap_to_change_font_size
    , touch_release_actions
} from '../../utils/touch-gestures';

import {set_keyboard_toolbar} from '../../utils/keyboard';






const psalter_text_fade_anim = fade_animation(100)(0);

const more_section_slide_animation = slide_down_animation(500)(12);
const more_section_slide_position = more_section_slide_animation.animated_value;
const more_section_slide = more_section_slide_animation.slide;


const header = (fade_anim) => (psalter) => (index) => (font_size) => {

    const {no, title, content, meter, psalm, score_ref, ref} = psalter;

    const fade_in_style = {
        opacity: fade_anim
    };

    return (((index >= 0) &&
        <Animated.View style={[styles.standard_margin_horizontal, styles.main_text_padding_top, fade_in_style]}>
            {is_present_type('number')(no) && main_title(font_size + 18)()({color: colors.gold})(`Psalter ${no}`)}
            {is_present_type('string')(title) && sub_title(font_size + 2)()()(title)}
            {is_present_type('number')(psalm) && sub_title(font_size + 2)()()(`Psalm ${psalm}`)}
            {is_present_type('string')(meter) && meter_text(font_size - 4)()()(`Meter: ${meter}`)}
        </Animated.View>
    ));
};

const psalter_key_extractor = (item, i) => `psalter-text-${i}`;

const render_psalter_text = (fade_anim) => (font_size) => ({item, index}) => {
    const texts = (Array.isArray(item)) ? item.map((line, i) => {
        const line_to_render = (i === 0) ? `${index + 1}. ${line}` : line;
        return normal_text(font_size)(`line-${i}`)()(line_to_render);
    }) : item;

    const fade_in_style = {
        opacity: fade_anim
    };

    return (
        <Animated.View style={[styles.standard_margin_horizontal, styles.main_text_margin_top, fade_in_style]}>
            {texts}
        </Animated.View>
    )
};

export const on_psalter_change = (dispatch) => (next_val) => () => {
    if (!Number.isNaN(next_val)) {
        psalter_text_fade_anim.fade_in();

        setTimeout(() => dispatch(lock_in(next_val)), 10);
        // dispatch(lock_in(next_val));
        set_keyboard_toolbar(true);

        music_player.when_psalter_change(dispatch)(`psalter_${next_val + 1}.mp3`)();
    }
};

const tap_to_change_font_size_action = tap_to_change_font_size();

const set_font_size = (dispatch) => (new_font_size) => {
    composer([
        psalter_text_set_new_font_size,
        dispatch
    ])(new_font_size);
};


const set_text_input_value = (dispatch) => (value) => {
    dispatch(psalter_text_input(value));
};


const input_text_handler = (dispatch) => (is_search) => (max_val) => (value) => {
    const _value = value.trim();

    const value_int = parseInt(_value);
    const last_char_int = parseInt(_value.slice(-1));

    const toggle_text_as_valid_fn = () => dispatch(toggle_text_as_valid(true));

    if (_value !== "" && isNaN(last_char_int)) {
        set_text_input_value(dispatch)(_value.slice(0, -1));
        dispatch(toggle_text_as_valid(false));
        string_input_error_alert(toggle_text_as_valid_fn);

    } else if (value_int > max_val || value_int < 1) {
        set_text_input_value(dispatch)(_value.slice(0, -1));
        dispatch(toggle_text_as_valid(false));
        wrong_number_error_alert(max_val)(toggle_text_as_valid_fn);


    } else if (value_int < 1) {
        set_text_input_value(dispatch)('');
        dispatch(toggle_text_as_valid(false));
        wrong_number_error_alert(max_val)(no_op);

    } else if (_value === "") {
        dispatch(toggle_text_as_valid(false));
        set_text_input_value(dispatch)(_value);

    } else {
        dispatch(toggle_text_as_valid(true));
        set_text_input_value(dispatch)(_value);
    }
};


const end_text_input = (dispatch) => (text_is_valid) => (event) => {

    if (text_is_valid) {
        const input_int = parseInt(event.nativeEvent.text) - 1;
        on_psalter_change(dispatch)(input_int)();
        set_text_input_value(dispatch)('');
    }
};

const num_input_set_can_search = (dispatch) => (can_search) => () => {
    dispatch(set_can_search(can_search));
};

const Number_input = (props) => {

    const keyboard_type = (Platform.OS === 'ios') ? 'number-pad' : 'numeric';
    const {psalters_count, value, dispatch, valid_text_input} = props;

    return (
        <TextInput keyboardType={keyboard_type}
                   placeholder={`Psalter # (1 - ${psalters_count})`}
                   onEndEditing={end_text_input(dispatch)(valid_text_input)}
                   maxLength={`${psalters_count}`.length}
                   onChangeText={input_text_handler(dispatch)(false)(psalters_count)}
                   value={value}
                   autoCorrect={false}
                   underlineColorAndroid={'transparent'}
                   {...props} />
    );
};


const get_random_psalter = (dispatch) => (count) => () => {
    const random = Math.floor(Math.random() * count);
    on_psalter_change(dispatch)(random)();
};

const more_stuff_list_header = () => {
    return (
        <View style={styles.more_stuff_list_header}/>
    );
};


const Bottom_Buttons = (props) => {

    return (
        <View style={styles.more_stuff_bottom_buttons_container}>
            {Rounded_Button(<Default_Text text_align={'center'}>I'm
                Done</Default_Text>)(more_section_slide)(props.width)}
        </View>

    );
};

const more_info_section_key_extractor = (item, index) => `more-info-section-${item.title}-${index}`;

const ref_text_comp = (psalm) => ({v, refs}, i) => {
    return (
        <TouchableHighlight key={`ref-line-${i}`}>
            <View>
                <Default_Text >
                    {`${i + 1}. ${psalm}:${v} - ${refs}`}
                </Default_Text>
            </View>
        </TouchableHighlight>
    );
};

const psalter_refs_section = ({item, index}) => {
    const {title, text_array, psalm} = item;
    if (!Array.isArray(text_array) || text_array.length < 1) return null;

    const texts = Array.isArray(item.text_array)
        ? item.text_array.map(ref_text_comp(psalm))
        : normal_text('default')(`ref-line-${index}`)()(`${psalm} - ${item.text_array}`);

    return (
        <View style={styles.more_info_section_container}>
            {main_title_2(title)}
            <View style={styles.ref_text_container}>
                {texts}
            </View>
        </View>
    );
};

const count_section = ({item, index}) => {
    const {title} = item;

    if (!is_present_type('string')(title)) return null;
    return (
        <View style={styles.more_info_section_container}>
            {main_title_2(item.title)}
        </View>
    );
};

const music_section = (music_slider) => ({item, index}) => {
    if (!Array.isArray(item.sources)) return null;
    if ((typeof item.sources[0] !== 'string') || item.sources[0].length < 1) return null;

    const music_slider_array = item.sources
        .map(music_slider)
        .filter(slider => slider !== null);

    return (music_slider_array.length > 0)
        ? (
            <View >
                {main_title_2(item.title)}
                {music_slider_array}
            </View>
        )
        : null;
};

const More_Stuff_Section_List = (props) => {
    const psalter_music_source = (props.psalter_no !== -1 && props.psalter_no !== 0 && props.psalter_no !== undefined && props.psalter_no !== null)
        ? `psalter_${props.psalter_no}.mp3`
        : ``;

    const sections = [
        {
            data: [
                {
                    title: 'Music',
                    sources: [psalter_music_source],
                }
            ],
            renderItem: music_section(props.music_slider),
            keyExtractor: more_info_section_key_extractor
        }
        , {
            data: [
                {
                    title: is_present_type('number')(props.sung_count) ? `Count: ${props.sung_count}` : ''
                }
            ],
            renderItem: count_section,
            keyExtractor: more_info_section_key_extractor
        }
        , {
            data: [
                {
                    title: 'Cross References',
                    text_array: props.psalter_refs,
                    psalm: props.psalm
                }
            ],
            renderItem: psalter_refs_section,
            keyExtractor: more_info_section_key_extractor
        }
    ];

    const {width, height} = Dimensions.get('window');
    const slide_down_view_dynamic_style = {
        width,
        height,
        bottom: height,
        transform: [
            {
                translateY: props.more_section_slide_position
            }
        ]
    };

    return (
        <Animated.View style={[styles.slide_down_view_style, slide_down_view_dynamic_style]}>
            <SectionList ListHeaderComponent={more_stuff_list_header} style={[styles.more_section_list]}
                         sections={sections}/>
            <Bottom_Buttons width={width} navigator={props.navigator}/>
        </Animated.View>
    );
};

const count_fn = () => {
    let current_no = 0;
    let timeout;

    const add_count = (dispatch) => (Date) => (psalter_no) => (psalter_sung_dates) => {

        if (psalter_no !== null && psalter_no !== undefined && psalter_no !== current_no) {
            if (is_present_type('number')(timeout)) clearTimeout(timeout);
            current_no = psalter_no;
            timeout = setTimeout(() => {
                // add count and set count
                /**
                 * []**/
                const sung_dates_array = [Date.now(), ...psalter_sung_dates];

                AsyncStorage.setItem(`psalter-${psalter_no}`, JSON.stringify(sung_dates_array)).then((err) => {
                    if (!err) {
                        dispatch(set_sung_date(psalter_no)(sung_dates_array));
                    }
                });

                clearTimeout(timeout);
            }, 14 * 1000);
        }
    };

    const clear_timeout = () => {
        clearTimeout(timeout);
    };

    return {
        add_count,
        clear_timeout
    };
};

const counter = count_fn();

const add_count = counter.add_count;


const search_results_animation = slide_side_animation(100)(18)(Dimensions.get('window').width * -1.2);
const slide_right_pos = search_results_animation.animated_value;

const set_text_input_as_search = (dispatch) => (text_input_as_search) => () => {
    if (typeof text_input_as_search !== "boolean") return;
    return dispatch(set_input_as_search(!text_input_as_search));
};

const on_search_button_press = (dispatch) => (navigator) => (text_input_as_search) => (slide_right_pos) => () => {
    // search_results_animation.slide();
    set_text_input_as_search(dispatch)(text_input_as_search)();
    setTimeout(search_results_animation.slide, 100);
    set_keyboard_toolbar(text_input_as_search);
};

const get_psalter_for_search = (dispatch) => (navigator) => (input_int) => () => {
    on_search_button_press(dispatch)(navigator)(true)(slide_right_pos)();
    on_psalter_change(dispatch)(input_int)();
};


const search_fn = (dispatch) => (search_action) => (event) => {
    const text = event.nativeEvent.text.trim();

    if (text.length > 0 && text.length < 3) {
        const used_the_wrong_text_input_regex = /^\d{1,2}$/;

        (used_the_wrong_text_input_regex.test(text))
            ? perhaps_change_to_psalter_input_alert(text)
            : not_enough_characters_search_alert(3);

    } else if (text.length > 2) {
        dispatch(search_action(text));
    }
};


const Text_input_search = (props) => {
    const should_autofocus = !(Array.isArray(props.search_results) && props.search_results.length > 0);
    return (
        <TextInput placeholder={`SEARCH with at least 3 characters`}
                   onEndEditing={search_fn(props.dispatch)(search_psalter)}
                   onChangeText={() => {
                   }}
                   autoCorrect={false}
                   returnKeyType={'search'}
                   selectTextOnFocus={true}
                   autoFocus={should_autofocus}
                   autoCapitalize={'none'}
                   underlineColorAndroid={'transparent'}
                   {...props} />
    );
};

const Search_result_view = (props) => {
    const {width, height} = Dimensions.get('window');

    const statusBarHeight = is_iPhone_X ? native_elements.x_top_safe_area : native_elements.status_bar;
    const bottomPadding = is_iPhone_X ? native_elements.x_bottom_safe_area : 0;

    const search_results_view_dynamic_style = {
        width: width - sizes.large * 2,
        height: height - statusBarHeight - native_elements.tab_bar - 37 - sizes.default * 2 - bottomPadding,
        top: statusBarHeight,
        transform: [
            {
                translateX: slide_right_pos
            }
        ]
    };

    const Search_r_view_header = (props) => {
        const search_results_count = (Array.isArray(props.search_results) && props.search_results.length > 0)
            ? `${props.search_results.length} `
            : '';

        return (
            <View style={{marginTop: sizes.medium}}>
                {main_title_2(`${search_results_count} Search Results`)}
            </View>
        );
    };

    const search_result = (dispatch) => (navigator) => ({item, index}) => {
        const text = item.search_result.map(({text, style}, i) => {
            const key = `search-result-${index}-${i}`;
            const font_weight = (style === 'bold') ? 'bold' : 'normal';
            const color = (style === 'bold')
                ? {
                    color: colors.blue
                }
            : undefined;

            return <Default_Text style={color} key={key} font_weight={font_weight}>{text}</Default_Text>;
        });

        return (
            <TouchableHighlight style={{marginVertical: sizes.large, marginHorizontal: sizes.large}}
                                onPress={get_psalter_for_search(dispatch)(navigator)(item.index)}>
                <View >
                    <Default_Text font_size={font_sizes.large} text_align={'center'}>{item.title}</Default_Text>
                    <Default_Text>
                        {text}
                    </Default_Text>
                </View>
            </TouchableHighlight>
        );
    };

    const search_results_key_extractor = (item, index) => `search-results-${index}`;
    const search_results_separator = (width) => ({highlighter}) => <View
        style={[styles.search_results_separator, {width: Math.floor(width * 0.5)}]}/>;

    return (<Animated.View style={[styles.search_results_view, search_results_view_dynamic_style]}>
        <FlatList ListHeaderComponent={<Search_r_view_header search_results={props.search_results}/>}
                  data={props.search_results}
                  renderItem={search_result(props.dispatch)(props.navigator)}
                  keyExtractor={search_results_key_extractor}
                  ItemSeparatorComponent={search_results_separator(width)}/>

    </Animated.View>)
};

const on_tab_select = (tab_1_action) => (tab_3_action) => (tab_index) => () => {
    if (tab_index === 1) {
        tab_1_action()
    } else if (tab_index === 3) {
        tab_3_action();
    } else if (tab_index !== 0) {
        counter.clear_timeout();
    }

};

const on_bible_tab_select = (dispatch) => (psalm) => () => {
    dispatch(get_bible_passage(18)(psalm - 1));
};

const on_pdf_tab_select = () => {
    set_keyboard_toolbar(true)
};

const on_action = (actions_array) => () => {
    actions_array.map((action) => action());
};

const hide_tabs_action = (navigator) => () => {
    return navigator.toggleTabs({
        to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
        animated: false // does the toggle have transition animation or does it happen immediately (optional)
    });
};



/**
 *
 *
 *
 * **/

class App extends Component {
    constructor(props) {
        super(props);
        console.log('psalter page start');
        const RNShakeEvent = require('react-native-shake-event');
        RNShakeEvent.addEventListener('shake', get_random_psalter(props.dispatch)(props.psalters_count));
        // AsyncStorage.clear();
        const count_all_keys_array = Array.from(new Array(props.psalters_count), (item, index) => `psalter-${index + 1}`);

        AsyncStorage.multiGet(count_all_keys_array).then((arr) => {
            const arr_w_value = arr
                .filter(([key, value]) => is_present_type('string')(value))
                .map(([key, value]) => [key, JSON.parse(value)]);

            props.dispatch(set_sung_count_all(arr_w_value || []));
        });

        set_keyboard_toolbar(true);
        props.dispatch(psalter_init());
    }

    // Keyboard.addListener('keyboardDidShow', keyboard_did_show);
    // Keyboard.addListener('keyboardDidHide', keyboard_did_hide);

    //<KeyboardAvoidingView behavior={'position'}
    //keyboardVerticalOffset={64} >

    render() {

        const {
            dispatch
            , navigator
            , psalter
            , index
            , psalters_count
// , should_display_go_forth_bar
            , can_search
            , psalter_text_input
            , valid_text_input
            , sung_dates
            , sung_dates_all
            , current_music_timer
            , max_music_timer
            , text_input_as_search
            , psalter_search_results
            , tab_bar_selected_index
            , psalter_text_font_size
        } = this.props;

        const on_psalter_change_dispatch = on_psalter_change(dispatch);

        add_count(dispatch)(Date)(psalter.no)(sung_dates);
        //music_player.when_psalter_change(dispatch)(`Psalter-${psalter.no}.mp3`)();
        // set_nav_bar_title(navigator)(psalter.no)();

        const music_slider_w_data = music_slider(dispatch)(current_music_timer)(max_music_timer);

        const on_bible_tab_select_loaded = is_present_type('number')(psalter.psalm)
            ? on_bible_tab_select(dispatch)(psalter.psalm)
            : no_op;

        const tab_actions = [
            on_tab_select(on_pdf_tab_select)(on_bible_tab_select_loaded)
        ];

        const num_input_set_can_search_w_dispatch = num_input_set_can_search(dispatch);

        const num_input_on_blur_actions_array = [
            hide_tabs_action(navigator)
            , num_input_set_can_search_w_dispatch(true)
        ];

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);

        const scroll_swipe_actions_loaded = Platform.OS === 'android'
            ? scroll_swipe_actions(on_psalter_change(dispatch)(index + 1))(on_psalter_change(dispatch)(index - 1))
            : no_op;

        const get_text_input = (text_input_as_search) => {
            if (Platform.OS === 'ios') {
                return (text_input_as_search)
                    ? <Text_input_search dispatch={dispatch}
                                            style={[styles.text_input_style]}
                                            valid_text_input={true}
                                            search_results={psalter_search_results}
                                            onBlur={hide_tabs_action(navigator)}/>

                    : <Number_input psalters_count={psalters_count}
                                    value={psalter_text_input}
                                    dispatch={dispatch}
                                    style={[styles.text_input_style]}
                                    valid_text_input={valid_text_input}
                                    onBlur={on_action(num_input_on_blur_actions_array)}
                                    onFocus={num_input_set_can_search_w_dispatch(false)} />

            } else if (Platform.OS === 'android') {
                return (text_input_as_search)
                    ? <Text_input_search dispatch={dispatch}
                                         style={[styles.text_input_style]}
                                         valid_text_input={true} />

                    : <Number_input psalters_count={psalters_count}
                                    value={psalter_text_input}
                                    dispatch={dispatch}
                                    style={[styles.text_input_style]}
                                    valid_text_input={valid_text_input} />
            }
        };

        const set_font_size_wo_font_size = set_font_size(dispatch);

        const tap_to_change_font_size_action_loaded = tap_to_change_font_size_action(set_font_size_wo_font_size)(psalter_text_font_size || 18)

        const one_third_screen_width = Math.round(Dimensions.get('window').width / 3);

        const [swipe_prev_action, swipe_next_action] = [-1, 1].map((change_by) => on_psalter_change_dispatch(index + change_by));
        const touch_release_actions_loaded = touch_release_actions(swipe_prev_action)(swipe_next_action)(tap_to_change_font_size_action_loaded)(one_third_screen_width)

        const touch_actions = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderRelease: touch_release_actions_loaded
        });

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props}>
                <More_Stuff_Section_List
                    dispatch={dispatch}
                    navigator={navigator}
                    more_section_slide_position={more_section_slide_position}
                    psalter_refs={psalter.ref}
                    psalm={psalter.psalm}
                    psalter_no={psalter.no}
                    sung_count={is_present_type('array')(sung_dates) ? sung_dates.length : NaN}
                    music_slider={music_slider_w_data}/>

                <Search_result_view search_results={psalter_search_results}
                                    dispatch={dispatch}
                                    navigator={navigator}/>

                <FlatList data={psalter.content}
                          ListHeaderComponent={header(psalter_text_fade_anim.fade_opacity)(psalter)(index)(psalter_text_font_size)}
                          renderItem={render_psalter_text(psalter_text_fade_anim.fade_opacity)(psalter_text_font_size)}
                          keyExtractor={psalter_key_extractor}
                          onScrollEndDrag={scroll_swipe_actions_loaded}
                          {...touch_actions.panHandlers}  />

                <View style={{
                    bottom: 0,
                    zIndex: zIndex.small,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: sizes.large,
                    paddingVertical: sizes.default,
                }}>

                    {get_text_input(text_input_as_search)}

                    <TouchableHighlight style={styles.bottom_button_container}
                                        onPress={on_search_button_press(dispatch)(navigator)(text_input_as_search)(slide_right_pos)}
                                        underlayColor={colors.dark_cerulean}
                                        disabled={!can_search}>
                        {(can_search)
                            ? <Image style={styles.button_std}
                                     source={require('../../../images/icons/icon-search.png')}/>

                            : <Image style={styles.button_std}
                                     source={require('../../../images/icons/icon-search-grey.png')}/>
                        }
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.bottom_button_container}
                                        onPress={more_section_slide}
                                        underlayColor={colors.dark_cerulean}>
                        <Image style={styles.button_std} source={require('../../../images/icons/icon-info.png')}/>

                    </TouchableHighlight>
                </View>
            </Default_Bg>
        );
    }
}
;

function mapStateToProps(state) {
    return {
        psalter: state.psalter.content
        , index: state.psalter.index
        , psalters_count: state.psalter.psalters_count
        // state reducer
        , can_search: state.psalter_can_search
        , psalter_text_input: state.psalter_text_input
        , valid_text_input: state.valid_text_input
        , sung_dates: state.psalter.current_sung_dates
        , sung_dates_all: state.psalter.all_sung_dates
        , current_music_timer: state.music_timer.current
        , max_music_timer: state.music_timer.max
        , text_input_as_search: state.text_input_as_search
        , psalter_text_font_size: state.psalter_text_font_size
        //search reducer
        , psalter_search_results: state.psalter_search_results
        // tab reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}


export default connect(mapStateToProps, null)(App);