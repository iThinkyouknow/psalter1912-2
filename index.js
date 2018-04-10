import { AppRegistry } from 'react-native';

import { Navigation } from 'react-native-navigation';

import { registerScreens } from './js/screens';
import { Provider } from 'react-redux';

import configureStore from './js/redux/configureStore';
import {colors} from './js/common/common.styles';
const store = configureStore();

registerScreens(store, Provider); // this is where you register all of your app's screens

const default_navigator_style = {
    navBarNoBorder: true,
    navBarTransparent: true,
    navBarTranslucent: true, // use to make drawUnderNavBar effective
    navBarBackgroundColor: colors.dark_cerulean,
    statusBarTextColorScheme: 'light',
    navBarTextColor: colors.white,
    screenBackgroundColor: colors.dark_cerulean,
    drawUnderNavBar: true,
    drawUnderTabBar: true,
    navBarHidden: true,
    //tabBarBackgroundColor: colors.dark_cerulean,
    tabBarHidden: true
};
// start the app
Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'Psalter',
            screen: 'Psalter', // this is a registered name for a screen
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Psalter',
            navigatorStyle: {
                ...default_navigator_style,
                navBarTranslucent: false
            }
        }
        , {
            label: 'Score',
            screen: 'Psalter_PDF', // this is a registered name for a screen
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Score',
            navigatorStyle: {
                ...default_navigator_style,
                navBarTranslucent: false
            }
        }
        , {
            label: 'Creeds & Forms',
            screen: 'Creeds', // this is a registered name for a screen
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            navigatorStyle: default_navigator_style
        }
        , {
            label: 'Bible',
            screen: 'Bible_Text', // this is a registered name for a screen
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'The Holy Bible',
            navigatorStyle: {
                ...default_navigator_style,
                navBarTranslucent: false
            }
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
