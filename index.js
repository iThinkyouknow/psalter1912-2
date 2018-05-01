import { AppRegistry } from 'react-native';

import { Navigation } from 'react-native-navigation';

import { registerScreens } from './js/screens';
import { Provider } from 'react-redux';

import configureStore from './js/redux/configureStore';
import {colors} from './js/common/common.styles';
const store = configureStore();

registerScreens(store, Provider); // this is where you register all of your app's screens

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
    tabBarHidden: true,
    drawUnderStatusBar: true,
    statusBarTranslucent: true,
    statusBarColor: 'transparent'
};

export const navigator_style_push = {
    ...default_navigator_style,
    navBarHidden: false
};
// start the app
Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'Psalter',
            screen: 'Psalter', // this is a registered name for a screen
            icon: require('./images/icons/icon-open-book.png'),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Psalter',
            navigatorStyle: default_navigator_style
        }
        , {
            label: 'Score',
            screen: 'Psalter_PDF', // this is a registered name for a screen
            icon: require('./images/icons/icon-open-book.png'),
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Score',
            navigatorStyle: default_navigator_style
        }
        , {
            label: 'Creeds & Forms',
            screen: 'Creeds', // this is a registered name for a screen
            icon: require('./images/icons/icon-open-book.png'),
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            navigatorStyle: default_navigator_style
        }
        , {
            label: 'Bible',
            screen: 'Bible_Text', // this is a registered name for a screen
            icon: require('./images/icons/icon-open-book.png'),
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'The Holy Bible',
            navigatorStyle: default_navigator_style
        }
        , {
            label: 'Special',
            screen: 'Special', // this is a registered name for a screen
            icon: require('./images/icons/icon-open-book.png'),
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Special',
            navigatorStyle: default_navigator_style
        }
    ],
    tabsStyle: {
        // tabBarTranslucent: true,
        tabBarBackgroundColor: colors.dark_cerulean,
        tabBarHidden: true,
        drawUnderTabBar: true
    }
});

//AppRegistry.registerComponent('The_Psalter_1912_2', () => App);
