
import { Navigation } from 'react-native-navigation';

import Psalter from './Psalter/index';

import Psalter_PDF from './Psalter-PDF/Psalter-PDF';

import Creeds from './Creeds/Creeds';
import Creeds_Categories from './Creeds/Creeds-Categories';
import Creeds_Text from './Creeds/Creeds-Text';

import Bible_Text from './Bible/Bible-Text';

import Special from './Special/Special';
import Website from './Special/Website';
import Credits from './Special/Credits';
import Resources from './Special/Resources';


// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    Navigation.registerComponent('Psalter', () => Psalter, store, Provider);

    Navigation.registerComponent('Psalter_PDF', () => Psalter_PDF, store, Provider);

    Navigation.registerComponent('Creeds', () => Creeds, store, Provider);
    Navigation.registerComponent('Creeds_Categories', () => Creeds_Categories, store, Provider);
    Navigation.registerComponent('Creeds_Text', () => Creeds_Text, store, Provider);

    Navigation.registerComponent('Bible_Text', () => Bible_Text, store, Provider);

    Navigation.registerComponent('Special', () => Special, store, Provider);
    Navigation.registerComponent('Website', () => Website, store, Provider);
    Navigation.registerComponent('Credits', () => Credits, store, Provider);
    Navigation.registerComponent('Resources', () => Resources, store, Provider);
}