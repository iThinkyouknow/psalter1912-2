import { View, FlatList, Pressable } from 'react-native'
import { useEffect } from 'react';
import { Navigation } from 'react-native-navigation';
import { border_radii, colors, sizes, user_font_color } from '../../common/common.styles';
import { Default_Text } from '../../common/Text';
import Default_Bg from '../../common/Default-bg';
const color_data = [
    "rgb(255, 192, 203)",
    "rgb(255, 182, 193)",
    "rgb(255, 105, 180)",
    "rgb(255, 20, 147)",
    "rgb(219, 112, 147)",
    "rgb(199, 21, 133)",
    "rgb(230, 230, 250)",
    "rgb(216, 191, 216)",
    "rgb(221, 160, 221)",
    "rgb(218, 112, 214)",
    "rgb(238, 130, 238)",
    "rgb(255, 0, 255)",
    "rgb(186, 85, 211)",
    "rgb(153, 50, 204)",
    "rgb(148, 0, 211)",
    "rgb(138, 43, 226)",
    "rgb(139, 0, 139)",
    "rgb(128, 0, 128)",
    "rgb(147, 112, 219)",
    "rgb(123, 104, 238)",
    "rgb(106, 90, 205)",
    "rgb(72, 61, 139)",
    "rgb(102, 51, 153)",
    "rgb(75, 0, 130)",
    "rgb(255, 160, 122)",
    "rgb(250, 128, 114)",
    "rgb(233, 150, 122)",
    "rgb(240, 128, 128)",
    "rgb(205, 92, 92)",
    "rgb(220, 20, 60)",
    "rgb(255, 0, 0)",
    "rgb(178, 34, 34)",
    "rgb(139, 0, 0)",
    "rgb(255, 165, 0)",
    "rgb(255, 140, 0)",
    "rgb(255, 127, 80)",
    "rgb(255, 99, 71)",
    "rgb(255, 69, 0)",
    "rgb(255, 215, 0)",
    "rgb(255, 255, 0)",
    "rgb(255, 255, 224)",
    "rgb(255, 250, 205)",
    "rgb(250, 250, 210)",
    "rgb(255, 239, 213)",
    "rgb(255, 228, 181)",
    "rgb(255, 218, 185)",
    "rgb(238, 232, 170)",
    "rgb(240, 230, 140)",
    "rgb(189, 183, 107)",
    "rgb(173, 255, 47)",
    "rgb(127, 255, 0)",
    "rgb(124, 252, 0)",
    "rgb(0, 255, 0)",
    "rgb(50, 205, 50)",
    "rgb(152, 251, 152)",
    "rgb(144, 238, 144)",
    "rgb(0, 250, 154)",
    "rgb(0, 255, 127)",
    "rgb(60, 179, 113)",
    "rgb(46, 139, 87)",
    "rgb(34, 139, 34)",
    "rgb(0, 128, 0)",
    "rgb(0, 100, 0)",
    "rgb(154, 205, 50)",
    "rgb(107, 142, 35)",
    "rgb(85, 107, 47)",
    "rgb(102, 205, 170)",
    "rgb(143, 188, 143)",
    "rgb(32, 178, 170)",
    "rgb(0, 139, 139)",
    "rgb(0, 128, 128)",
    "rgb(0, 255, 255)",
    "rgb(0, 255, 255)",
    "rgb(224, 255, 255)",
    "rgb(175, 238, 238)",
    "rgb(127, 255, 212)",
    "rgb(64, 224, 208)",
    "rgb(72, 209, 204)",
    "rgb(0, 206, 209)",
    "rgb(95, 158, 160)",
    "rgb(70, 130, 180)",
    "rgb(176, 196, 222)",
    "rgb(173, 216, 230)",
    "rgb(176, 224, 230)",
    "rgb(135, 206, 250)",
    "rgb(135, 206, 235)",
    "rgb(100, 149, 237)",
    "rgb(0, 191, 255)",
    "rgb(30, 144, 255)",
    "rgb(65, 105, 225)",
    "rgb(0, 0, 255)",
    "rgb(0, 0, 205)",
    "rgb(0, 0, 139)",
    "rgb(0, 0, 128)",
    "rgb(25, 25, 112)",
    "rgb(255, 248, 220)",
    "rgb(255, 235, 205)",
    "rgb(255, 228, 196)",
    "rgb(255, 222, 173)",
    "rgb(245, 222, 179)",
    "rgb(222, 184, 135)",
    "rgb(210, 180, 140)",
    "rgb(188, 143, 143)",
    "rgb(244, 164, 96)",
    "rgb(218, 165, 32)",
    "rgb(184, 134, 11)",
    "rgb(205, 133, 63)",
    "rgb(210, 105, 30)",
    "rgb(128, 128, 0)",
    "rgb(139, 69, 19)",
    "rgb(160, 82, 45)",
    "rgb(165, 42, 42)",
    "rgb(128, 0, 0)",
    "rgb(255, 255, 255)",
    "rgb(255, 250, 250)",
    "rgb(240, 255, 240)",
    "rgb(245, 255, 250)",
    "rgb(240, 255, 255)",
    "rgb(240, 248, 255)",
    "rgb(248, 248, 255)",
    "rgb(245, 245, 245)",
    "rgb(255, 245, 238)",
    "rgb(245, 245, 220)",
    "rgb(253, 245, 230)",
    "rgb(255, 250, 240)",
    "rgb(255, 255, 240)",
    "rgb(250, 235, 215)",
    "rgb(250, 240, 230)",
    "rgb(255, 240, 245)",
    "rgb(255, 228, 225)",
    "rgb(220, 220, 220)",
    "rgb(211, 211, 211)",
    "rgb(192, 192, 192)",
    "rgb(169, 169, 169)",
    "rgb(105, 105, 105)",
    "rgb(128, 128, 128)",
    "rgb(119, 136, 153)",
    "rgb(112, 128, 144)",
    "rgb(47, 79, 79)",
    "rgb(0, 0, 0)"
];



const onNavigatorEvent = ({buttonId, componentId}) => {
    if (buttonId === 'close') {
        Navigation.dismissModal(componentId);
    }
};

const color_button = ({componentId, on_color_select}) => ({item, index}) => { 
    return (
        <Pressable 
            style={({pressed}) => {
                return {
                    opacity: pressed ? 0.5 : 1,
                    flex: 1, 
                    height: 30,
                    borderRadius: border_radii.default,
                    backgroundColor: item
                }
            }}
            onPress={() => {
                Navigation.dismissModal(componentId);
                on_color_select(item)
            }}>
        </Pressable>
    )
};

const Footer = (props) => {
    const color_style = user_font_color(props.user_settings);
    const buttons = [
        {
            text: 'Default',
            background_color: props.default_color
        },
        {
            text: 'Current',
            background_color: props.current_color
        }
    ].map(({text, background_color}) => {
        return (
            <View key={text} style={{flexDirection: 'row', flex: 1, alignItems: 'center', gap: sizes.small}}>
                <Default_Text style={color_style}>{text}:</Default_Text>
                <View style={{width: 50}}>
                    {color_button(props)({item: background_color})}
                </View>
            </View>
        )
    })
    return (
        <View style={{marginTop: sizes.medium, marginBottom: sizes.x_large,flexDirection: 'row', gap: sizes.default, alignItems: 'center'}}>
            {buttons}
        </View>
    );
}

export default Color_Picker = (props) => {
    useEffect(() => {
        Navigation.events().registerNavigationButtonPressedListener(onNavigatorEvent);
    }, []);

    return (
        <Default_Bg style={{paddingBottom: 0}} user_settings={props.user_settings}>
            <FlatList
                style={{padding: sizes.large}}
                numColumns={7}
                horizontal={false}
                data={color_data}
                keyExtractor={(item) => {
                    return item
                }}
                ItemSeparatorComponent={(<View style={{width: sizes.small, height: sizes.small}}></View>)}
                columnWrapperStyle={{gap: sizes.default}}
                renderItem={color_button(props)}
                ListFooterComponent={Footer(props)}
                >
            </FlatList>
        </Default_Bg>
    )
}