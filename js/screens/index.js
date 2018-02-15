
import { Navigation } from 'react-native-navigation';

import Psalter from './Psalter/index';
import Creeds from './Creeds/Creeds';


// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    Navigation.registerComponent('Psalter', () => Psalter, store, Provider);
    Navigation.registerComponent('Creeds', () => Creeds, store, Provider);
}