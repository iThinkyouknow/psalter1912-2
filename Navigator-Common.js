import { colors, user_font_color, user_tint_color } from './js/common/common.styles';
export const default_navigator_style = {
    navBarNoBorder: true,
    navBarTransparent: true,
    navBarTranslucent: true, // use to make drawUnderNavBar effective
    navBarBackgroundColor: 'transparent',
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

export const show_misc_actions_modal_obj = (type, user_settings) => {
    
    return {
        stack: {
            children: [
                {
                    component: {
                        name: 'MiscActions',
                        passProps: {
                            type
                        },
                        options: {
                            topBar: {
                                drawBehind: true,
                                visible: true,
                                title: {
                                    text: 'Copy & Share',
                                    ...user_font_color(user_settings)
                                },
                                leftButtons: [{
                                    text: 'Close',
                                    id: 'close'
                                }],
                                leftButtonColor: user_tint_color(user_settings)
                            }
                        }
                    }
                }
            ]
        }
    }
};