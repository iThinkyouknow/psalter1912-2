import {no_op, is_present_type} from './functions'

export const long_press_actions = (duration = 500) => {
    let startTime = 0;
    let canAction = true;
    return {
        onPanResponderGrant: (actions = no_op) => (e) => {
            startTime = e.nativeEvent.timestamp;
            actions();
        },
        onPanResponderMove: (actions = no_op) => (e) => {
            if (canAction === true && e.nativeEvent.timestamp - startTime > duration) {
                canAction = false;
                actions(e);
            }
        },
        onPanResponderRelease: (actions = no_op) => () => {
            startTime = 0;
            canAction = true;
            actions();
        }
    }
};

export const scroll_swipe_actions = (scroll_swipe_left) => (scroll_swipe_right) => (e) => {
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

export const touch_release_actions = (swipe_right_action) => (swipe_left_action) => (other_release_actions = no_op) => (one_third_screen_width) => (e, gestureState) => {
    if (Math.abs(gestureState.dy) < 30) {
        if (gestureState.dx < -(one_third_screen_width)) {
            swipe_left_action();
        } else if (gestureState.dx > one_third_screen_width) {
            swipe_right_action();
        }
    }
    other_release_actions();
    
};
