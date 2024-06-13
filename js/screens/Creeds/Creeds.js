import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { set_keyboard_toolbar } from '../../utils/keyboard';
import {
    View
    , FlatList
    , Animated
    , Dimensions
    , TouchableHighlight
    , Image
    , TextInput
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SegmentedButtons from '../../common/Segmented-Buttons';

import styles from './Creeds.styles';
import {
    colors,
    sizes,
    font_sizes,
    is_iPhone_X,
    native_elements
} from '../../common/common.styles';

import {
    Default_Text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';

import {
    creeds_images_array,
    scenary_images_array,
    churches_images_array,
    confessions_book_cover
} from '../../utils/images';

import {
    bounce_animation,
    slide_side_animation
} from '../../utils/animation';

import {
    select_creeds_or_forms
} from '../../redux/actions/state-actions';

import {
    creeds_forms_library_init
    , lock_in_creed
    , lock_in_creed_level_2
    , lock_in_creed_body
} from '../../redux/actions/creeds-actions';

import {
    creeds_search_json_init
    , search_creeds
} from '../../redux/actions/search-actions';

import { no_op, is_number } from '../../utils/functions';
import { CREEDS_COUNT } from '../../common/constants';

let search_result_flatlist_ref;
let text_input_ref;

const list_header_component_wo_animated_val = (book_animated_value) => ({ images, selected_index }) => {

    const { height, width } = Dimensions.get('window');
    const {
        creeds_images_array,
        scenary_images_array
    } = images;

    const container_style = {
        height: height / 3.2,
        width
    };

    const image_style = {
        width: width,
        height: height / 3.2
    };

    const img_mask_style = {
        width,
        height: height / 3.2,

    };

    if (selected_index === 0) {

        const image = creeds_images_array[Math.floor(Math.random() * creeds_images_array.length)];

        const creeds_book_style = {
            transform: [
                { translateY: book_animated_value }
            ]
        };

        const header_title_container_x_style = {
            maxWidth: width * (2 / 3) - sizes.x_large
        };

        return (
            <View style={[styles.header_container, container_style]}>
                <Image source={image} style={[styles.header_image, image_style]} resizeMode={'cover'} />
                <View style={[styles.header_img_mask, img_mask_style]} />
                <View style={[styles.header_title_container, header_title_container_x_style]}>
                    <Default_Text font_family={'Durwent'} font_size={font_sizes.xxxxxx_large}>THE</Default_Text>
                    <Default_Text font_family={'Durwent'} font_size={font_sizes.xxxx_large}>REFORMED</Default_Text>
                    <Default_Text font_family={'Durwent'} font_size={font_sizes.xx_large}>CONFESSIONS</Default_Text>
                </View>
                <Animated.View style={[styles.header_book_container]}>
                    <Animated.Image source={confessions_book_cover} style={[styles.book, creeds_book_style]} />
                </Animated.View>
            </View>
        );

    } else if (selected_index === 1) {

        const forms_book_style = {
            transform: [
                { translateY: book_animated_value }
            ]
        };

        const image = scenary_images_array[Math.floor(Math.random() * scenary_images_array.length)];
        return (
            <View style={[styles.header_container, container_style]}>
                <Image source={image} style={[styles.header_image, image_style]} resizeMode={'cover'} />
                <View style={[styles.header_img_mask, img_mask_style]} />
                <View style={styles.header_book_container_forms}>
                    <Animated.Image source={confessions_book_cover} style={[styles.book, styles.forms_book, forms_book_style]} />
                </View>

                <View style={styles.header_forms_title_container}>
                    <Default_Text font_family={'Durwent'} font_size={font_sizes.xxxxxx_large}>THE</Default_Text>
                    <Default_Text font_family={'Durwent'} font_size={font_sizes.xxxx_large}>REFORMED</Default_Text>
                    <Default_Text font_family={'Durwent'} font_size={font_sizes.xxx_large}>FORMS</Default_Text>
                </View>
            </View>
        );
    }
};

const book_image_bounce_animation = bounce_animation(1000, 3, 25, -48);
const book_img_animated_value = book_image_bounce_animation.animated_value;
const list_header_component = list_header_component_wo_animated_val(book_img_animated_value);


const select_book = (componentId, dispatch, library_type_index, selected_index, levels_deep) => () => {
    //select book index
    dispatch(lock_in_creed(library_type_index, selected_index, levels_deep));
    Navigation.push(componentId, {
        component: {
            name: 'Creeds_Categories',
            options: {
                topBar: {
                    visible: true,
                    drawBehind: true,
                    backButton: {
                        title: (library_type_index === 0) ? 'Creeds' : 'Forms',
                        showTitle: true
                    }
                }
    
            }
        },
    });
};

const creeds_menu_renderer = ({ componentId, dispatch, images, selected_index: library_type_index  }) => ({ item, index }) => {
    const { width } = Dimensions.get('window');
    const should_margin_left = (index % 2 > 0);

    const get_image = (library_type_index, i) => {

        if (library_type_index === 0) {
            if (i === 0 || i === 1 || i === 2) {
                return images.creeds_images_array[i];
            }
        }

        return images.churches_images_array[Math.floor(Math.random() * images.churches_images_array.length)];
    };

    const image = get_image(library_type_index, index);

    const library_selection_style = {
        marginLeft: (should_margin_left) ? sizes.large : 0,
        width: width / 2 - sizes.x_large,
        height: width / 2 - sizes.x_large
    };

    const library_selection_image_style = {
        width: width / 2 - sizes.x_large,
        height: width / 2 - sizes.x_large,
    };

    const text_container_style = {
        width: width / 2 - sizes.x_large,
        height: width / 2 - sizes.x_large,
    };


    return (
        <TouchableHighlight underlayColor={'transparent'}
            style={[styles.library_selection, library_selection_style]}
            onPress={select_book(componentId, dispatch, library_type_index, index, item.levels_deep)}>
            <View>
                {
                    image && <Image source={image} style={[styles.library_selection_image, library_selection_image_style]} />
                }
                <View style={[styles.library_selection_image, styles.library_selection_mask, library_selection_image_style]} />
                <View style={[styles.library_text_container, text_container_style]}>
                    <Default_Text text_align={'center'} font_size={'x_large'}>{item.title}</Default_Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const creeds_menu_flatlist = (renderer, {library_type_index, creeds_library}) => {


    const creeds_menu_key_ext = (item, index) => `creeds-menu-${item.title}-${index}`;

    const ListFooterComponent = () => {
        return (
            <View style={styles.footer_component} />
        );
    };

    return (
        <FlatList
            data={creeds_library[library_type_index]}
            renderItem={renderer}
            numColumns={2}
            keyExtractor={creeds_menu_key_ext}
            columnWrapperStyle={[styles.column_wrapper]}
            contentContainerStyle={styles.flatlist_container}
            ListFooterComponent={ListFooterComponent}>
        </FlatList>
    );
};

const select_tab = (dispatch, index) => () => {
    dispatch(select_creeds_or_forms(index));
    setTimeout(() => {
        book_image_bounce_animation.bounce();
    }, 0)
};

const creeds_or_forms_chooser = ({ dispatch, selected_index }) => {
    const { width } = Dimensions.get('window');
    const buttons = [
        {text: 'Confessions', on_press: select_tab(dispatch, 0)},
        {text: 'Forms', on_press: select_tab(dispatch, 1)}
    ];

    return (
        <View style={{
            position: 'absolute',
            bottom: sizes.medium
        }}>
            {
                SegmentedButtons(
                    Math.floor(width * 2 / 3), 
                    buttons,
                    undefined,
                    selected_index
                )
            }
        </View>
    );

};

const search_results_animation = slide_side_animation(100, 18, Dimensions.get('window').width * -1.2);
const slide_right_pos = search_results_animation.animated_value;

const search_button_action = () => {
    if (text_input_ref && text_input_ref.isFocused()) {
        text_input_ref.blur();
    }
    search_results_animation.slide()
};

const search_button = (action = no_op) => {
    return (
        <TouchableHighlight
            style={[styles.bottom_button_container]}
            onPress={action}
            underlayColor={'transparent'}
        >
            <Image style={styles.button_std}
                source={require('../../../images/icons/icon-search.png')} />
        </TouchableHighlight>
    )
};

const on_press_creed_search = (props, item) => () => {
    let tabIndex = props.tab_bar_selected_index;
    if (item.type === 'Creeds') {
        tabIndex = 0;
    } else if (item.type === 'Forms') {
        tabIndex = 1;
    }

    const index = item.index >= CREEDS_COUNT
        ? item.index - CREEDS_COUNT
        : item.index;

    const { dispatch } = props;

    let levels_deep = 1;
    if (is_number(item.subIndex)) {
        levels_deep = 2;
        dispatch(lock_in_creed_level_2(tabIndex, index, item.chIndex));
    }

    dispatch(lock_in_creed(tabIndex, index, levels_deep));
    dispatch(lock_in_creed_body(tabIndex, index, item.chIndex, item.subIndex));
    Navigation.push(props.componentId, {
        component: {
            name: 'Creeds_Text',
            options: {
                topBar: {
                    visible: true,
                    drawBehind: true,
                    backButton: {
                        title: 'Chapters',
                        showTitle: true
                    }
                }
            }
        }
    });

    select_tab(props.dispatch, tabIndex)();

}

const search_results = (props) => {
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

    const search_result = ({ item, index }) => {
        const text = item.search_result.map(({ text, style }, i) => {
            const key = `search-result-${index}-${i}`;
            const font_weight = (style === 'bold') ? 'bold' : 'normal';
            const color = (style === 'bold')
                ? {
                    color: colors.blue
                }
                : undefined;

            return (
                <Default_Text style={color} key={key} font_weight={font_weight}>
                    {text}
                </Default_Text>
            );
        });


        return (
            <TouchableHighlight style={{ marginVertical: sizes.large, marginHorizontal: sizes.large }}
                onPress={on_press_creed_search(props, item)}>
                <View >
                    <Default_Text font_size={font_sizes.large} text_align={'center'}>{item.title}</Default_Text>
                    <Default_Text font_size={font_sizes.x_small} text_align={'center'}>{item.header}</Default_Text>
                    <Default_Text>
                        {text}
                    </Default_Text>
                </View>
            </TouchableHighlight>
        );
    };

    const search_results_key_extractor = (item, index) => `${item.index}${item.chIndex}${item.subIndex}${index}`;
    const search_results_separator = (width) => () => (
        <View style={[styles.search_results_separator, { width: Math.floor(width * 0.5) }]} />
    );

    return (
        <Animated.View style={[styles.search_results, search_results_view_dynamic_style]}>
            <FlatList
                ref={ref => search_result_flatlist_ref = ref}
                ListHeaderComponent={<Search_r_view_header search_results={props.creeds_search_results} />}
                data={props.creeds_search_results}
                renderItem={search_result}
                keyExtractor={search_results_key_extractor}
                ItemSeparatorComponent={search_results_separator(width)} />
        </Animated.View>
    )
}



const text_input = (action = no_op) => {
    return (
        <Animated.View style={[styles.text_input_container, {
            transform: [
                {
                    translateX: slide_right_pos
                }
            ]
        }]}>
            <TextInput
                ref={ref => text_input_ref = ref}
                placeholder={`SEARCH`}
                style={[styles.text_input_style]}
                placeholderTextColor={colors.grey}
                onEndEditing={action}
                autoCorrect={false}
                returnKeyType={'search'}
                selectTextOnFocus={true}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
            />
        </Animated.View>
    )
};

const onTextInputAction = (props) => (e) => {
    const text = e.nativeEvent.text || '';
    props.dispatch(search_creeds(text.trim()));
    if (search_result_flatlist_ref) {
        search_result_flatlist_ref.scrollToOffset({
            offset: 0
        });
    }
}
let bottomTabEventListener;
class Creeds extends Component {

    componentDidAppear() {
        book_image_bounce_animation.bounce();
        
    }

    componentDidMount() {
        AsyncStorage.removeItem('Formula-of-Subscription-(PRCA)');
        AsyncStorage.multiGet(this.props.title_order).then(stringArray /* [[key, string]] */ => {
            const creedsForms = {
                'The-Heidelberg-Catechism(by-LD)': JSON.parse(stringArray[0][1]) || require('../../../data/The-Heidelberg-Catechism(by-LD).json')
                , 'The-Belgic-Confession': JSON.parse(stringArray[1][1]) || require('../../../data/The-Belgic-Confession.json')
                , 'The-Canons-of-Dordt': JSON.parse(stringArray[2][1]) || require('../../../data/The-Canons-of-Dordt.json')
                , 'The-Apostles-Creed': JSON.parse(stringArray[3][1]) || require('../../../data/The-Apostles-Creed.json')
                , 'The-Nicene-Creed': JSON.parse(stringArray[4][1]) || require('../../../data/The-Nicene-Creed.json')
                , 'The-Athanasian-Creed': JSON.parse(stringArray[5][1]) || require('../../../data/The-Athanasian-Creed.json')
                , 'The-Creed-of-Chalcedon': JSON.parse(stringArray[6][1]) || require('../../../data/The-Creed-of-Chalcedon.json')
                , 'Form-for-the-Administration-of-Baptism': JSON.parse(stringArray[7][1]) || require('../../../data/Form-for-the-Administration-of-Baptism.json')
                , 'Form-for-Public-Confession-of-Faith': JSON.parse(stringArray[8][1]) || require('../../../data/Form-for-Public-Confession-of-Faith.json')
                , 'Form-for-the-Administration-of-the-Lords-Supper': JSON.parse(stringArray[9][1]) || require('../../../data/Form-for-the-Administration-of-the-Lords-Supper.json')
                , 'Form-for-Excommunication': JSON.parse(stringArray[10][1]) || require('../../../data/Form-for-Excommunication.json')
                , 'Form-for-Readmitting-Excommunicated-Persons': JSON.parse(stringArray[11][1]) || require('../../../data/Form-for-Readmitting-Excommunicated-Persons.json')
                , 'Form-of-Ordination-(or-Installation)-of-Ministers-of-Gods-Word': JSON.parse(stringArray[12][1]) || require('../../../data/Form-of-Ordination-(or-Installation)-of-Ministers-of-Gods-Word.json')
                , 'Form-of-Ordination-of-Elders-and-Deacons': JSON.parse(stringArray[13][1]) || require('../../../data/Form-of-Ordination-of-Elders-and-Deacons.json')
                , 'Form-for-the-Installation-of-Professors-of-Theology': JSON.parse(stringArray[14][1]) || require('../../../data/Form-for-the-Installation-of-Professors-of-Theology.json')
                , 'Form-for-the-Ordination-(or-Installation)-of-Missionaries': JSON.parse(stringArray[15][1]) || require('../../../data/Form-for-the-Ordination-(or-Installation)-of-Missionaries.json')
                , 'Form-for-the-Confirmation-of-Marriage-before-the-Church': JSON.parse(stringArray[16][1]) || require('../../../data/Form-for-the-Confirmation-of-Marriage-before-the-Church.json')
                , 'Formula-of-Subscription-(RPC)': JSON.parse(stringArray[17][1]) || require('../../../data/Formula-of-Subscription-(RPC).json')
                , 'The-Church-Order': JSON.parse(stringArray[18][1]) || require('../../../data/The-Church-Order.json')
            };

            this.props.dispatch(creeds_forms_library_init(creedsForms));
        }).catch(errArray => {
            Array.isArray(errArray)
                ? errArray.forEach(([key, err]) => console.log(key, err))
                : console.log(errArray);
        });

        AsyncStorage.getItem(this.props.creeds_search_file)
            .then(content_str => {
                const creeds_search_json = JSON.parse(content_str) || require('../../../data/CreedsSearchJSON.json');
                this.props.dispatch(creeds_search_json_init(creeds_search_json))
            })
            .catch(err => {
                console.log(err);
            })

        bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex }) => {
            if (selectedTabIndex === 2) {
                book_image_bounce_animation.bounce();
                set_keyboard_toolbar(false);
            } else {
                set_keyboard_toolbar(true);
            }
        });
    }

    componentWillUnmount() {
        if (bottomTabEventListener) {
            bottomTabEventListener.remove();
        }
    }



    render() {
        const {
            dispatch
            , library_type_index
            , creeds_library
            , componentId
        } = this.props;

        const component_obj = {
            images: {
                creeds_images_array,
                scenary_images_array,
                churches_images_array
            },
            componentId: componentId,
            dispatch: dispatch,
            selected_index: library_type_index
        };

        const creeds_menu_renderer_loaded = creeds_menu_renderer(component_obj);

        return (
            <Default_Bg style={styles.default_bg} >

                {list_header_component(component_obj)}
                {creeds_library && creeds_menu_flatlist(creeds_menu_renderer_loaded, this.props)}
                {creeds_or_forms_chooser(component_obj)}
                {search_button(search_button_action)}
                {search_results(this.props)}
                {text_input(onTextInputAction(this.props))}
            </Default_Bg>
        );
    }
};


function mapStateToProps(state) {
    return {
        title_order: state.creeds.title_order
        , creeds_search_file: state.creeds.creeds_search_file
        , library_type_index: state.creeds_library_type_index
        , creeds_library: state.creeds.creeds_library
        , tab_bar_selected_index: state.tab_bar_selected_index
        , creeds_search_results: state.creeds_search_results.search_results

    };
}

export default connect(mapStateToProps, null)(Creeds);
