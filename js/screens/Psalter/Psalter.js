import React, { Component } from 'react';
import {
    View
    , FlatList
    , SectionList
    , PanResponder
    , Animated
    , TextInput
    , Dimensions
    , Platform
    , TouchableHighlight
    , Image
} from 'react-native';

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './index.styles';
import { colors, sizes, font_sizes, zIndex, native_elements, buttons, is_iPhone_X, border_radii } from '../../common/common.styles';

import { font_size_key } from '../../common/constants';

import {
    Default_Text
    , main_title
} from '../../common/Text';

import FontSlider from '../../common/Font-slider';

import Default_Bg from '../../common/Default-bg';

import { Rounded_Button } from '../../common/Rounded-Button';
import music_slider from '../../common/music-slider';
import Copy_Share_Tooltip from '../../common/Copy-Share-Tooltip-Btn';

import {
    psalter_init
    , lock_in
    , set_sung_count_all
    , set_sung_date
} from '../../redux/actions/psalter-actions';

import {
    psalter_text_input
    , toggle_text_as_valid
    , set_input_as_search
    , set_can_search
    , set_new_font_size
    , set_copy_share_btn
    , set_psalter_header_scroll_details
} from '../../redux/actions/state-actions';

import {
    psaltersearchjson_init
    , search_psalter
} from '../../redux/actions/search-actions';

import {
    get_bible_init
    , get_bible_passage
} from '../../redux/actions/bible-actions';

import {
    creeds_forms_library_init
} from '../../redux/actions/creeds-actions';

import { credits_texts_init } from '../../redux/actions/credits-actions';
import {
    neglected_texts_init
    , neglected_alert_texts_init
} from '../../redux/actions/statistics-actions';

import music_player from '../../utils/music-player';

import {
    is_present_type
    , is_array
    , is_string
    , is_number
    , no_op
    , composer
    , not
    , save_font_size
} from '../../utils/functions';

import { slide_down_animation, fade_animation, slide_side_animation, slide_down_to } from '../../utils/animation';
import {
    string_input_error_alert
    , wrong_number_error_alert
    , perhaps_change_to_psalter_input_alert
    , new_over_the_air_update_alert
    , new_data_present_alert
} from '../../utils/alert';

import {
    scroll_swipe_actions
    , touch_release_actions
    , long_press_actions
} from '../../utils/touch-gestures';

import { set_keyboard_toolbar } from '../../utils/keyboard';
import { show_misc_actions_modal_obj } from '../../../Navigator-Common';

import { MISC_ACTION_TEXT_TYPES } from '../Misc-Actions-Screen/Misc-Actions-Screen';
import { Navigation } from 'react-native-navigation';

let main_view_ref = null;

const psalter_text_fade_anim = fade_animation(100, 0);

const more_section_slide_animation = slide_down_animation(500, 12);

const more_section_slide = more_section_slide_animation.slide;


const floating_header_animation = slide_down_to(10, 0, -150);
const floating_header_animation_slide_up = floating_header_animation.slide_up;
const floating_header_animation_slide_down = floating_header_animation.slide_down;

const _Floating_Header = (props) => {
    const { psalter, index, text_font_size } = props;

    const { no } = psalter;

    const transform_style = {
        transform: [{ translateY: floating_header_animation.animated_value }]
    }

    const font_size = Math.min(text_font_size * 2, 60);

    return (((index >= 0) &&
        <Animated.View style={[styles.floating_header, styles.standard_margin_horizontal, styles.main_text_padding_top, transform_style]}>
            {is_number(no) && main_title(`Psalter ${no}`, font_size)}
            
        </Animated.View>
    ));

};

const flatlist_on_scroll = (props) => (e) => {
    const y = e.nativeEvent.contentOffset.y
    if (y > 200) {
        if ((props.scroll_details.y || 0) < y) {
            floating_header_animation_slide_up();
        } else if ((props.scroll_details.y || 0) > y) {
            floating_header_animation_slide_down();
        }
    } else {
        floating_header_animation_slide_up();
    }

};

const flatlist_on_scroll_begin = (props) => (e) => {
    props.dispatch(set_psalter_header_scroll_details({
        ...(e.nativeEvent.contentOffset || {})
    }));
}

const header = (props) => (fade_anim) => {
    const {psalter, index, text_font_size} = props;
    const { no, title, content, meter, psalm } = psalter;

    const fade_in_style = {
        opacity: fade_anim
    };

    return (((index >= 0) &&
        <Animated.View style={[styles.standard_margin_horizontal, styles.header_background, styles.main_text_padding_top, fade_in_style]}>
            {is_number(no) && main_title(`Psalter ${no}`, text_font_size * 2)}
            {
                is_string(title) && (
                    <Default_Text
                        text_align={'center'}
                        font_weight={'bold'}
                        font_size={text_font_size * 1.1}
                    >
                        {title}
                    </Default_Text>
                )
            }
            {
                is_number(psalm) && (
                    <Default_Text
                        text_align={'center'}
                        font_weight={'bold'}
                        font_size={text_font_size * 1.1}
                    >
                        Psalm {psalm}
                    </Default_Text>
                )
            }

            {is_string(meter) && (
                <Default_Text
                    text_align={'center'}
                    font_size={text_font_size * 0.8}
                >
                    Meter: {meter}
                </Default_Text>
            )}
        </Animated.View>
    ));
};

const psalter_key_extractor = (item, i) => i;

const render_psalter_text = (fade_anim, font_size) => ({ item, index }) => {
    const texts = (Array.isArray(item)) ? item.map((line, i) => {
        const line_to_render = (i === 0) ? `${index + 1}. ${line}` : line;

        return (
            <Default_Text 
                text_align={'center'}
                font_weight={'normal'}
                line_height={1.3}
                font_size={font_size}
                key={i}
            >
                {line_to_render}
            </Default_Text>
        )
    }) : item;

    const fade_in_style = {
        opacity: fade_anim
    };

    return (
        <Animated.View style={[styles.standard_margin_horizontal, styles.main_text_margin_top, fade_in_style]}>
            {texts}
        </Animated.View>
    )
};

export const on_psalter_change = (dispatch, next_val) => () => {
    if (!Number.isNaN(next_val)) {
        psalter_text_fade_anim.fade_in();

        setTimeout(() => {
            dispatch(lock_in(next_val));
            main_view_ref && main_view_ref.scrollToOffset({
                offset: 0,
                animated: true
            });
        }, 10);
        set_keyboard_toolbar(true);

        music_player.when_psalter_change(dispatch, `psalter_${next_val + 1}.mp3`)();
    }
};

const set_font_size = (dispatch) => (new_font_size) => {
    composer([
        set_new_font_size
        , dispatch
    ])(new_font_size);
    save_font_size(AsyncStorage, new_font_size);
};

const set_copy_share_btn_props = (dispatch) => (props) => {
    composer([
        set_copy_share_btn
        , dispatch
    ])(props);
}

const set_text_input_value = (dispatch, value) => {
    dispatch(psalter_text_input(value));
};


const input_text_handler = ({dispatch, psalters_count}) => (value) => {
    const max_val = psalters_count;
    const _value = value.trim();

    const value_int = parseInt(_value);
    const last_char_int = parseInt(_value.slice(-1));

    const toggle_text_as_valid_fn = () => dispatch(toggle_text_as_valid(true));

    if (_value !== "" && isNaN(last_char_int)) {
        set_text_input_value(dispatch, _value.slice(0, -1));
        dispatch(toggle_text_as_valid(false));
        string_input_error_alert(toggle_text_as_valid_fn);

    } else if (value_int > max_val || value_int < 1) {
        set_text_input_value(dispatch, _value.slice(0, -1));
        dispatch(toggle_text_as_valid(false));
        wrong_number_error_alert(max_val, toggle_text_as_valid_fn);


    } else if (value_int < 1) {
        set_text_input_value(dispatch, '');
        dispatch(toggle_text_as_valid(false));
        wrong_number_error_alert(max_val, no_op);

    } else if (_value === "") {
        dispatch(toggle_text_as_valid(false));
        set_text_input_value(dispatch, _value);

    } else {
        dispatch(toggle_text_as_valid(true));
        set_text_input_value(dispatch, _value);
    }
};


const end_text_input = (dispatch) => (text_is_valid) => (event) => {

    if (text_is_valid) {
        const input_int = parseInt(event.nativeEvent.text) - 1;
        on_psalter_change(dispatch, input_int)();
        set_text_input_value(dispatch, '');
    }
};

const num_input_set_can_search = (dispatch) => (can_search) => () => {
    dispatch(set_can_search(can_search));
};

const Number_input = (props) => {

    const keyboard_type = (Platform.OS === 'ios') ? 'number-pad' : 'numeric';
    const { psalters_count, value, dispatch, valid_text_input } = props;

    return (
        <TextInput keyboardType={keyboard_type}
            placeholder={`Psalter # (1 - ${psalters_count})`}
            placeholderTextColor={colors.grey}
            onEndEditing={end_text_input(dispatch)(valid_text_input)}
            maxLength={`${psalters_count}`.length}
            onChangeText={input_text_handler(props)}
            value={value}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            {...props} />
    );
};


const get_random_psalter = (dispatch, count) => () => {
    const random = Math.floor(Math.random() * count);
    on_psalter_change(dispatch, random)();
};

const more_stuff_list_header = () => {
    return (
        <View style={styles.more_stuff_list_header} />
    );
};


const Bottom_Buttons = (props) => {
    const action = () => {
        more_section_slide();
        setTimeout(() => Navigation.dismissOverlay('Overlay_Wrapper_Psalter'), 500);
    }

    return (
        <View style={styles.more_stuff_bottom_buttons_container}>
            <Rounded_Button on_press={action} screen_width={props.width}>
                <Default_Text text_align={'center'}>
                    I'm Done
                </Default_Text>
            </Rounded_Button>
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
        : (
            <Default_Text
                text_align={'center'}
                font_weight={'normal'}
                line_height={1.3}
                font_size={'default'}
                key={`ref-line-${index}`}
            >
                {psalm} - {item.text_array}
            </Default_Text>
        );

    return (
        <View style={styles.more_info_section_container}>
            <Default_Text 
                text_align={'center'}
                font_weight={'bold'}
                font_size={'x_large'}
            >
                {title}
            </Default_Text>
            <View style={styles.ref_text_container}>
                {texts}
            </View>
        </View>
    );
};

const count_section = ({ item }) => {
    const { title } = item;

    if (!is_string(title)) return null;
    return (
        <View style={styles.more_info_section_container}>
            <Default_Text 
                text_align={'center'}
                font_weight={'bold'}
                font_size={'x_large'}
            >
                {item.title}
            </Default_Text>
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
                <Default_Text 
                    text_align={'center'}
                    font_weight={'bold'}
                    font_size={'x_large'}
                >
                    {item.title}
                </Default_Text>
                {music_slider_array}
            </View>
        )
        : null;
};

const More_Stuff_Section_List = (props, {dispatch, psalter, sung_dates}) => {
    const psalter_music_source = (props.psalter_no)
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
                    title: is_number(props.sung_count) ? `Count: ${props.sung_count}` : ''
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
    const statusBarHeight = Navigation.constantsSync().statusBarHeight;
    const slide_down_view_dynamic_style = {
        width,
        height: height + statusBarHeight,
        bottom: Platform.OS === 'android' ? -statusBarHeight : 0,
        transform: [
            {
                translateY: props.more_section_slide_position
            }
        ]
    };

    return ( 
        <Animated.View style={[styles.slide_down_view_style, slide_down_view_dynamic_style]}>
            <SectionList ListHeaderComponent={more_stuff_list_header} style={[styles.more_section_list]}
                sections={sections} />
            <Bottom_Buttons width={width} />
        </Animated.View>
    );
};


const count_fn = () => {
    let current_no = 0;
    let timeout;

    const add_count = ({dispatch, psalter, sung_dates}, Date) => {
        const psalter_no = psalter.no;
        if (psalter_no !== null && psalter_no !== undefined && psalter_no !== current_no) {
            if (is_number(timeout)) clearTimeout(timeout);
            current_no = psalter_no;
            timeout = setTimeout(() => {
                const sung_dates_array = [Date.now(), ...sung_dates];

                AsyncStorage.setItem(`psalter-${psalter_no}`, JSON.stringify(sung_dates_array)).then((err) => {
                    if (!err) {
                        dispatch(set_sung_date(psalter_no, sung_dates_array));
                    }
                });

                clearTimeout(timeout);
            }, 14 * 1000);
        }
    };

    const clear_timeout = () => {
        clearTimeout(timeout);
    };

    return {
        add_count,
        clear_timeout
    };
};

const counter = count_fn();

const add_count = counter.add_count;


const search_results_animation = slide_side_animation(100, 18, Dimensions.get('window').width * -1.2);
const slide_right_pos = search_results_animation.animated_value;

const set_text_input_as_search = (dispatch, text_input_as_search) => () => {
    if (typeof text_input_as_search !== "boolean") return;
    return dispatch(set_input_as_search(!text_input_as_search));
};

const on_search_button_press = (dispatch, text_input_as_search) => () => {
    set_text_input_as_search(dispatch, text_input_as_search)();
    setTimeout(search_results_animation.slide, 100);
    set_keyboard_toolbar(text_input_as_search);
};

const get_psalter_for_search = (dispatch, input_int) => () => {
    on_search_button_press(dispatch, true)();
    on_psalter_change(dispatch, input_int)();
};

const used_the_wrong_text_input_regex = /^\d{1,3}$/;

const search_fn = (dispatch) => (event) => {
    const text = event.nativeEvent.text.trim();

    if (used_the_wrong_text_input_regex.test(text)) {
        perhaps_change_to_psalter_input_alert(text)
    }

    dispatch(search_psalter(text));
};


const Text_input_search = (props) => {
    const should_autofocus = !(Array.isArray(props.search_results) && props.search_results.length > 0);
    return (
        <TextInput placeholder={`SEARCH`}
            onEndEditing={search_fn(props.dispatch)}
            onChangeText={() => {
            }}
            placeholderTextColor={colors.grey}
            autoCorrect={false}
            returnKeyType={'search'}
            selectTextOnFocus={true}
            autoFocus={should_autofocus}
            autoCapitalize={'none'}
            underlineColorAndroid={'transparent'}
            {...props} />
    );
};

const Search_result_view = (props) => {
    const { width, height } = Dimensions.get('window');

    const statusBarHeight = is_iPhone_X ? native_elements.x_top_safe_area : native_elements.status_bar + Navigation.constantsSync().statusBarHeight;
    const bottomPadding = is_iPhone_X ? native_elements.x_bottom_safe_area : 0;

    const search_results_view_dynamic_style = {
        width: width - sizes.large * 2,
        height: height - statusBarHeight - native_elements.tab_bar - 37 - sizes.default * 2 - bottomPadding,
        top: statusBarHeight,
        transform: [
            {
                translateX: slide_right_pos
            }
        ]
    };

    const Search_r_view_header = (props) => {
        const search_results_count = (Array.isArray(props.search_results) && props.search_results.length > 0)
            ? `${props.search_results.length} `
            : '';

        return (
            <View style={{ marginTop: sizes.medium }}>
                <Default_Text 
                    text_align={'center'}
                    font_weight={'bold'}
                    font_size={'x_large'}
                >
                    {search_results_count} Search Results
                </Default_Text>
            </View>
        );
    };

    const search_result = (dispatch) => ({ item, index }) => {
        const text = item.search_result.map(({ text, style }, i) => {
            const key = `search-result-${index}-${i}`;
            const font_weight = (style === 'bold') ? 'bold' : 'normal';
            const color = (style === 'bold')
                ? {
                    color: colors.blue
                }
                : undefined;

            return <Default_Text style={color} key={key} font_weight={font_weight}>{text}</Default_Text>;
        });

        return (
            <TouchableHighlight style={{ marginVertical: sizes.large, marginHorizontal: sizes.large }}
                onPress={get_psalter_for_search(dispatch, item.index)}>
                <View >
                    <Default_Text font_size={font_sizes.large} text_align={'center'}>{item.title}</Default_Text>
                    <Default_Text>
                        {text}
                    </Default_Text>
                </View>
            </TouchableHighlight>
        );
    };

    const search_results_key_extractor = (item, index) => `search-results-${index}`;
    const search_results_separator = (width) => ({ highlighter }) => <View
        style={[styles.search_results_separator, { width: Math.floor(width * 0.5) }]} />;

    return (<Animated.View style={[styles.search_results_view, search_results_view_dynamic_style]}>
        <FlatList ListHeaderComponent={<Search_r_view_header search_results={props.search_results} />}
            data={props.search_results}
            renderItem={search_result(props.dispatch)}
            keyExtractor={search_results_key_extractor}
            ItemSeparatorComponent={search_results_separator(width)} />

    </Animated.View>)
};

const on_bible_tab_select = ({dispatch, psalter}) => {
    dispatch(get_bible_passage(18, psalter.psalm - 1));
};

const on_pdf_tab_select = () => {
    set_keyboard_toolbar(true)
};

const on_action = (actions_array) => () => {
    actions_array.map((action) => action());
};

const longPressFns = long_press_actions();


const repopulateDataFiles = (instance) => (keyJsonStringsMapped) => {

    const keyMap = {
        'PsalterJSON': psalter_init
        , 'Bible-KJV': get_bible_init
        , 'Credits-Texts': credits_texts_init
        , 'Neglected-Texts': neglected_texts_init
        , 'Neglected-Alert-Texts': neglected_alert_texts_init
        , 'PsalterSearchJSON': psaltersearchjson_init
    };
    const { dispatch, creeds } = instance.props;
    keyJsonStringsMapped
        .filter(([key]) => keyMap[key])
        .forEach(([key, json_string]) => {
            const set_function = keyMap[key];
            const json = JSON.parse(json_string);

            if (set_function) {
                dispatch(set_function(json));
            } else {
                console.log('no set function:', key, set_function);
            }

        });
    const documents = {
        ...creeds.documents
    };
    const creedsToBeUpdated = keyJsonStringsMapped
        .filter(([key]) => creeds.documents && creeds.documents[key]);
    if (creedsToBeUpdated.length > 0) {
        creedsToBeUpdated.forEach(([key, json_string]) => {
            documents[key] = JSON.parse(json_string);
        });
        dispatch(creeds_forms_library_init(documents));
    }
};

const key_is_bible = key => key === 'Bible-KJV';

const get_bible_storage_keys_content = (key, bible_string) => {
    const divisions = 4;
    const segment_length = ~~(bible_string.length / divisions);
    const slice_index = Array.from({ length: divisions }, (_, i) => i * segment_length);
    const bible_key_map = slice_index.map((currIndex, i, arr) => {
        return [`${key}${i}`, bible_string.slice(currIndex, arr[i + 1])]
    });
    return bible_key_map;
};

const version_storage_key = 'version';

const get_online_version_compare_and_update_data = (local_version) => (online_version) => {
    const promise = new Promise((resolve, reject) => {
        if (online_version.version.version !== local_version.version.version) {

            const update_keys = Object.keys(online_version)
                .filter((key) => {
                    return key !== 'version' && online_version[key].version > (local_version[key] || {}).version
                });

            // alert
            new_data_present_alert(() => {
                const requests = update_keys
                    .map((key) => fetch(online_version[key].url)
                        .then(res => res.text()));
                Promise.all(requests)
                    .then((responses) => {
                        const key_responses_mapped = update_keys
                            .map((key, index) => [key, responses[index]]);

                        let key_responses_to_save = key_responses_mapped.filter(composer([key_is_bible, not]));

                        const bible_key_index = update_keys.findIndex(key_is_bible);
                        if (~bible_key_index) {
                            const bible_storage_keys_content = get_bible_storage_keys_content(update_keys[bible_key_index], responses[bible_key_index]);
                            key_responses_to_save = key_responses_to_save.concat(bible_storage_keys_content);
                        }

                        AsyncStorage.multiSet(key_responses_to_save).then(() => {
                            AsyncStorage.setItem(version_storage_key, JSON.stringify(online_version)).catch(console.err);
                        });
                        resolve(key_responses_mapped);
                    })
                    .catch(err => console.error(err));
            })(update_keys.length);
        } else {
            resolve([]);
        }
    });
    return promise;
};

const get_version_file_compare_and_save_updated = () => {
    return AsyncStorage.getItem(version_storage_key)
        .then((string) => {
            return JSON.parse(string) || require('../../../data/version');
        })
        .then((local_version) => {
            return fetch(local_version.version.url)
                .then(res => res.json())
                .then(get_online_version_compare_and_update_data(local_version))
                .catch(console.error)
        })
        .catch(console.error)
};

/**
 *
 *
 *
 * **/
let shakeSubscription;
let bottomTabEventListener;
class App extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        
        bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
            if (unselectedTabIndex === 0) {
                if (selectedTabIndex === 1) {
                    on_pdf_tab_select()
                } else if (selectedTabIndex === 3) {
                    if (is_number(this.props.psalter.psalm)) {
                        on_bible_tab_select(this.props)
                    }
                } else if (selectedTabIndex !== 0) {
                    counter.clear_timeout();
                }
            }
        });

// Unsubscribe

        AsyncStorage.getItem(font_size_key)
            .then(font_size => {
                composer([
                    parseFloat,
                    set_new_font_size
                    , this.props.dispatch
                ])(font_size);
            })

        const RNShake = require('react-native-shake').default;
        const storage_psalter_key = 'PsalterJSON';
        AsyncStorage.getItem(storage_psalter_key)
            .then(json_string => {
                const psalter_json = JSON.parse(json_string) || require('../../../data/PsalterJSON.json');

                this.props.dispatch(psalter_init(psalter_json));

                const psalters_count = psalter_json.length;

                shakeSubscription = RNShake.addListener(get_random_psalter(this.props.dispatch, psalters_count));
                // AsyncStorage.clear(); // for dev only
                const count_all_keys_array = Array.from(new Array(psalters_count), (item, index) => `psalter-${index + 1}`);

                AsyncStorage.multiGet(count_all_keys_array).then((arr) => {
                    const arr_w_value = arr
                        .filter(([key, value]) => is_string(value))
                        .map(([key, value]) => [key, JSON.parse(value)]);

                    this.props.dispatch(set_sung_count_all(arr_w_value || []));
                });
            })
            .catch(err => {
                console.error(err);
            });

        const psalter_search_json_storage_key = 'PsalterSearchJSON';
        AsyncStorage.getItem(psalter_search_json_storage_key)
            .then(json_string => {
                const json = JSON.parse(json_string) || require('../../../data/PsalterSearchJSON.json');
                this.props.dispatch(psaltersearchjson_init(json));
            })
            .catch(err => console.error('get Psalter Search Json Error with error:', err));


        // heartbeat(this.props.navigator);

        AsyncStorage.getItem('informed_connection').then((informed) => {
            if (!informed) {
                new_over_the_air_update_alert(() => {
                    AsyncStorage.setItem('informed_connection', '1')
                    get_version_file_compare_and_save_updated().then(repopulateDataFiles(this));
                })
            } else {
                get_version_file_compare_and_save_updated().then(repopulateDataFiles(this));
            }
        });
        set_keyboard_toolbar(true);
    }


    componentWillUnmount() {
        shakeSubscription && shakeSubscription.remove()
        bottomTabEventListener && bottomTabEventListener.remove();
    }

    render() {
        const {
            dispatch
            , navigator
            , psalter
            , index
            , psalters_count
            , can_search
            , psalter_text_input
            , valid_text_input
            , sung_dates
            , text_input_as_search
            , psalter_search_results
            , text_font_size
            , copy_share_btn_props
        } = this.props;

        add_count(this.props, Date);

        const music_slider_w_data = music_slider(this.props);

        const num_input_set_can_search_w_dispatch = num_input_set_can_search(dispatch);

        const num_input_on_blur_actions_array = [
            num_input_set_can_search_w_dispatch(true)
        ];

        const scroll_swipe_actions_loaded = Platform.OS === 'android'
            ? scroll_swipe_actions(on_psalter_change(dispatch, index + 1), on_psalter_change(dispatch, index - 1))
            : no_op;

        const get_text_input = (text_input_as_search) => {
            if (Platform.OS === 'ios') {
                return (text_input_as_search)
                    ? <Text_input_search
                        dispatch={dispatch}
                        style={[styles.text_input_style]}
                        valid_text_input={true}
                        search_results={psalter_search_results}
                         />

                    : <Number_input psalters_count={psalters_count}
                        value={psalter_text_input}
                        dispatch={dispatch}
                        style={[styles.text_input_style]}
                        valid_text_input={valid_text_input}
                        onBlur={on_action(num_input_on_blur_actions_array)}
                        onFocus={num_input_set_can_search_w_dispatch(false)} />

            } else if (Platform.OS === 'android') {
                return (text_input_as_search)
                    ? <Text_input_search dispatch={dispatch}
                        style={[styles.text_input_style]}
                        valid_text_input={true} />

                    : <Number_input psalters_count={psalters_count}
                        value={psalter_text_input}
                        dispatch={dispatch}
                        style={[styles.text_input_style]}
                        valid_text_input={valid_text_input} />
            }
        };

        const set_font_size_wo_font_size = set_font_size(dispatch);

        const one_third_screen_width = Math.round(Dimensions.get('window').width / 3);

        const [swipe_prev_action, swipe_next_action] = [-1, 1].map((change_by) => on_psalter_change(dispatch, index + change_by));
        const touch_release_actions_loaded = touch_release_actions(swipe_prev_action, swipe_next_action, longPressFns.onPanResponderRelease(), one_third_screen_width);

        const set_copy_share_btn_props_loaded = set_copy_share_btn_props(dispatch);
        const touch_actions = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: longPressFns.onPanResponderGrant(),
            onPanResponderMove: longPressFns.onPanResponderMove((e) => {
                set_copy_share_btn_props_loaded({
                    top: e.nativeEvent.pageY
                    , left: e.nativeEvent.pageX
                    , isHidden: false
                });
            })(() => {
                if (!copy_share_btn_props.isHidden) {
                    set_copy_share_btn_props_loaded();
                }
            }),
            onPanResponderRelease: touch_release_actions_loaded
        });

        const Floating_Header = _Floating_Header(this.props);

        const More_Stuff_Section_List_Component = (
            <More_Stuff_Section_List
                    dispatch={dispatch}
                    more_section_slide_position={more_section_slide_animation.animated_value}
                    psalter_refs={psalter.ref}
                    psalm={psalter.psalm}
                    psalter_no={psalter.no}
                    sung_count={is_array(sung_dates) ? sung_dates.length : NaN}
                    music_slider={music_slider_w_data} />
            );

        Navigation.updateProps('Overlay_Wrapper_Psalter', {
            children: More_Stuff_Section_List_Component
        });

        return (
            <Default_Bg>
                <Search_result_view search_results={psalter_search_results}
                    dispatch={dispatch}
                    navigator={navigator} />

                <FlatList data={psalter.content}
                    scrollEventThrottle={300}
                    onScroll={flatlist_on_scroll(this.props)}
                    ListHeaderComponent={header(this.props)(psalter_text_fade_anim.fade_opacity)}
                    renderItem={render_psalter_text(psalter_text_fade_anim.fade_opacity, text_font_size)}
                    keyExtractor={psalter_key_extractor}
                    onScrollBeginDrag={flatlist_on_scroll_begin(this.props)}
                    onScrollEndDrag={scroll_swipe_actions_loaded}
                    ref={ref => main_view_ref = ref}
                    contentInsetAdjustmentBehavior={"never"}
                    {...touch_actions.panHandlers} />

                {Floating_Header}

                <FontSlider value={text_font_size} onSlidingComplete={set_font_size_wo_font_size} />

                {!copy_share_btn_props.isHidden &&
                    (<Copy_Share_Tooltip
                        onPress={() => {
                            set_copy_share_btn_props_loaded();
                            Navigation.showModal(show_misc_actions_modal_obj(MISC_ACTION_TEXT_TYPES.PSALTER));
                        }}
                        onCancel={() => {
                            set_copy_share_btn_props_loaded();
                        }}
                        top={copy_share_btn_props.top - 2 * sizes.x_large}
                        left={copy_share_btn_props.left - 50} />)
                }

                <View style={{
                    bottom: 0
                    , zIndex: zIndex.small
                    , flexDirection: 'row'
                    , alignItems: 'center'
                    , justifyContent: 'space-between'
                    , paddingHorizontal: sizes.large
                    , paddingVertical: sizes.default
                }}>

                    {get_text_input(text_input_as_search)}

                    <TouchableHighlight style={styles.bottom_button_container}
                        onPress={on_search_button_press(dispatch, text_input_as_search)}
                        underlayColor={colors.dark_cerulean}
                        disabled={!can_search}>
                        {(can_search)
                            ? <Image style={styles.button_std}
                                source={require('../../../images/icons/icon-search.png')} />

                            : <Image style={styles.button_std}
                                source={require('../../../images/icons/icon-search-grey.png')} />
                        }
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.bottom_button_container}
                        onPress={() => {
                            Navigation.showOverlay({
                                component: {
                                    id: 'Overlay_Wrapper_Psalter',
                                    name: 'Overlay_Wrapper',
                                    passProps: {
                                        children: More_Stuff_Section_List_Component
                                    }
                                }
                            });
                            setTimeout(() => {
                                more_section_slide();
                            }, 50);
                        }}
                        underlayColor={colors.dark_cerulean}>
                        <Image style={styles.button_std} source={require('../../../images/icons/icon-info.png')} />

                    </TouchableHighlight>
                </View>
            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        psalter: state.psalter.content
        , index: state.psalter.index
        , psalters_count: state.psalter.psalters_count
        // state reducer
        , can_search: state.psalter_can_search
        , psalter_text_input: state.psalter_text_input
        , valid_text_input: state.valid_text_input
        , sung_dates: state.psalter.current_sung_dates
        , sung_dates_all: state.psalter.all_sung_dates
        , current_music_timer: state.music_timer.current
        , max_music_timer: state.music_timer.max
        , text_input_as_search: state.text_input_as_search
        , text_font_size: state.text_font_size
        , copy_share_btn_props: state.copy_share_btn_props
        , scroll_details: state.psalter_scroll_details
        //search reducer
        , psalter_search_results: state.psalter_search_results.search_results
        // tab reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
        // creeds
        , creeds: state.creeds
    };
}


export default connect(mapStateToProps, null)(App);
