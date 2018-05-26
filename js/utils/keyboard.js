import KeyboardManager from 'react-native-keyboard-manager';
import {Platform} from 'react-native';

export const set_keyboard_toolbar = (should_show_toolbar) => {
    if (Platform.OS !== 'ios') return;
    if (should_show_toolbar) {
        KeyboardManager.setEnableAutoToolbar(true);
        KeyboardManager.setToolbarDoneBarButtonItemText("Go Forth!");
        KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
        KeyboardManager.setShouldShowTextFieldPlaceholder(false);
    } else {
        KeyboardManager.setEnableAutoToolbar(false);
    }
};
