import {
    PanResponder
    , Dimensions
} from 'react-native';

import {no_op, is_present_type} from './functions'
import {font_sizes} from '../common/common.styles'

export const tap_to_change_font_size = () => {
    let timeout = 0;
    let taps = 0;
    return (set_font_size) => (font_size = font_sizes.default) => (evt, gestureState) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            taps = 0;
        }, 500)

        taps += 1;

        if (taps > 1) {
            if (font_size < 36) {
                set_font_size(font_size + 9);

            } else if (font_size > 35) {
                set_font_size(font_sizes.default)
            }
        }
    }
};

export const scroll_swipe_actions = (scroll_swipe_left) => (scroll_swipe_right) => (e) => {
    console.log('x ' + e.nativeEvent.velocity.x);
    console.log('y ' + e.nativeEvent.velocity.y);
    if (Math.abs(e.nativeEvent.velocity.y) < 7) {
        if (e.nativeEvent.velocity.x > 5) scroll_swipe_right();
        if (e.nativeEvent.velocity.x < -5) scroll_swipe_left();
    }
    
};

export const swipe_side_action = (swipe_width) => (swipe_right_action = no_op) => (swipe_left_action) => (e, gestureState) => {
    //swipe right
    if (gestureState.dx > swipe_width) return swipe_right_action();
    if (gestureState.dx < -swipe_width) return is_present_type('function')(swipe_left_action) ? swipe_left_action() : swipe_right_action();
};

export const touch_release_actions = (swipe_right_action) => (swipe_left_action) => (tap_to_change_font_size_action) => (one_third_screen_width) => (e, gestureState) => {
    if (Math.abs(gestureState.dy) < 30) {
        if (gestureState.dx < -(one_third_screen_width)) {
            swipe_left_action();
        } else if (gestureState.dx > one_third_screen_width) {
            swipe_right_action();
        }
    }
};
