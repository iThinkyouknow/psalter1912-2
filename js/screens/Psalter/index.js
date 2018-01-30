import React, { Component } from 'react';
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
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import KeyboardManager from 'react-native-keyboard-manager'
import RNShakeEvent from 'react-native-shake-event';

import styles from './index.styles';
import {colors, sizes} from '../../common/common.styles';

import {Default_Text, Animated_Text} from '../../common/Text';
import Default_bg from '../../common/Default-bg';

import {
    lock_in,
    set_sung_count_all,
    get_sung_count,
    set_sung_count
} from '../../redux/actions/psalter-actions';
import {
    psalter_text_input,
    toggle_text_as_valid
} from '../../redux/actions/state-actions';

const fade_w_cache = () => {
    let prev_index;
    const fade_opacity = (curr_index) => {
        if (curr_index !== prev_index) {
            const fadeAnim =  new Animated.Value(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500
            }).start();
            prev_index = curr_index;
            return fadeAnim;
        }
    };

    return fade_opacity;
};

const get_fade_opacity = fade_w_cache();

const slide_position = new Animated.Value(0);

const slide = (should_slide_down) => (slide_position) => () => {
    const {height, width} = Dimensions.get('window');

    Animated.timing(slide_position, {
        toValue: (should_slide_down) ? (height + 49) : 0,
        duration: 500,
        useNativeDriver: true
    }).start();
};

const toggle_tab_nav_bar = (navigator) => (should_show) => () => {
    navigator.setStyle({
        tabBarHidden: !should_show,
        navBarHidden: !should_show

    });
};

const on_navigator_event = (navigator) => (event) => { // this is the onPress handler for the two buttons together
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
        if (event.id === 'more-stuff') { // this is the same id field from the static navigatorButtons definition
            slide(true)(slide_position)();
            toggle_tab_nav_bar(navigator)(false)();
        }
    }
};

const composable_anim_text = (text_align) => (font_weight) => (font_size) => (line_height) => (key) => (style) => (opacity) => (children) =>  {

    return (
        <Animated_Text text_align={text_align}
                       font_weight={font_weight}
                       font_size={font_size}
                       line_height={line_height}
                       key={key}
                       opacity={opacity}
                       style={style}>
            {children}
        </Animated_Text>
    );
};

const centered_text = composable_anim_text('center');
const bold_centered_text = centered_text('bold');
const main_title = bold_centered_text('x_large')()()();
const sub_title = bold_centered_text('large')()()();
const meter_text = centered_text()('x_small')()()();
const normal_text = centered_text('normal')('default')(1.3);

const header = (fade_anim) => (psalter) => (index) => {

    const {no, title, content, meter, psalm, score_ref, ref} = psalter;

    return (((index >= 0) &&
        <View style={[styles.standard_margin_horizontal, styles.main_text_margin_top]}>
            {main_title(fade_anim)(`Psalter ${no}`)}
            {sub_title(fade_anim)(title)}
            {sub_title(fade_anim)(`Psalm ${psalm}`)}
            {meter_text(fade_anim)(`Meter: ${meter}`)}
        </View>
    ));
};

const render_item = (fade_anim) => ({item, index}) => {
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

const swipe_action = (dispatch) => (index) => (e, gestureState) => {

    if (gestureState.dy !== 0) return;
    if (gestureState.dx < 0) {
        dispatch(lock_in(index + 1));
    } else if (gestureState.dx > 0) {
        dispatch(lock_in(index - 1));
    }
};

const panResponder = (dispatch) => (index) => PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderRelease: swipe_action(dispatch)(index)
});

const string_input_error_alert = () => {
    const emojis = [`😳`, `🤔`, `😖`, `😑`, `😩`];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    Alert.alert(
        `Are you sure about this? ${emoji}`,
        `Ummm... I don't think you wanna be keying in "four hundred and five" \
                How about keying in numbers instead?`,
        [
            {
                text: `Yea, you are right... 😳`,
                onPress: () => {}, style: 'cancel'
            }
        ],
        { cancelable: true }
    )
};

const set_text_input_value = (dispatch) => (value) => {
    dispatch(psalter_text_input(value));
};


const wrong_number_error_alert = (max_val) => {
    Alert.alert(
        `Psalter Not Available`,
        `Come On! \ 
            Don't you know that there are only Psalters 1 - ${max_val} available? \
            Apologize Now! 😡`,
        [
            {
                text: `I'm Sorry! 😳`,
                onPress: () => {}, style: 'cancel'
            }
        ],
        { cancelable: true }
    )
};

const input_text_handler = (dispatch) => (is_search) => (max_val) => (value) => {
    const _value = value.trim();

    const value_int = parseInt(_value);
    const last_char_int = parseInt(_value.slice(-1));

    if (_value !== "" && isNaN(last_char_int)) {
        set_text_input_value(dispatch)(_value.slice(0, -1));
        dispatch(toggle_text_as_valid(false));
        string_input_error_alert();

    } else if (value_int > max_val || value_int < 1) {
        set_text_input_value(dispatch)(_value.slice(0, -1));
        dispatch(toggle_text_as_valid(false));
        wrong_number_error_alert(max_val);
        setTimeout(() => {
            dispatch(toggle_text_as_valid(true));
        }, 200);

    } else if (value_int < 1) {
        set_text_input_value(dispatch)('');
        dispatch(toggle_text_as_valid(false));
        wrong_number_error_alert(max_val);

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
        dispatch(lock_in(input_int));
        set_text_input_value(dispatch)('');
    }
};


const Text_input = (props) => {
    const {width, height} = Dimensions.get('window');

    const text_input_width = {
        width: width - sizes.x_large * 2,
    };

    const keyboard_type = (Platform.OS === 'ios') ? 'number-pad' : 'numeric';
    const {psalters_count, value, dispatch, valid_text_input} = props;

    return (
        <TextInput keyboardType={keyboard_type}
                   placeholder={`Psalter # (1 - ${psalters_count})`}
                   onEndEditing={end_text_input(dispatch)(valid_text_input)}
                   maxLength={`${psalters_count}`.length}
                   onChangeText={input_text_handler(dispatch)(false)(psalters_count)}
                   value={value}
                   style={[styles.text_input_style, text_input_width, props.style]}
                   autoCorrect={false}
                   {...props} />
    );
};


const shake = (dispatch) => (count) => () => {
    const random = Math.floor(Math.random() * count);
    dispatch(lock_in(random));
};

KeyboardManager.setToolbarDoneBarButtonItemText("Go Forth!");
KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
KeyboardManager.setShouldShowTextFieldPlaceholder(false);

const keyExtractor = (item, i) => i;

const List_Header = (props) => {
    const slide_up_action = () => {
        slide(false)(slide_position)();
        setTimeout(() => {
            toggle_tab_nav_bar(props.navigator)(true)();
        }, 300);
    };

    return (
        <View style={styles.more_stuff_header_style}>

            <TouchableHighlight style={styles.cancel_more_stuff_menu_cross_style} onPress={slide_up_action}>
                <Image style={{width: 32, height:32}} source={require('../../../images/icons/icon-cancel-50.png')} />
            </TouchableHighlight>
        </View>

    );
};

const More_Stuff_Section_List = (props) => {

    const keyExtractor = (item, index) => `more-info-section-${item.title}-${index}`;

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
        if (!text_array) return null;

        const texts = Array.isArray(item.text_array)
            ? item.text_array.map(ref_text_comp(psalm))
            : normal_text(`ref-line-${index}`)()(1)(`${psalm} - ${item.text_array}`);

        return (
            <View>
                {main_title(1)(item.title)}
                <View style={styles.ref_text_container}>
                    {texts}
                </View>
            </View>
        );

    };
    const count_section = ({item, index}) => {
        const {title} = item;
        if (typeof title !== 'string' || (typeof title === 'string' && title.length < 1)) return null;
        return (
            <View style={styles.more_info_section_container}>
                {main_title(1)(item.title)}
            </View>
        );
    };

    const sections = [
        {
            data: [
                {
                    title: 'Cross References',
                    text_array: props.psalter_refs,
                    psalm: props.psalm
                }
            ],
            renderItem: psalter_refs_section,
            keyExtractor: keyExtractor
        },
        {
            data: [
                {
                    title: (props.sung_count !== undefined && props.sung_count !== null) ? `Count: ${props.sung_count}` : ''
                }
            ],
            renderItem: count_section,
            keyExtractor: keyExtractor
        }
    ];

    const {width, height} = Dimensions.get('window');
    const slide_down_view_dynamic_style = {
        width,
        height,
        bottom: height,
        transform: [
            {
                translateY: props.slide_position
            }
        ]
    };

    return (
        <Animated.View style={[styles.slide_down_view_style, slide_down_view_dynamic_style]}>
            <List_Header navigator={props.navigator} />
            <SectionList sections={sections}

                                    />
        </Animated.View>

    );
};


const count_fn = () => {
    let current_no = 0;
    let timeout;

    return add_count = (dispatch) => (psalter_no) => (current_count) => {
        if (psalter_no !== null && psalter_no !== undefined && psalter_no !== current_no) {
            if (!isNaN(timeout)) clearTimeout(timeout);
            current_no = psalter_no;
            timeout = setTimeout(() => {
                // add count and set count
                AsyncStorage.setItem(`psalter-${psalter_no}`, `${current_count + 1}`).then((err) => {
                    if (!err) {
                        dispatch(set_sung_count(psalter_no));
                    }
                });

                clearTimeout(timeout);
            }, 14 * 1000);
        }
    };
};

const add_count = count_fn();



class App extends Component {
    constructor(props) {
        super(props);
        RNShakeEvent.addEventListener('shake', shake(props.dispatch)(props.psalters_count));
        props.navigator.setOnNavigatorEvent(on_navigator_event(props.navigator));
        const count_all_keys_array = Array.from(Array(props.psalters_count).keys()).map((item) => `psalter-${item + 1}`);
        AsyncStorage.multiGet(count_all_keys_array).then((arr) => {
            const arr_w_value = arr.filter(([key, value]) => (value !== undefined && value !== null));
            props.dispatch(set_sung_count_all(arr_w_value || []));
        });
    }

    componentDidMount() {
        AsyncStorage.getAllKeys((err, keys) => {
            keys;
        });
    }

    static navigatorStyle = {
        navBarTransparent: true,
        navBarTextColor: colors.white,
        drawUnderNavBar: true,
        navBarBackgroundColor: colors.ocean,
        screenBackgroundColor: colors.ocean,
        statusBarTextColorSchemeSingleScreen: 'light'
    }

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../images/icons/icon-info-32.png'),
                id: 'more-stuff'
            }
        ]
    }




    // Keyboard.addListener('keyboardDidShow', keyboard_did_show);
    // Keyboard.addListener('keyboardDidHide', keyboard_did_hide);

    //<KeyboardAvoidingView behavior={'position'}
    //keyboardVerticalOffset={64} >



    render() {

        const fade_opacity = get_fade_opacity(this.props.index);
        add_count(this.props.dispatch)(this.props.psalter.no)(this.props.sung_count);
        //this.props.dispatch(get_sung_count(this.props.psalter.no));
        return (
            <Default_bg>
                <More_Stuff_Section_List navigator={this.props.navigator} slide_position={slide_position} psalter_refs={this.props.psalter.ref} psalm={this.props.psalter.psalm} sung_count={this.props.sung_count} />
                <FlatList data={this.props.psalter.content}
                          ListHeaderComponent={header(fade_opacity)(this.props.psalter)(this.props.index)}
                          renderItem={render_item(fade_opacity)}
                          keyExtractor={keyExtractor}
                          style={styles.psalter_text_flat_list}
                          {...panResponder(this.props.dispatch)(this.props.index).panHandlers} />

                <Text_input psalters_count={this.props.psalters_count}
                            value={this.props.psalter_text_input}
                            dispatch={this.props.dispatch}
                            valid_text_input={this.props.valid_text_input} />
            </Default_bg>
        );
    }
};

function mapStateToProps(state) {
    return {
        psalter: state.psalter.content,
        index: state.psalter.index,
        psalters_count: state.psalters_count,
        should_display_go_forth_bar: state.should_display_go_forth_bar,
        psalter_text_input: state.psalter_text_input,
        valid_text_input: state.valid_text_input,
        sung_count: state.psalter.current_sung_count,
        sung_count_all: state.psalter.all_sung_count
    };
}


export default connect(mapStateToProps, null)(App);