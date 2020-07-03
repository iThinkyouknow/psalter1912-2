import { colors } from './js/common/common.styles';

export const default_navigator_style = {
    navBarNoBorder: true,
    navBarTransparent: true,
    navBarTranslucent: true, // use to make drawUnderNavBar effective
    navBarBackgroundColor: colors.dark_cerulean,
    statusBarTextColorScheme: 'light',
    navBarButtonColor: colors.blue,
    navBarTextColor: colors.white,
    screenBackgroundColor: colors.dark_cerulean,
    drawUnderNavBar: true,
    drawUnderTabBar: true,
    navBarHidden: true,
    tabBarBackgroundColor: colors.dark_cerulean,
    tabBarHidden: true
};

export const navigator_style_push = {
    ...default_navigator_style,
    navBarHidden: false
};

export const navigator_style_modal = {
    navBarTextColor: colors.white,
    navBarHidden: false,
    drawUnderNavBar: false,
    navBarButtonColor: colors.white,
    navBarTransparent: false,
    navBarTranslucent: false,
    navBarBackgroundColor: colors.dark_cerulean,
    tabBarHidden: true
};

export const show_misc_actions_modal_obj = (type) => {
    return ({
        screen: 'MiscActions'
        , navigatorStyle: navigator_style_modal
        , passProps: {
            type
        }
        , title: 'Copy & Share'
        , navigatorButtons: {
            leftButtons: [{
                title: 'Close',
                id: 'close'
            }]
        }
    })
};

export const hide_tabs_action = (navigator) => () => {
    return navigator.toggleTabs({
        to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
        animated: false // does the toggle have transition animation or does it happen immediately (optional)
    });
};