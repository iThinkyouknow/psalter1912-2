
import { Navigation } from 'react-native-navigation';

import Psalter from './Psalter/index';


// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('Psalter', () => Psalter);
}