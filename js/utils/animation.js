import {
    Animated,
    Dimensions,
    Easing
} from 'react-native';

import {native_elements} from '../common/common.styles';

export const slide_down_animation = (duration) => (bounciness = 0) => {
    const animated_value = new Animated.Value(0);
    let should_slide_down = true;
    return {
        animated_value,
        slide: () => {
            const {height} = Dimensions.get('window');

            Animated.spring(animated_value, {
                toValue: (should_slide_down) ? (height) : 0,
                duration,
                useNativeDriver: true,
                bounciness
            }).start();

            should_slide_down = !should_slide_down;
        }
    };
};

export const slide_side_animation = (duration = 100) => (bounciness = 18) => (initial_val = Dimensions.get('window').width * -1.2) => {
    const animated_value = new Animated.Value(initial_val);
    let should_slide = true;

    const slide = () => {
        Animated.spring(animated_value, {
            toValue: (should_slide) ? 0 : initial_val,
            duration,
            bounciness,
            useNativeDriver: true
        }).start();

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
                toValue: 0,
                duration: 0,
                easing: Easing.linear(1)
            }),
            Animated.delay(500),
            Animated.timing(fade_opacity, {
                toValue: 1,
                duration: duration
            })
        ]).start();
    };

    const fade_out = () => {
        Animated.timing(fade_opacity, {
            toValue: 0,
            duration: duration
        }).start();
    };

    return {
        fade_in,
        fade_out,
        fade_opacity
    };
};


export const bounce_animation = (duration = 1000) =>(speed = 3) => (bounciness = 25) => (initial_val = -64) => {
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