
import { Navigation } from 'react-native-navigation';

import Psalter from './Psalter/index';

import Creeds from './Creeds/Creeds';
import Creeds_Categories from './Creeds/Creeds-Categories';
import Creeds_Text from './Creeds/Creeds-Text';

import Bible_Text from './Bible/Bible-Text';


// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    Navigation.registerComponent('Psalter', () => Psalter, store, Provider);

    Navigation.registerComponent('Creeds', () => Creeds, store, Provider);
    Navigation.registerComponent('Creeds_Categories', () => Creeds_Categories, store, Provider);
    Navigation.registerComponent('Creeds_Text', () => Creeds_Text, store, Provider);

    Navigation.registerComponent('Bible_Text', () => Bible_Text, store, Provider);
}