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
    Image
} from 'react-native';
import { connect } from 'react-redux';
import KeyboardManager from 'react-native-keyboard-manager'
import RNShakeEvent from 'react-native-shake-event';

import styles from './index.styles';
import {colors, sizes} from '../../common/common.styles';

import {Default_Text, Animated_Text} from '../../common/Text';
import Default_bg from '../../common/Default-bg';

import {lock_in} from '../../redux/actions/psalter-actions';
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
        navBarHidden: !should_show,
        tabBarHidden: !should_show
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
        return centered_text('normal')('default')(1.3)(`line-${i}`)()(fade_anim)(line_to_render);
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
    const add_style = {
        position: 'absolute',
        bottom: 0,
        zIndex: 100,
        marginHorizontal: 16,
        marginRight: 32,
        marginVertical: 8,
        padding: 8,
        lineHeight: 21,
        width: width - 64,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: 'white'
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
                   style={add_style}
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

const More_Stuff_Section_List = (props) => {
    const {width, height} = Dimensions.get('window');
    const slide_down_view_style = {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        bottom: height,
        left: 0,
        zIndex: 99999999,
        transform: [
            {
                translateY: props.slide_position
            }
        ]
    };

    const List_Header = (props) => {
        const slide_up_action = () => {
            slide(false)(slide_position)();
            setTimeout(() => {
                toggle_tab_nav_bar(props.navigator)(true)();
            }, 300);
        };

        const style = {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            // backgroundColor: 'red'
        }

        const cross_style = {
            position: 'absolute',
            top: 16,
            right: 0,
            height: 64,
            width: 64,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red'
        };

        return (
            <View style={style}>
                <Default_Text  font_size={32}>Settings</Default_Text>
                <TouchableHighlight style={cross_style} onPress={slide_up_action}>
                    <Image style={{width: 32, height:32}} source={require('../../../images/icons/icon-cancel-50.png')} />
                </TouchableHighlight>
            </View>

        );
    }



    const Animated_Section_List = Animated.createAnimatedComponent(SectionList);
    const keyExtractor = (item, index) => `more-info-section-${index}`;

    const sections = [
        {
            data: [''],
            renderItem: ({item, index}) => <Default_Text key={`more-stuff-item-${index}`}>Bye</Default_Text>,
            keyExtractor: keyExtractor
        }
    ];

    return (
        <Animated_Section_List sections={sections}
                               ListHeaderComponent={<List_Header navigator={props.navigator} />}
                               style={slide_down_view_style} />
    );
};






class App extends Component {
    constructor(props) {
        super(props);
        RNShakeEvent.addEventListener('shake', shake(props.dispatch)(props.psalters_count));
        props.navigator.setOnNavigatorEvent(on_navigator_event(props.navigator));
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


        return (
            <Default_bg>
                <More_Stuff_Section_List navigator={this.props.navigator} slide_position={slide_position} />
                <FlatList data={this.props.psalter.content}
                          ListHeaderComponent={header(fade_opacity)(this.props.psalter)(this.props.index)}
                          renderItem={render_item(fade_opacity)}
                          keyExtractor={keyExtractor}
                          style={{marginBottom: 50}}
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
        valid_text_input: state.valid_text_input
    };
}


export default connect(mapStateToProps, null)(App);