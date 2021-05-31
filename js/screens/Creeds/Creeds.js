import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Dimensions
    , Platform
    , TouchableHighlight
    , Image
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { navigator_style_push, hide_tabs_action } from '../../../Navigator-Common'

import styles from './Creeds.styles';
import {
    colors,
    sizes,
    font_sizes,
} from '../../common/common.styles';

import {
    Default_Text,
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';

import {
    creeds_images_array,
    scenary_images_array,
    churches_images_array,
    confessions_book_cover
} from '../../utils/images';

import {
    bounce_animation
} from '../../utils/animation';

import {
    select_creeds_or_forms
} from '../../redux/actions/state-actions';

import {
    creeds_forms_library_init
    , lock_in_creed
} from '../../redux/actions/creeds-actions';

const list_header_component_wo_animated_val = (book_animated_value) => ({random, styles, images, Dimensions}) => (selected_index) => {

    const {height, width} = Dimensions.get('window');
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

        const image = creeds_images_array[Math.floor(random() * creeds_images_array.length)];

        const creeds_book_style = {
            transform: [
                {translateY: book_animated_value}
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
                {translateY: book_animated_value}
            ]
        };

        const image = scenary_images_array[Math.floor(random() * scenary_images_array.length)];
        return (
            <View style={[styles.header_container, container_style]}>
                <Image source={image} style={[styles.header_image, image_style]} resizeMode={'cover'}/>
                <View style={[styles.header_img_mask, img_mask_style]}/>
                <View style={styles.header_book_container_forms}>
                    <Animated.Image source={confessions_book_cover} style={[styles.book, styles.forms_book, forms_book_style]}/>
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

const book_image_bounce_animation = bounce_animation(1000)(3)(25)(-48);
const book_img_animated_value = book_image_bounce_animation.animated_value;
const list_header_component = list_header_component_wo_animated_val(book_img_animated_value);


const select_book = (navigator) => (dispatch) => (library_type_index) => (selected_index) => (levels_deep) => () => {
    //select book index
    dispatch(lock_in_creed(library_type_index)(selected_index)(levels_deep));
    navigator.push({
        screen: 'Creeds_Categories',
        navigatorStyle: navigator_style_push,
        backButtonTitle: (library_type_index === 0) ? 'Creeds' : 'Forms'
    });
};

const creeds_menu_renderer = ({navigator, dispatch, random, images, Dimensions}) => (library_type_index) => ({item, index}) => {
    const {width}    = Dimensions.get('window');
    const should_margin_left = (index % 2 > 0);

    const get_image = (library_type_index) => (i) => {

        if (library_type_index === 0) {
            if (i === 0 || i === 1 || i === 2) {
                return images.creeds_images_array[i];
            }
        }

        return images.churches_images_array[Math.floor(random() * images.churches_images_array.length)];
    };

    const image = get_image(library_type_index)(index);

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
                            onPress={select_book(navigator)(dispatch)(library_type_index)(index)(item.levels_deep)}>
            <View>
                <Image source={image} style={[styles.library_selection_image, library_selection_image_style]}/>
                <View style={[styles.library_selection_image, styles.library_selection_mask, library_selection_image_style]}/>
                <View style={[styles.library_text_container, text_container_style]}>
                    <Default_Text text_align={'center'} font_size={'x_large'}>{item.title}</Default_Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const creeds_menu_flatlist = (renderer) => (library_type_index) => (library) => {


    const creeds_menu_key_ext = (item, index) => `creeds-menu-${item.title}-${index}`;

    const ListFooterComponent = (styles) => () => {
        return (
            <View style={styles.footer_component} />
        );
    };

    return (
        <FlatList
            data={library[library_type_index]}
            renderItem={renderer}
            numColumns={2}
            keyExtractor={creeds_menu_key_ext}
            columnWrapperStyle={[styles.column_wrapper]}
            contentContainerStyle={styles.flatlist_container}
            ListFooterComponent={ListFooterComponent(styles)}>
        </FlatList>
    );
};

const select_tab = (dispatch) => (index) => () => {
    dispatch(select_creeds_or_forms(index));
    book_image_bounce_animation.bounce();
};

const creeds_or_forms_chooser = ({ dispatch, Dimensions, os }) => (library_type_index) => {
    const { width, height } = Dimensions.get('window');
    const creeds_chooser_style = {
        width: Math.floor(width * 2 / 3),
    };

    const button_renderer = (dispatch) => (os) => (_library_type_index) => (text, index) => {
        const is_selected = (index === _library_type_index);
        const bg_color_obj = { backgroundColor: (is_selected) ? colors.blue : 'transparent' };
        const underlay_color = (is_selected) ? colors.dark_cerulean : 'transparent';
        const key = `library-chooser-${text}-${index}`;

        return (
            <TouchableHighlight key={key}
                style={[{ flex: 1 }, bg_color_obj]}
                underlayColor={underlay_color}
                onPress={select_tab(dispatch)(index)}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Default_Text text_align={'center'}>
                        {text}
                    </Default_Text>
                </View>
            </TouchableHighlight>
        );
    };

    const buttons = [
        'Confessions',
        'Forms'
    ].map(button_renderer(dispatch)(os)(library_type_index));

    return (
        <View style={[styles.creeds_chooser, creeds_chooser_style]}>
            {buttons}
        </View>
    );

};

const onNavigatorEvent = (e) => {
    if (e.id === 'didAppear' || e.id === 'bottomTabReselected') book_image_bounce_animation.bounce();
};

class Creeds extends Component {

    componentDidMount() {
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
                , 'Formula-of-Subscription-(PRCA)': JSON.parse(stringArray[17][1]) || require('../../../data/Formula-of-Subscription-(PRCA).json')
                , 'The-Church-Order': JSON.parse(stringArray[18][1]) || require('../../../data/The-Church-Order.json')
            };

            this.props.dispatch(creeds_forms_library_init(creedsForms)); // todo next

            const fallbacksToStore = stringArray
                .map(([key, string], index) => [key, string, index])
                .filter(([key, string]) => !string)
                .map(([key, string, index]) => {
                    const fallback = creedsForms[key];
                    return [key, JSON.stringify(fallback)];
                });

            AsyncStorage.multiSet(fallbacksToStore).then((obj) => console.log('saved', obj)).catch(err => console.log('save creeds', err));
        }).catch(errArray => {
            Array.isArray(errArray)
                ? errArray.forEach(([key, err]) => console.log(key, err))
                : console.log(errArray);
        });
        
        this.props.navigator.setOnNavigatorEvent(onNavigatorEvent);
    }

    render() {
        //random, styles, images, Dimensions, navigator, dispatch

        const {
            dispatch
            , navigator
            , library_type_index
            , creeds_library
            , tab_bar_selected_index
        } = this.props;
        
        hide_tabs_action(navigator)();

        const component_obj = {
            random: Math.random,
            styles,
            images: {
                creeds_images_array,
                scenary_images_array,
                churches_images_array
            },
            Dimensions,
            navigator: navigator,
            dispatch: dispatch,
            os: Platform.OS
        };



        const creeds_menu_renderer_loaded = creeds_menu_renderer(component_obj)(library_type_index);

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)()()(tab_bar_selected_index);

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props} style={styles.default_bg} >

                {list_header_component(component_obj)(library_type_index)}
                {creeds_library && creeds_menu_flatlist(creeds_menu_renderer_loaded)(library_type_index)(creeds_library)}
                {creeds_or_forms_chooser(component_obj)(library_type_index)}
            </Default_Bg>
        );
    }
};


function mapStateToProps(state) {
    return {
        title_order: state.creeds.title_order
        , library_type_index: state.creeds_library_type_index
        , creeds_library: state.creeds.creeds_library
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Creeds);
