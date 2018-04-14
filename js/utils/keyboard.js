import KeyboardManager from 'react-native-keyboard-manager';

export const set_keyboard_toolbar = (should_show_toolbar) => {

    if (should_show_toolbar) {
        KeyboardManager.setEnableAutoToolbar(true);
        KeyboardManager.setToolbarDoneBarButtonItemText("Go Forth!");
        KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
        KeyboardManager.setShouldShowTextFieldPlaceholder(false);
    } else {
        KeyboardManager.setEnableAutoToolbar(false);
    }
};
