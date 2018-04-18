import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Alert,
    View,
    FlatList,
    SectionList,
    PanResponder,
    Animated,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    TouchableHighlight,
    Image,
    ImageBackground,
    StyleSheet,
    AsyncStorage,
    Slider
} from 'react-native';

import styles from './Creeds.styles';
import {
    colors,
    sizes,
    font_sizes,
    zIndex,
    native_elements,
    buttons,
    border_radii
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text
} from '../../common/Text';

import {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';

import {} from '../../utils/alert';

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
    lock_in_creed
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
                {rotate: '-25deg'},
                {translateX: -8},
                {translateY: book_animated_value}
            ]
        };

        const header_title_container_x_style = {
            maxWidth: width * (2 / 3) - sizes.x_large
        };

        return (
            <View style={[styles.header_container, container_style]}>
                <Image source={image} style={[styles.header_image, image_style]} resizeMode={'cover'}/>
                <View style={[styles.header_img_mask, img_mask_style]}/>
                <View style={[styles.header_title_container, header_title_container_x_style]}>
                    <Default_Text font_size={font_sizes.xxxxxx_large} font_weight={'bold'}>THE</Default_Text>
                    <Default_Text font_size={font_sizes.xxxx_large} font_weight={'bold'}>REFORMED</Default_Text>
                    <Default_Text font_size={font_sizes.xx_large} font_weight={'bold'}>CONFESSIONS</Default_Text>
                </View>
                <View style={styles.header_book_container}>
                    <Animated.Image source={confessions_book_cover} style={[styles.book, creeds_book_style]} />
                </View>
            </View>
        );

    } else if (selected_index === 1) {

        const forms_book_style = {
            transform: [
                {rotate: '-25deg'},
                {translateX: 32},
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
                    <Default_Text font_size={font_sizes.xxxxxx_large} font_weight={'bold'}>THE</Default_Text>
                    <Default_Text font_size={font_sizes.xxxx_large} font_weight={'bold'}>REFORMED</Default_Text>
                    <Default_Text font_size={font_sizes.xxx_large} font_weight={'bold'}>FORMS</Default_Text>
                </View>
            </View>
        );
    }
};

const book_image_bounce_animation = bounce_animation(1000)(3)(25)(-48);
const book_img_animated_value     = book_image_bounce_animation.animated_value;
const list_header_component       = list_header_component_wo_animated_val(book_img_animated_value);


const select_book = (navigator) => (dispatch) => (library_type_index) => (selected_index) => (levels_deep) => () => {
    //select book index
    dispatch(lock_in_creed(library_type_index)(selected_index)(levels_deep));
    navigator.push({
        screen: 'Creeds_Categories',
        navigatorStyle: {
            drawUnderNavBar: true,
            navBarTranslucent: true
        },
        backButtonTitle: (library_type_index === 0) ? 'Creeds' : 'Forms'
    });
};

const creeds_menu_renderer = ({navigator, dispatch, random, images, Dimensions}) => (library_type_index) => ({item, index}) => {
    const {height, width}    = Dimensions.get('window');
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
            <View style={styles.footer_component}/>
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

const creeds_or_forms_chooser = ({dispatch, Dimensions}) => (library_type_index) => {
    const {width, height}      = Dimensions.get('window');
    const creeds_chooser_style = {
        width: Math.floor(width * 2 / 3),
    };

    const button_renderer = (dispatch) => (_library_type_index) => (text, index) => {
        const is_selected    = (index === _library_type_index);
        const bg_color_obj   = {backgroundColor: (is_selected) ? colors.blue : 'transparent'};
        const underlay_color = (is_selected) ? colors.dark_cerulean : 'transparent';
        const key            = `library-chooser-${text}-${index}`;
        return (
            <TouchableHighlight key={key}
                                style={[{flex: 1}, bg_color_obj]}
                                underlayColor={underlay_color}
                                onPress={select_tab(dispatch)(index)}>
                <View>
                    <Default_Text line_height={2} text_align={'center'}>
                        {text}
                    </Default_Text>
                </View>
            </TouchableHighlight>
        );
    };

    const buttons = [
        'Confessions',
        'Forms'
    ].map(button_renderer(dispatch)(library_type_index));

    return (
        <View style={[styles.creeds_chooser, creeds_chooser_style]}>
            {buttons}
        </View>
    );

};

onNavigatorEvent = (e) => {
    if (e.id === 'didAppear' || e.id === 'bottomTabReselected') book_image_bounce_animation.bounce();
};

const select_tab_action = (navigator) => (dispatch) => (index) => () => {
    navigator.switchToTab({
        tabIndex: index
    });
    dispatch(select_tab_index(index));
};

class Creeds extends Component {

    componentDidMount() {
        this.props.navigator.setOnNavigatorEvent(onNavigatorEvent);
    }

    render() {
        //random, styles, images, Dimensions, navigator, dispatch
        const component_obj = {
            random: Math.random,
            styles,
            images: {
                creeds_images_array,
                scenary_images_array,
                churches_images_array
            },
            Dimensions,
            navigator: this.props.navigator,
            dispatch: this.props.dispatch
        };



        const creeds_menu_renderer_loaded = creeds_menu_renderer(component_obj)(this.props.library_type_index);

        const select_tab_action_wo_index = select_tab_action(this.props.navigator)(this.props.dispatch);

        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  style={styles.default_bg}>

                {list_header_component(component_obj)(this.props.library_type_index)}
                {creeds_menu_flatlist(creeds_menu_renderer_loaded)(this.props.library_type_index)(this.props.creeds_library)}
                {creeds_or_forms_chooser(component_obj)(this.props.library_type_index)}
            </Default_Bg_w_Tab_Bar>
        );
    }
};


function mapStateToProps(state) {
    return {
        library_type_index: state.creeds_library_type_index
        , creeds_library: state.creeds_library
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Creeds);
