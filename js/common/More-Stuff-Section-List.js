import React, {Component} from 'react';
import {
    SectionList,
    Animated,
    StatusBar,
    Dimensions,
    View,
    TouchableHighlight
} from 'react-native';

import { 
    Default_Text
    , main_title_2
    , normal_text } from './Text';

import { Rounded_Button } from './Rounded-Button';


import { native_elements, sizes, colors, zIndex } from './common.styles';

import { is_present_type } from '../utils/functions';

import { slide_down_animation } from '../utils/animation';

const more_section_slide_animation = slide_down_animation(500)(12);
const more_section_slide_position = more_section_slide_animation.animated_value;
const more_section_slide = more_section_slide_animation.slide;

const styles = {
    more_stuff_list_header: {
        paddingTop: native_elements.nav_bar_std + native_elements.status_bar
    },
    more_info_section_container: {
        marginVertical: sizes.default
    },
    more_stuff_bottom_buttons_container: {
        flexDirection: 'row'
        , justifyContent: 'center'
        , height: native_elements.tab_bar
        , paddingVertical: sizes.default / 2
        , marginBottom: sizes.large
    },
    ref_text_container: {
        paddingHorizontal: sizes.x_large,
        marginTop: sizes.default
    },
    slide_down_view_style: {
        backgroundColor: colors.black,
        opacity: 0.8,
        position: 'absolute',
        left: 0,
        zIndex: zIndex.max
    },
    more_section_list: {
        marginBottom: sizes.default
    },
};


const more_stuff_list_header = () => {
    return (
        <View style={styles.more_stuff_list_header} />
    );
};



const Bottom_Buttons = (props) => {
    
    return (
        <View style={styles.more_stuff_bottom_buttons_container}>
        {
            Rounded_Button(
                <Default_Text text_align={'center'}>
                I'm Done
                </Default_Text>
            )(more_section_slide)(props.width)
        }
        </View>
        
    );
};


const more_info_section_key_extractor = (item, index) => `more-info-section-${item.title}-${index}`;

const ref_text_comp = (psalm) => ({ v, refs }, i) => {
    return (
        <TouchableHighlight key={`ref-line-${i}`}>
        <View>
        <Default_Text >
        {`${i + 1}. ${psalm}:${v} - ${refs}`}
        </Default_Text>
        </View>
        </TouchableHighlight>
    );
};

const psalter_refs_section = ({ item, index }) => {
    const { title, text_array, psalm } = item;
    if (!Array.isArray(text_array) || text_array.length < 1) return null;
    
    const texts = Array.isArray(item.text_array)
    ? item.text_array.map(ref_text_comp(psalm))
    : normal_text('default')(`ref-line-${index}`)()(`${psalm} - ${item.text_array}`);
    
    return (
        <View style={styles.more_info_section_container}>
        {main_title_2(title)}
        <View style={styles.ref_text_container}>
        {texts}
        </View>
        </View>
    );
};

const count_section = ({ item }) => {
    const { title } = item;
    
    if (!is_present_type('string')(title)) return null;
    return (
        <View style={styles.more_info_section_container}>
        {main_title_2(item.title)}
        </View>
    );
};

const music_section = (music_slider) => ({ item, index }) => {
    if (!Array.isArray(item.sources)) return null;
    if ((typeof item.sources[0] !== 'string') || item.sources[0].length < 1) return null;
    
    const music_slider_array = item.sources
    .map(music_slider)
    .filter(slider => slider !== null);
    
    return (music_slider_array.length > 0)
    ? (
        <View >
        {main_title_2(item.title)}
        {music_slider_array}
        </View>
    )
    : null;
};

export function More_Stuff_Section_List(props) {
    // more_section_slide();
    const psalter_music_source = (props.psalter_no !== -1 && props.psalter_no !== 0 && props.psalter_no !== undefined && props.psalter_no !== null)
    ? `psalter_${props.psalter_no}.mp3`
    : ``;
    
    const sections = [
        {
            data: [
                {
                    title: 'Music',
                    sources: [psalter_music_source],
                }
            ],
            renderItem: music_section(props.music_slider),
            keyExtractor: more_info_section_key_extractor
        }
        , {
            data: [
                {
                    title: is_present_type('number')(props.sung_count) ? `Count: ${props.sung_count}` : ''
                }
            ],
            renderItem: count_section,
            keyExtractor: more_info_section_key_extractor
        }
        , {
            data: [
                {
                    title: 'Cross References',
                    text_array: props.psalter_refs,
                    psalm: props.psalm
                }
            ],
            renderItem: psalter_refs_section,
            keyExtractor: more_info_section_key_extractor
        }
    ];
    
    const { width, height } = Dimensions.get('window');
    const slide_down_view_dynamic_style = {
        width,
        height: height + (Navigation.constantsSync().statusBarHeight),
        bottom: height,
        transform: [
            {
                translateY: height //more_section_slide_position
            }
        ]
    };
    
    return (
        <Animated.View style={[styles.slide_down_view_style, slide_down_view_dynamic_style]}>
            <SectionList ListHeaderComponent={more_stuff_list_header} style={[styles.more_section_list]}
            sections={sections} />
            <Bottom_Buttons width={width} navigator={props.navigator} />
        </Animated.View>
    );
};

More_Stuff_Section_List.options = (props) => {
    return {
        layout: {
            componentBackgroundColor: 'transparent',
          },
        overlay: {
            interceptTouchOutside: false,
        },
    };
};
