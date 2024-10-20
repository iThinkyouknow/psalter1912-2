import { Gesture, Directions } from 'react-native-gesture-handler';

export const pinch_text_gesture = (on_update) => {
    return Gesture.Pinch()
        .onUpdate(on_update)
        .runOnJS(true);
}

export const swipe_gesture = (swipe_next_action, swipe_prev_action) => {
    let swipe_x = 0;
    return Gesture.Fling()
        .direction(Directions.LEFT | Directions.RIGHT)        
        .onBegin((e) => {swipe_x = e.absoluteX})
        .onEnd((e) => {
            e.absoluteX < swipe_x
                ? swipe_next_action()
                : swipe_prev_action()
        });
}

export const long_press_gesture = (on_long_press) => {
    return Gesture.LongPress()
        .onStart(e => {
            on_long_press({
                top: e.absoluteY
                , left: e.absoluteX
                , isHidden: false
            });
        });
}


