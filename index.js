import { AppRegistry } from 'react-native';

import { Navigation } from 'react-native-navigation';

import { registerScreens } from './js/screens';

registerScreens(); // this is where you register all of your app's screens

// start the app
Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'Psalter',
            screen: 'Psalter', // this is a registered name for a screen
            // icon: require(' '),
            //selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Psalter'
        }
    ],
    tabsStyle: {
        tabBarTranslucent: true,
        tabBarBackgroundColor: 'rgb(0, 84, 147)'
    }
});

//AppRegistry.registerComponent('The_Psalter_1912_2', () => App);
