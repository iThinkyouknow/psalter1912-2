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
    //tabBarBackgroundColor: colors.dark_cerulean,
    tabBarHidden: true
};

export const navigator_style_push = {
    ...default_navigator_style,
    navBarHidden: false
};