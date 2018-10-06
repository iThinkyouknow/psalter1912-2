
import { Navigation } from 'react-native-navigation';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    Navigation.registerComponent('Psalter', () => require('./Psalter/Psalter').default, store, Provider);

    Navigation.registerComponent('Psalter_PDF', () => require('./Psalter-PDF/Psalter-PDF').default, store, Provider);

    Navigation.registerComponent('Creeds', () => require('./Creeds/Creeds').default, store, Provider);
    Navigation.registerComponent('Creeds_Categories', () => require('./Creeds/Creeds-Categories').default, store, Provider);
    Navigation.registerComponent('Creeds_Text', () => require('./Creeds/Creeds-Text').default, store, Provider);

    Navigation.registerComponent('Bible_Text', () => require('./Bible/Bible-Text').default, store, Provider);

    Navigation.registerComponent('Special', () => require('./Special/Special').default, store, Provider);
    Navigation.registerComponent('Website', () => require('./Special/Website').default, store, Provider);
    Navigation.registerComponent('Credits', () => require('./Special/Credits').default, store, Provider);
    Navigation.registerComponent('Resources', () => require('./Special/Resources').default, store, Provider);
    Navigation.registerComponent('Statistics', () => require('./Special/Statistics').default, store, Provider);
    Navigation.registerComponent('Psalter_Sung_Details', () => require('./Special/Psalter-Sung-Details').default, store, Provider);
}