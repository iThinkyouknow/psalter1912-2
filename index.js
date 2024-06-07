import { AppRegistry } from 'react-native';

import { Navigation } from 'react-native-navigation';

import { registerScreens } from './js/screens';
import { Provider } from 'react-redux';

import configureStore from './js/redux/configureStore';
import { colors } from './js/common/common.styles';
import { default_navigator_style } from './Navigator-Common';
const store = configureStore();
console.disableYellowBox = true;

registerScreens(store, Provider); // this is where you register all of your app's screens
// start the app

//     tabsStyle: {
//         // tabBarTranslucent: true,
//         tabBarBackgroundColor: colors.dark_cerulean,
//         tabBarHidden: true,
//         drawUnderTabBar: true
//     },
//     appStyle: {
//         orientation: 'portrait'
//     }
// });

const tabChildren = [
    {
        label: 'Psalter',
        screen: 'Psalter', // this is a registered name for a screen
        icon_default: require('./images/icons/icon-open-book.png'),
        icon_selected: require('./images/icons/icon-open-book-fill.png'),
        //selectedIcon: require('./img/one_selected.png'), // iOS only
        title: 'Psalter',
        navigatorStyle: default_navigator_style
    }
    , {
        label: 'Score',
        screen: 'Psalter_PDF', // this is a registered name for a screen
        icon_default: require('./images/icons/icon-music-score.png'),
        icon_selected: require('./images/icons/icon-music-score-fill.png'),
        // icon: require(' '),
        //selectedIcon: require('./img/one_selected.png'), // iOS only
        title: 'Score',
        navigatorStyle: default_navigator_style
    }
    , {
        label: 'Creeds & Forms',
        screen: 'Creeds', // this is a registered name for a screen
        icon_default: require('./images/icons/icon-creeds.png'),
        icon_selected: require('./images/icons/icon-creeds-fill.png'),
        // icon: require(' '),
        //selectedIcon: require('./img/one_selected.png'), // iOS only
        navigatorStyle: default_navigator_style
    }
    , {
        label: 'Bible',
        screen: 'Bible_Text', // this is a registered name for a screen
        icon_default: require('./images/icons/icon-bible.png'),
        icon_selected: require('./images/icons/icon-bible-fill.png'),
        // icon: require(' '),
        //selectedIcon: require('./img/one_selected.png'), // iOS only
        title: 'The Holy Bible',
        navigatorStyle: default_navigator_style
    }
    , {
        label: 'Special',
        screen: 'Special', // this is a registered name for a screen
        icon_default: require('./images/icons/icon-special.png'),
        icon_selected: require('./images/icons/icon-special-fill.png'),
        // icon: require(' '),
        //selectedIcon: require('./img/one_selected.png'), // iOS only
        title: 'Special',
        navigatorStyle: default_navigator_style
    }
].map(({screen, icon_default, icon_selected, label}) => {
    return {
        stack: {
            children: [
                {
                    component: {
                        id: screen,
                        name: screen
                    }
                }
            ],
            options: {
                bottomTab: {
                    icon: icon_default,
                    selectedIcon: icon_selected,
                    text: label,
                    selectedIconColor: colors.blue,
                    textColor: default_navigator_style.navBarTextColor,
                    selectedTextColor: default_navigator_style.navBarTextColor
                }
            }
        }
    }
});

Navigation.setDefaultOptions({
    statusBar: {
        visible: true,
        style: 'dark'
    },
    topBar: {
        visible: false,
        drawBehind: true,
        title: {
            color: default_navigator_style.navBarTextColor,
        },
        background: {
            color: default_navigator_style.navBarBackgroundColor,
        },
        noBorder: true,
        scrollEdgeAppearance: {
            // background: {color: 'red'},
            noBorder: true,
            active: true,
        },

    },
    bottomTabs: {
        backgroundColor: default_navigator_style.tabBarBackgroundColor,
        hideShadow: true,
        
    },
});

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            bottomTabs: {
                id: 'BOTTOM_TABS',
                children: tabChildren
            }
        }
    });
});

//AppRegistry.registerComponent('The_Psalter_1912_2', () => App);
