import React, { Component } from 'react';
import {
    Alert,
    View,
    FlatList,
    PanResponder,
    Animated,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import KeyboardManager from 'react-native-keyboard-manager'

import styles from './index.styles';
import {colors, sizes} from '../../common/common.styles';

import {Default_Text, Animated_Text} from '../../common/Text';
import Default_bg from '../../common/Default-bg';

import {swipe} from '../../redux/actions/psalter-actions';
import {psalter_text_input} from '../../redux/actions/state-actions';



const fadeAnim = new Animated.Value(0);

const fade = () => {
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000
    }).start();
};

const composable_anim_text = (text_align) => (opacity) => (font_weight) => (font_size) => (line_height) => (key) => (style) => (children) => {

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

const centered_text = composable_anim_text('center')(fadeAnim);
const bold_centered_text = centered_text('bold');
const main_title = bold_centered_text('x_large')()()();
const sub_title = bold_centered_text('large')()()();
const meter_text = centered_text()('x_small')()()();

const header = (psalter) => (index) => {

    const {no, title, content, meter, psalm, score_ref, ref} = psalter;

    return (((index >= 0) &&
        <View style={[styles.standard_margin_horizontal, styles.main_text_margin_top]}>
            {main_title(`Psalter ${no}`)}
            {sub_title(title)}
            {sub_title(`Psalm ${psalm}`)}
            {meter_text(`Meter: ${meter}`)}
        </View>
    ));
};

const render_item = ({item, index}) => {
    const texts = (Array.isArray(item)) ? item.map((line, i) => {
        const line_to_render = (i === 0) ? `${index + 1}. ${line}` : line;
        return centered_text('normal')('default')(1.3)(`line-${i}`)()(line_to_render);
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
        dispatch(swipe(index + 1));
    } else if (gestureState.dx > 0) {
        dispatch(swipe(index - 1));
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
    set_text_input_value(dispatch)(_value);

    const value_int = parseInt(_value);
    if (_value !== "" && isNaN(value_int)) {
        string_input_error_alert();
    } else if (value_int > max_val || value_int < 1) {
        set_text_input_value(dispatch)('434');

        wrong_number_error_alert(max_val);
    }
};

const submit_text_input = (x, y) => {
    x;
};

const Text_input = (props) => {
    const {width, height} = Dimensions.get('window');
    const add_style = {
        position: 'absolute',
        bottom: 0,
        zIndex: 9999,
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
    const {psalters_count, value, dispatch} = props;

    return (
        <TextInput keyboardType={keyboard_type}
                   placeholder={`Psalter # (1 - ${psalters_count})`}
                   onEndEditing={submit_text_input}
                   maxLength={`${psalters_count}`.length}
                   onChangeText={input_text_handler(dispatch)(false)(psalters_count)}
                   value={value}
                   style={add_style} />
    );
};

KeyboardManager.setToolbarDoneBarButtonItemText("Go Forth!");
KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
KeyboardManager.setShouldShowTextFieldPlaceholder(false);

const keyExtractor = (item, i) => i;

class App extends Component {
    constructor(props) {
        super(props);
    }



    static navigatorStyle = {
        navBarTransparent: true,
        navBarTextColor: colors.white,
        drawUnderNavBar: true,
        navBarBackgroundColor: colors.ocean,
        screenBackgroundColor: colors.ocean,
        statusBarTextColorSchemeSingleScreen: 'light'
    }


    // Keyboard.addListener('keyboardDidShow', keyboard_did_show);
    // Keyboard.addListener('keyboardDidHide', keyboard_did_hide);

    //<KeyboardAvoidingView behavior={'position'}
    //keyboardVerticalOffset={64} >
    render() {
        fade();
        return (
            <Default_bg>
                <FlatList data={this.props.psalter.content}
                          ListHeaderComponent={header(this.props.psalter)(this.props.index)}
                          renderItem={render_item}
                          keyExtractor={keyExtractor}
                          style={{marginBottom: 50}}
                          {...panResponder(this.props.dispatch)(this.props.index).panHandlers} />

                <Text_input psalters_count={this.props.psalters_count} value={this.props.psalter_text_input} dispatch={this.props.dispatch} />
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
        psalter_text_input: state.psalter_text_input
    };
}


export default connect(mapStateToProps, null)(App);