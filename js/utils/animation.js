import {
    Animated,
    Dimensions,
    Easing
} from 'react-native';

import { native_elements } from '../common/common.styles';
import { main_title_2 } from '../common/Text';

import { is_function, no_op } from '../utils/functions';

export const slide_down_animation = (duration) => (bounciness = 0) => {
    const { height } = Dimensions.get('window');
    const animated_value = new Animated.Value(-height);
    let should_slide_down = true;
    return {
        animated_value,
        slide: () => {
            Animated.spring(animated_value, {
                toValue: (should_slide_down) ? (height) : -height,
                duration,
                useNativeDriver: true,
                bounciness
            }).start();

            should_slide_down = !should_slide_down;
        }
    };
};

export const slide_down_to = (duration = 0) => (bounciness = 0) => (height = 0) => {
    const animated_value = new Animated.Value(height);
    let should_slide_down = false;

    const slide = (toValue = height) => () => {

        Animated.spring(animated_value, {
            toValue,
            duration,
            useNativeDriver: true,
            bounciness
        }).start();

        should_slide_down = !should_slide_down;
    };
    return {
        animated_value
        , slide_up: slide(height)
        , slide_down: slide(0)
        , slide
    };
};

export const slide_side_animation = (duration = 100) => (bounciness = 18) => (initial_val = Dimensions.get('window').width * -1.2) => {
    const animated_value = new Animated.Value(initial_val);
    let should_slide = true;

    const slide = (_cb = no_op) => {
        const cb = is_function(_cb) ? _cb : no_op;
        Animated.spring(animated_value, {
            toValue: (should_slide) ? 0 : initial_val,
            duration,
            bounciness,
            useNativeDriver: true
        }).start(cb);

        should_slide = !should_slide;
    };

    return {
        animated_value,
        slide
    }
};

export const fade_animation = (duration) => (initial_val) => {
    const fade_opacity = new Animated.Value(0);

    const fade_in = () => {
        Animated.sequence([
            Animated.timing(fade_opacity, {
                toValue: 0
                , duration: 0
                , useNativeDriver: true
            }),
            Animated.delay(20),
            Animated.timing(fade_opacity, {
                toValue: 1
                , duration: duration
                , useNativeDriver: true
            })
        ]).start();
    };

    const fade_out = () => {
        Animated.timing(fade_opacity, {
            toValue: 0
            , duration: duration
            , useNativeDriver: true
        }).start();
    };

    return {
        fade_in,
        fade_out,
        fade_opacity
    };
};


export const bounce_animation = (duration = 1000) => (speed = 3) => (bounciness = 25) => (initial_val = -64) => {
    const animated_value = new Animated.Value(initial_val);
    const bounce = () => {
        animated_value.setValue(initial_val);
        Animated.spring(animated_value, {
            toValue: 1,
            duration,
            speed,
            useNativeDriver: true,
            bounciness
        }).start();
    };

    return {
        animated_value,
        bounce
    }

};