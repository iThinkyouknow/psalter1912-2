import React, {Component} from 'react';
import {
    Alert,
    View,
    FlatList,
    SectionList,
    PanResponder,
    Animated,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    TouchableHighlight,
    Image,
    StyleSheet,
    AsyncStorage,
    Slider
} from 'react-native';
import {connect} from 'react-redux';
import KeyboardManager from 'react-native-keyboard-manager'
import RNShakeEvent from 'react-native-shake-event';

import styles from './index.styles';
import {colors, sizes, font_sizes, zIndex, native_elements, buttons} from '../../common/common.styles';

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
import {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';


import {
    lock_in,
    set_sung_count_all,
    set_sung_date
} from '../../redux/actions/psalter-actions';
import {
    psalter_text_input,
    toggle_text_as_valid,
    set_input_as_search
} from '../../redux/actions/state-actions';
import {
    search_psalter
} from '../../redux/actions/search-actions';


import music_player from '../../utils/music-player';
import {is_present_type, no_op} from '../../utils/functions';
import {slide_down_animation, fade_animation, slide_side_animation} from '../../utils/animation';
import {
    string_input_error_alert,
    wrong_number_error_alert,
    not_enough_characters_search_alert
} from '../../utils/alert';



import music_slider from '../../common/music-slider';


const psalter_text_fade_anim = fade_animation(500)(0);

const more_section_slide_animation = slide_down_animation(500)(12);
const more_section_slide_position  = more_section_slide_animation.animated_value;
const more_section_slide           = more_section_slide_animation.slide;

const set_nav_bar_title = (navigator) => (psalter_no) => () => {
    const invalid_psalter = (psalter_no === undefined || psalter_no === null || isNaN(parseInt(psalter_no)));
    navigator.setTitle({
        title: invalid_psalter ? `Psalter` : `Psalter ${psalter_no}`
    });
};





const header = (fade_anim) => (psalter) => (index) => {

    const {no, title, content, meter, psalm, score_ref, ref} = psalter;

    return (((index >= 0) &&
        <View style={[styles.standard_margin_horizontal, styles.main_text_padding_top]}>
            {is_present_type('number')(no) && main_title(fade_anim)(`Psalter ${no}`)}
            {is_present_type('string')(title) && sub_title(fade_anim)(title)}
            {is_present_type('number')(psalm) && sub_title(fade_anim)(`Psalm ${psalm}`)}
            {is_present_type('string')(meter) && meter_text(fade_anim)(`Meter: ${meter}`)}
        </View>
    ));
};

const psalter_key_extractor = (item, i) => `psalter-text-${i}`;

const render_psalter_text = (fade_anim) => ({item, index}) => {
    const texts = (Array.isArray(item)) ? item.map((line, i) => {
        const line_to_render = (i === 0) ? `${index + 1}. ${line}` : line;
        return normal_text(`line-${i}`)()(fade_anim)(line_to_render);
    }) : item;

    return (
        <View style={[styles.standard_margin_horizontal, styles.main_text_margin_top]}>
            {texts}
        </View>
    )
};

const on_psalter_change = (dispatch) => (next_val) => () => {
    dispatch(lock_in(next_val));
    psalter_text_fade_anim.fade_in();
    set_keyboard_style(true);
    music_player.when_psalter_change(dispatch)(`Psalter-${next_val + 1}.mp3`)();
};

const swipe_action = (dispatch) => (index) => (e, gestureState) => {
    // insert fade animation here
    const change_psalter = on_psalter_change(dispatch);
    if (Math.abs(gestureState.dy) > 10) return;
    if (gestureState.dx < 0) {
        change_psalter(index + 1)();
    } else if (gestureState.dx > 0) {
        change_psalter(index - 1)();
    }
};


const panResponder = (dispatch) => (index) => PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderRelease: swipe_action(dispatch)(index)
});


const set_text_input_value = (dispatch) => (value) => {
    dispatch(psalter_text_input(value));
};


const input_text_handler = (dispatch) => (is_search) => (max_val) => (value) => {
    const _value = value.trim();

    const value_int     = parseInt(_value);
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
                   {...props} />
    );
};


const get_random_psalter = (dispatch) => (count) => () => {
    const random = Math.floor(Math.random() * count);
    on_psalter_change(dispatch)(random)();
};

const set_keyboard_style = (is_psalter_input) => {

    if (is_psalter_input) {
        KeyboardManager.setEnableAutoToolbar(true);
        KeyboardManager.setToolbarDoneBarButtonItemText("Go Forth!");
        KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
        KeyboardManager.setShouldShowTextFieldPlaceholder(false);

    } else {
        KeyboardManager.setEnableAutoToolbar(false);
    }
};


const List_Header = () => {
    return (
        <View style={styles.more_stuff_header_style}>

            <TouchableHighlight style={styles.cancel_more_stuff_menu_cross_style} onPress={more_section_slide}>
                <Image style={styles.button_std} source={require('../../../images/icons/icon-cancel-50.png')}/>
            </TouchableHighlight>
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
        : normal_text(`ref-line-${index}`)()(1)(`${psalm} - ${item.text_array}`);

    return (
        <View style={styles.more_info_section_container}>
            {main_title_2(1)(title)}
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
            {main_title_2(1)(item.title)}
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
            {main_title_2(1)(item.title)}
            {music_slider_array}
        </View>
    )
        : null;
};

const More_Stuff_Section_List = (props) => {

    const psalter_music_source = (props.psalter_no !== -1 && props.psalter_no !== 0 && props.psalter_no !== undefined && props.psalter_no !== null)
        ? `Psalter-${props.psalter_no}.mp3`
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
        },
        {
            data: [
                {
                    title: 'Cross References',
                    text_array: props.psalter_refs,
                    psalm: props.psalm
                }
            ],
            renderItem: psalter_refs_section,
            keyExtractor: more_info_section_key_extractor
        },
        {
            data: [
                {
                    title: is_present_type('number')(props.sung_count) ? `Count: ${props.sung_count}` : ''
                }
            ],
            renderItem: count_section,
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
            <List_Header navigator={props.navigator}/>
            <SectionList style={[styles.more_section_list]} sections={sections}/>
        </Animated.View>
    );
};

const count_fn = () => {
    let current_no = 0;
    let timeout;

    return add_count = (dispatch) => (Date) => (psalter_no) => (psalter_sung_dates) => {
        if (psalter_no !== null && psalter_no !== undefined && psalter_no !== current_no) {
            if (!isNaN(timeout)) clearTimeout(timeout);
            current_no = psalter_no;
            timeout    = setTimeout(() => {
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
};

const add_count = count_fn();


const search_results_animation = slide_side_animation(100)(18)(Dimensions.get('window').width * -1.2);
const slide_right_pos          = search_results_animation.animated_value;

const set_text_input_as_search = (dispatch) => (text_input_as_search) => () => {
    if (typeof text_input_as_search !== "boolean") return;
    dispatch(set_input_as_search(!text_input_as_search));
};

const on_search_button_press = (dispatch) => (navigator) => (text_input_as_search) => (slide_right_pos) => () => {
    set_text_input_as_search(dispatch)(text_input_as_search)();
    search_results_animation.slide();
    set_keyboard_style(text_input_as_search);

};

const get_psalter_for_search = (dispatch) => (navigator) => (input_int) => () => {
    on_search_button_press(dispatch)(navigator)(true)(slide_right_pos)();
    on_psalter_change(dispatch)(input_int)();
};


const search_fn = (dispatch) => (search_action) => (event) => {
    const text = event.nativeEvent.text.trim();

    if (text.length < 3) {
        not_enough_characters_search_alert(3);
    } else {
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
                   {...props} />
    );
};

const Search_result_view = (props) => {
    const {width, height}                   = Dimensions.get('window');
    const search_results_view_dynamic_style = {
        width: width - sizes.large * 2,
        height: height - native_elements.status_bar - native_elements.tab_bar - sizes.default * 2 - 37,
        top: native_elements.status_bar,
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
                {main_title_2(1)(`${search_results_count} Search Results`)}
            </View>
        );
    };

    const search_result = (dispatch) => (navigator) => ({item, index}) => {
        const text = item.search_result.map(({text, style}, i) => {
            const key         = `search-result-${index}-${i}`;
            const font_weight = (style === 'bold') ? 'bold' : 'normal';
            const color       = (style === 'bold') ? {
                color: colors.blue
            } : undefined;
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
    const search_results_separator     = (width) => ({highlighter}) => <View
        style={[styles.search_results_separator, {width: Math.floor(width * 0.5)}]}/>;

    return (<Animated.View style={[styles.search_results_view, search_results_view_dynamic_style]}>
        <FlatList ListHeaderComponent={<Search_r_view_header search_results={props.search_results}/>}
                  data={props.search_results}
                  renderItem={search_result(props.dispatch)(props.navigator)}
                  keyExtractor={search_results_key_extractor}
                  ItemSeparatorComponent={search_results_separator(width)}/>

    </Animated.View>)
}



/**
 *
 *
 *
 * **/

class App extends Component {
    constructor(props) {
        super(props);
        RNShakeEvent.addEventListener('shake', get_random_psalter(props.dispatch)(props.psalters_count));
        // AsyncStorage.clear();
        const count_all_keys_array = Array.from(new Array(props.psalters_count), (item, index) => `psalter-${index + 1}`);

        AsyncStorage.multiGet(count_all_keys_array).then((arr) => {
            const arr_w_value = arr
                .filter(([key, value]) => is_present_type('string')(value))
                .map(([key, value]) => [key, JSON.parse(value)]);
            props.dispatch(set_sung_count_all(arr_w_value || []));
        });

        set_keyboard_style(true);
    }




    // Keyboard.addListener('keyboardDidShow', keyboard_did_show);
    // Keyboard.addListener('keyboardDidHide', keyboard_did_hide);

    //<KeyboardAvoidingView behavior={'position'}
    //keyboardVerticalOffset={64} >


    render() {
        add_count(this.props.dispatch)(Date)(this.props.psalter.no)(this.props.sung_dates);
        //music_player.when_psalter_change(this.props.dispatch)(`Psalter-${this.props.psalter.no}.mp3`)();
        set_nav_bar_title(this.props.navigator)(this.props.psalter.no)();

        const music_slider_w_data = music_slider(this.props.dispatch)(this.props.current_music_timer)(this.props.max_music_timer);


        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}>
                <More_Stuff_Section_List
                    dispatch={this.props.dispatch}
                    navigator={this.props.navigator}
                    more_section_slide_position={more_section_slide_position}
                    psalter_refs={this.props.psalter.ref}
                    psalm={this.props.psalter.psalm}
                    psalter_no={this.props.psalter.no}
                    sung_count={is_present_type('array')(this.props.sung_dates) ? this.props.sung_dates.length : NaN}
                    music_slider={music_slider_w_data}/>

                <Search_result_view search_results={this.props.psalter_search_results}
                                    dispatch={this.props.dispatch}
                                    navigator={this.props.navigator}/>

                <FlatList data={this.props.psalter.content}
                          ListHeaderComponent={header(psalter_text_fade_anim.fade_opacity)(this.props.psalter)(this.props.index)}
                          renderItem={render_psalter_text(psalter_text_fade_anim.fade_opacity)}
                          keyExtractor={psalter_key_extractor}
                          {...panResponder(this.props.dispatch)(this.props.index).panHandlers}  />

                <View style={{

                    bottom: 0,
                    zIndex: zIndex.small,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: sizes.large,
                    paddingVertical: sizes.default,
                }}>
                    {!this.props.text_input_as_search &&
                    <Number_input psalters_count={this.props.psalters_count}
                                  value={this.props.psalter_text_input}
                                  dispatch={this.props.dispatch}
                                  style={[styles.text_input_style]}
                                  valid_text_input={this.props.valid_text_input}/>
                    }
                    {this.props.text_input_as_search &&
                    <Text_input_search dispatch={this.props.dispatch}
                                       style={[styles.text_input_style]}
                                       valid_text_input={true}
                                       search_results={this.props.psalter_search_results}/>
                    }

                    <TouchableHighlight style={styles.search_button_container}
                                        onPress={on_search_button_press(this.props.dispatch)(this.props.navigator)(this.props.text_input_as_search)(slide_right_pos)}
                                        underlayColor={colors.dark_cerulean} >
                        <Image style={styles.button_std} source={require('../../../images/icons/icon-search.png')}/>

                    </TouchableHighlight>

                    <TouchableHighlight style={styles.search_button_container}
                                        onPress={more_section_slide}
                                        underlayColor={colors.dark_cerulean} >
                        <Image style={styles.button_std} source={require('../../../images/icons/icon-info.png')}/>

                    </TouchableHighlight>
                </View>


            </Default_Bg_w_Tab_Bar>
        );
    }
}
;

function mapStateToProps(state) {
    return {
        psalter: state.psalter.content
        , index: state.psalter.index
        , psalters_count: state.psalters_count
        , should_display_go_forth_bar: state.should_display_go_forth_bar
        , psalter_text_input: state.psalter_text_input
        , valid_text_input: state.valid_text_input
        , sung_dates: state.psalter.current_sung_dates
        , sung_dates_all: state.psalter.all_sung_dates
        , current_music_timer: state.music_timer.current
        , max_music_timer: state.music_timer.max
        , text_input_as_search: state.text_input_as_search
        , psalter_search_results: state.psalter_search_results
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}


export default connect(mapStateToProps, null)(App);
