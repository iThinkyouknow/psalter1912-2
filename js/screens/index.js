
import { Navigation } from 'react-native-navigation';

import Psalter from './Psalter/index';
import Creeds from './Creeds/Creeds';
import Creeds_Categories_1 from './Creeds/Creeds-Categories-1';


// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    Navigation.registerComponent('Psalter', () => Psalter, store, Provider);
    Navigation.registerComponent('Creeds', () => Creeds, store, Provider);
    Navigation.registerComponent('Creeds_Categories_1', () => Creeds_Categories_1, store, Provider);
}