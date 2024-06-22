import React, { useState } from 'react';
import {
    View
    , SectionList
    , Pressable
    , ImageBackground
    , Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { connect } from 'react-redux';
import Default_Bg from '../../common/Default-bg';
import { Navigation } from 'react-native-navigation';
import { sizes,font_sizes, border_radii, colors, user_font_color, user_tint_color } from '../../common/common.styles';
import { Default_Text } from '../../common/Text';
import { set_new_font_size, set_new_user_settings } from '../../redux/actions/state-actions';
import { composer, save_font_size } from '../../utils/functions';
import { user_settings_key } from '../../common/constants';
import Segmented_Buttons from '../../common/Segmented-Buttons';

const Slider_With_Text_Container = (props) => {
    const text_display = Math.round(props.value * 100) / 100;
    return (
        <View style={{flexDirection: 'row', gap: sizes.default, alignItems: 'center', marginTop: sizes.small}}>
            {props.children}
            <Default_Text style={user_font_color(props.user_settings)} text_align={'center'}>
                {text_display}
            </Default_Text> 
        </View>
    );
};

const Section_Header = ({children, user_settings}) => {
    return (
        <Default_Text 
            style={{paddingBottom: sizes.large, ...user_font_color(user_settings)}}
            font_weight={'bold'} 
            text_align={'center'}
            font_size={'xx_large'}
        >
            {children}
        </Default_Text>
    );
};

const set_font_size = ({dispatch}) => (new_font_size) => {
    composer([
        set_new_font_size
        , dispatch
    ])(new_font_size);
    save_font_size(AsyncStorage, new_font_size);
}

const Font_Size_Section = ({item, index}) => {
    return (
        <View>
            <Slider_With_Text_Container value={item.text_font_size} {...item}>
                <Slider 
                    style={{flex: 1}} 
                    value={item.text_font_size} 
                    thumbTintColor={colors.white}
                    step={0.1 * font_sizes.default}
                    minimumTrackTintColor={item.user_settings.tint_color}
                    minimumValue={0.5 * font_sizes.default}
                    maximumValue={5 * font_sizes.default}
                    onSlidingComplete={set_font_size(item)}
                />
            </Slider_With_Text_Container>
        </View>
    );
};

const on_color_picker_select = (user_settings, title, default_color, current_color, on_color_select) => () => {
    
    Navigation.showModal({
        stack: {
            children: [
                {
                    component: {
                        name: 'Color_Picker',
                        passProps: {
                            default_color,
                            current_color,
                            on_color_select,
                            user_settings
                        },
                        options: {
                            topBar: {
                                drawBehind: true,
                                visible: true,
                                title: {
                                    text: title,
                                    ...user_font_color(user_settings)
                                },
                                leftButtons: [{
                                    text: 'Close',
                                    id: 'close'
                                }],
                                leftButtonColor: user_tint_color(user_settings)
                            }
                        }
                    }
                }
            ]
        }
    })
};


const process_uri = (uri) => {
    if (Platform.OS === 'android') return uri;
    const iosSlice = uri.indexOf('/Documents');
    const index = ~iosSlice
        ? iosSlice
        : uri.indexOf('/tmp');
    const processed = '~' + uri.slice(index);
    return processed;

}

const on_image_picker_select = (set_background_image) => async () => {
    const resp = await launchImageLibrary();
    if (!resp.assets || resp.assets.length === 0) return;
    set_background_image(process_uri(resp.assets[0].uri));
};
const on_camera_picker_select = (set_background_image) => async () => {
    const resp = await launchCamera({saveToPhotos: true});
    if (!resp.assets || resp.assets.length === 0) return;
    set_background_image(process_uri(resp.assets[0].uri));
};

const save_and_apply_user_settings = ({dispatch, componentId}, settings) => () => {
    // reducer
    dispatch(set_new_user_settings(settings));
    // async storage
    let settings_str;
    try {
        settings_str = JSON.stringify(settings);
    } catch (error) {
        console.error(error);
    }
    if (!settings_str) return;
    AsyncStorage.setItem(user_settings_key, settings_str);
};

const Title_Component = ({children, user_settings}) => {
    return (
        <Default_Text
            style={user_font_color(user_settings)}
            text_align="left" 
            font_size={font_sizes.large}>
            {children}
        </Default_Text>
    );
};

const Background_Section = ({item, index}) => {
    const [background_color, set_background_color] = useState(item.user_settings.background_color);
    const [background_image, set_background_image] = useState(item.user_settings.background_image);
    const [background_opacity, set_background_opacity] = useState(item.user_settings.background_opacity);
    const [font_color, set_font_color] = useState(item.user_settings.font_color);
    const [tint_color, set_tint_color] = useState(item.user_settings.tint_color);
    
    const user_settings_obj = {
        ...item.user_settings,
        background_image,
        background_opacity,
        background_color,
        font_color,
        tint_color
    };
    
    const other_color_components = [
        {
            title: 'Text Color',
            background_color: font_color,
            current_background_color: item.user_settings.font_color,
            default_color: colors.white,
            on_press: set_font_color
        },
        {
            title: 'Button / Tint Color',
            background_color: tint_color,
            current_background_color: item.user_settings.tint_color,
            default_color: colors.blue,
            on_press: set_tint_color
        }
    ].map(({title, background_color, current_background_color, default_color, on_press}) => {
        return (
            <View key={title} style={{marginTop: sizes.large,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Title_Component user_settings={item.user_settings}>
                {title}
            </Title_Component>   
            <Pressable
            onPress={on_color_picker_select(item.user_settings, title, default_color, current_background_color, on_press)}
            style={({pressed}) => {
                return {
                    opacity: pressed ? 0.5 : 1,
                    height: 30,
                    width: 80,
                    borderRadius: border_radii.default,
                    backgroundColor: background_color
                }
            }}
            ></Pressable>
            </View>
        )
    })
    
    return (
        <View>
            <View style={{
                position: 'relative',
                marginTop: sizes.medium,
                height: 280,
                borderWidth: 2,
                borderColor: item.user_settings.tint_color,
                borderRadius: border_radii.x_large, overflow: 'hidden'}}>
                
                <ImageBackground style={{backgroundColor: background_color}} src={background_image}>
                    <View style={{
                        backgroundColor: `rgba(0, 0, 0, ${background_opacity})`,
                        height: '100%',
                        justifyContent: 'space-between',
                        padding: sizes.large,
                        gap: sizes.medium
                    }}>
                    <View style={{marginTop: sizes.x_large, maxHeight: 150}}>
                        <Default_Text 
                            style={{color: font_color}} 
                            text_align="center" 
                            font_size={item.text_font_size}>
                                {item.psalter_sample}
                        </Default_Text>
                    </View>
                    <Pressable style={({pressed}) => {
                        return {
                            opacity: pressed ? 0.5 : 1,
                            padding: sizes.medium,
                            backgroundColor: tint_color,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: sizes.default
                        }
                    }}>
                        <Default_Text style={{color: font_color}}>Button</Default_Text>
                    </Pressable>
                </View>
                    <Pressable 
                        style={({pressed}) => {
                            return {
                                opacity: pressed ? 0.5 : 1,
                                position: 'absolute', right: sizes.default, top: sizes.default, borderRadius: border_radii.default, borderWidth: 1, borderColor: item.user_settings.tint_color, padding: sizes.small
                            }
                        }}
                        onPress={() => set_background_image('')}
                    >
                        <Default_Text 
                            style={user_font_color(item.user_settings)}
                            font_size={font_sizes.x_small}
                        >
                            Remove Image
                        </Default_Text>
                    </Pressable>
                </ImageBackground>
            </View >
                
            <View style={{marginTop: sizes.default}}>
            {
                Segmented_Buttons(undefined, [
                    {
                        text: 'Color 🖍️', 
                        on_press: on_color_picker_select(item.user_settings, 'Background Color', colors.dark_cerulean, item.user_settings.background_color, set_background_color)
                    },
                    {
                        text: 'Camera 📷',
                        on_press: on_camera_picker_select(set_background_image)
                    },
                    {
                        text: 'Gallery 🌄', 
                        on_press: on_image_picker_select(set_background_image)
                    }
                ], item.user_settings)
            }
            </View>
            <View style={{marginTop: sizes.large}}>
                <Title_Component user_settings={item.user_settings}>
                    Darken Background
                </Title_Component>
                <Slider_With_Text_Container value={background_opacity} {...item}>
                    <Slider 
                        style={{flex: 1}} 
                        maximumValue={1}
                        step={0.01}
                        minimumTrackTintColor={item.user_settings.tint_color}
                        value={background_opacity}
                        onValueChange={set_background_opacity}
                    />
                </Slider_With_Text_Container>
            </View>

            {other_color_components}
            
            
            <Pressable onPress={save_and_apply_user_settings(item, user_settings_obj)} style={({pressed}) => {
                return {
                    opacity: pressed ? 0.5 : 1,
                    marginTop: sizes.x_large,
                    backgroundColor: user_tint_color(item.user_settings), 
                    padding: sizes.medium,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: border_radii.large
                }
            }}>
                <Default_Text style={user_font_color(item.user_settings)} text_align={'center'}>Apply</Default_Text>
            </Pressable>
        </View>
    )
}

const Settings = (props) => {
    const Header = (<Section_Header {...props}>Settings</Section_Header>);
    const {
        statusBarHeight,
    } = Navigation.constantsSync();
    const sections = [
        {
            data: [
                props
            ],
            section_title: 'Font Size',
            renderItem: Font_Size_Section
        },
        {
            data: [
                props
            ],
            section_title: 'Background Image / Color',
            renderItem: Background_Section
        }
    ];
    return (
        <Default_Bg user_settings={props.user_settings}>
            <SectionList
                style={{}} 
                contentContainerStyle={{paddingTop: statusBarHeight, paddingHorizontal: sizes.large}}
                contentInsetAdjustmentBehavior={'never'} 
                ListHeaderComponent={Header} sections={sections}
                renderSectionHeader={(info) => {
                    return (
                        <Title_Component user_settings={props.user_settings}>
                            {info.section.section_title}
                        </Title_Component>
                    );
                }}
            />
        </Default_Bg>
    )
};


function mapStateToProps(state) {
    return {
        psalter_sample: state.psalter.psalter_json?.[0]?.content?.[0]?.[0] || ''
        , text_font_size: state.text_font_size
        , user_settings: state.user_settings
    };
}

export default connect(mapStateToProps, null)(Settings);

