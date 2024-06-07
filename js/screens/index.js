
import { Navigation } from 'react-native-navigation';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
    const screens = [
        ['Psalter', require('./Psalter/Psalter').default],
        ['Psalter_PDF', require('./Psalter-PDF/Psalter-PDF').default],
        ['Creeds', require('./Creeds/Creeds').default],
        ['Creeds_Categories', require('./Creeds/Creeds-Categories').default],
        ['Creeds_Text', require('./Creeds/Creeds-Text').default],
        ['Bible_Text', require('./Bible/Bible-Text').default],
        ['Special', require('./Special/Special').default],
        ['Website', require('./Special/Website').default],
        ['Credits', require('./Special/Credits').default],
        ['Resources', require('./Special/Resources').default],
        ['Statistics', require('./Special/Statistics').default],
        ['Psalter_Sung_Details', require('./Special/Psalter-Sung-Details').default],
        ['MiscActions', require('./Misc-Actions-Screen/Misc-Actions-Screen').default],
    ];

    for (const [name, Component] of screens) {
        Navigation.registerComponent(name, () => (props) => {
            return (
                <Provider store={store}>
                    <Component {...props}></Component>
                </Provider>
            );
        });
    }

    Navigation.registerComponent('Overlay_Wrapper', () => require('./Overlay-Wrapper/Overlay-Wrapper').default);
}