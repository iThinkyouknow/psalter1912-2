import {
    PanResponder
    , Dimensions
} from 'react-native';

import {no_op, is_present_type} from './functions'


export const scroll_swipe_actions = (scroll_swipe_left) => (scroll_swipe_right) => (e) => {
    console.log(e.nativeEvent.velocity.x);
    if (e.nativeEvent.velocity.x > 3) scroll_swipe_right();
    if (e.nativeEvent.velocity.x < -3) scroll_swipe_left();
};

export const swipe_side_action = (swipe_width) => (swipe_right_action = no_op) => (swipe_left_action) => (e, gestureState) => {
    //swipe right
    if (gestureState.dx > swipe_width) return swipe_right_action();
    if (gestureState.dx < -swipe_width) return is_present_type('function')(swipe_left_action) ? swipe_left_action() : swipe_right_action();
};

export const swipe = (on_swipe) => PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderRelease: on_swipe
});
