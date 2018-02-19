import React, { Component } from 'react';
import { connect } from 'react-redux';
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

import Default_bg from '../../common/Default-bg';

import {

} from '../../utils/alert';

import {
    bounce_animation
} from '../../utils/animation';

import {
    select_creeds_or_forms
} from '../../redux/actions/state-actions';

import {
    lock_in_creed
} from '../../redux/actions/creeds-actions';

//



const list_header_component_wo_animated_val = (book_animated_value) => (selected_index) => {
    const {height, width} = Dimensions.get('window');
    //import fonts
    //get images
    //animate images

    const container_style = {height: height / 3.2, width, backgroundColor: colors.ocean, flexDirection: 'row'};

    const image_style = {
        width: width,
        height: height / 3.2,
        position: 'absolute',
    };

    const book_style = {
        backgroundColor: 'green',
        width: 75,
        height: 75 * 1.4,
        marginBottom: 0,

    };

    if (selected_index === 0) {
        const images_array = [
            require('../../../images/The-synod-of-dordt.jpg'),
            require('../../../images/Belgic-Confession.jpg'),
            require('../../../images/Heidelberg-Catechism.jpg')
        ];
        const image = images_array[Math.floor(Math.random() * images_array.length)];

        const creeds_book_style = {
            ...book_style,
            transform: [
                {rotate: '-25deg'},
                {translateX: -8},
                {translateY: book_animated_value}
            ]
        };

        return (
            <View style={container_style}>
                <Image source={image} style={image_style} resizeMode={'cover'} />
                <View style={{position: 'absolute', width, height: height / 3.2, backgroundColor: 'rgb(0, 0, 0)', opacity: 0.5}} />
                <View style={{marginLeft: sizes.x_large, marginTop: 32, justifyContent: 'center', backgroundColor: 'transparent', flex: 1, maxWidth: width * (2/3) - sizes.x_large}}>
                    <Default_Text font_size={font_sizes.xxxxx_large} font_weight={'bold'}>THE</Default_Text>
                    <Default_Text font_size={font_sizes.xxx_large} font_weight={'bold'}>REFORMED</Default_Text>
                    <Default_Text font_size={font_sizes.xx_large} font_weight={'bold'}>CONFESSIONS</Default_Text>
                </View>
                <View style={{justifyContent: 'center', flex: 0}}>
                    <Animated.View style={creeds_book_style}></Animated.View>
                </View>
            </View>
        );

    } else if (selected_index === 1) {
        const images_array = [
            require('../../../images/green-mountain.jpg'),
            require('../../../images/green-plains.jpg'),
            require('../../../images/houses-with-mountains.jpg'),
            require('../../../images/mountain-valley.jpg')
        ];

        const forms_book_style = {
            ...book_style,
            marginTop: 24,
            transform: [
                {rotate: '-25deg'},
                {translateX: 16},
                {translateY: book_animated_value}
            ]
        };

        const image = images_array[Math.floor(Math.random() * images_array.length)];
        return (
            <View style={container_style}>
                <Image source={image} style={image_style} resizeMode={'cover'} />
                <View style={{position: 'absolute', width, height: height / 3.2, backgroundColor: 'rgb(0, 0, 0)', opacity: 0.5}} />

                <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <Animated.View style={forms_book_style} />
                </View>

                <View style={{marginLeft: sizes.x_large + 16, marginTop: 32, justifyContent: 'center', backgroundColor: 'transparent', flex: 2 }}>
                    <Default_Text font_size={font_sizes.xxxxx_large} font_weight={'bold'}>THE</Default_Text>
                    <Default_Text font_size={font_sizes.xxx_large} font_weight={'bold'}>REFORMED</Default_Text>
                    <Default_Text font_size={font_sizes.xxx_large} font_weight={'bold'}>FORMS</Default_Text>
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
        screen: 'Creeds_Categories_1',
        navigatorStyle: {
            drawUnderNavBar: true,
            navBarTranslucent: true
        }
    });
};

const creeds_menu_flatlist = (navigator) => (dispatch) => (library_type_index) => (library) => {

    const render_item = ({item, index}) => {
        const {height, width} = Dimensions.get('window');
        const should_margin_left = (index % 2 > 0);

        const get_image = (library_type_index) => (i) => {
            const static_images_array = [
                require('../../../images/Heidelberg-Catechism.jpg'),
                require('../../../images/Belgic-Confession.jpg'),
                require('../../../images/The-synod-of-dordt.jpg')
            ];

            const random_images_array = [
                require('../../../images/bethel-prc.jpg'),
                require('../../../images/byron-center-prc.jpg'),
                require('../../../images/calvary-prc.png'),
                require('../../../images/cerc-sanctuary.jpg'),
                require('../../../images/cornerstone-prc.jpg'),
                require('../../../images/covenant-of-grace-prc.jpg'),
                require('../../../images/crete-prc.png'),
                require('../../../images/doon-prc.png'),
                require('../../../images/faith-prc.jpg'),
                require('../../../images/first-prc.png'),
                require('../../../images/georgetown-prc.jpg'),
                require('../../../images/grandville-prc.jpg'),
                require('../../../images/green-mountain.jpg'),
                require('../../../images/green-plains.jpg'),
                require('../../../images/heritage-prc.jpg'),
                require('../../../images/Holland-prc.jpg'),
                require('../../../images/hope-prc-ca.jpg'),
                require('../../../images/hope-prc-mi.jpg'),
                require('../../../images/houses-with-mountains.jpg'),
                require('../../../images/hudsonville-prc.jpg'),
                require('../../../images/hull-prc.jpg'),
                require('../../../images/kalamazoo-prc.jpg'),
                require('../../../images/loveland-prc.jpg'),
                require('../../../images/lynden-prc.jpg'),
                require('../../../images/mountain-valley.jpg'),
                require('../../../images/peace-prc.jpg'),
                require('../../../images/pittsburgh-prc.jpg'),
                require('../../../images/randolph-prc.jpg'),
                require('../../../images/southeast-prc.jpg'),
                require('../../../images/southwest-prc.jpg'),
                require('../../../images/trinity-prc.jpg'),
                require('../../../images/wingham-prc.png')
            ];

            if (library_type_index === 0) {
                if (i === 0 || i === 1 || i === 2) {
                    return static_images_array[i];
                }
            }

            return random_images_array[Math.floor(Math.random() * random_images_array.length)];
        };

        const image = get_image(library_type_index)(index);


        const library_selection_style = {
            marginLeft: (should_margin_left) ? sizes.large : 0,
            overflow: 'hidden',
            borderRadius: border_radii.default,
            width: width / 2 - sizes.x_large,
            height: width / 2 - sizes.x_large
        };

        const library_selection_image_style = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: width / 2 - sizes.x_large,
            height: width / 2 - sizes.x_large,
        };

        const library_selection_mask_style = {
            ...library_selection_image_style,
            backgroundColor: colors.black,
            opacity: 0.5,
        };

        const text_container_style = {
            width: width / 2 - sizes.x_large,
            height: width / 2 - sizes.x_large,
            alignItems: 'center',
            justifyContent: 'center',
            padding: sizes.default

        };


        return (
            <TouchableHighlight underlayColor={'transparent'}
                                style={library_selection_style}
                                onPress={select_book(navigator)(dispatch)(library_type_index)(index)(item.levels_deep)}>
                <View>
                    <Image source={image} style={[library_selection_image_style]} />
                    <View style={library_selection_mask_style} />
                    <View style={text_container_style}>
                        <Default_Text text_align={'center'} font_size={'x_large'}>{item.title}</Default_Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    };


    const creeds_menu_key_ext = (item, index) => `creeds-menu-${item.title}-${index}`;
    ListFooterComponent = () => {
        return (
            <View style={{height: 32 + sizes.default * 2}}/>
        );
    };
    return (
        <FlatList
                  data={library[library_type_index]}
                  renderItem={render_item}
                  numColumns={2}
                  keyExtractor={creeds_menu_key_ext}
                  columnWrapperStyle={{marginTop: 16}}
                  contentContainerStyle={{alignItems: 'center', backgroundColor: 'transparent'}}
                  ListFooterComponent={ListFooterComponent}>

        </FlatList>
    );
};

const select_tab = (dispatch) => (index) => () => {
    dispatch(select_creeds_or_forms(index));
    book_image_bounce_animation.bounce();
};

const creeds_or_forms_chooser = (dispatch) => (library_type_index) =>  {
    const {width, height} = Dimensions.get('window');
    const creeds_chooser_style = {
        position: 'absolute',
        flexDirection: 'row',
        bottom: sizes.default,
        // backgroundColor: 'blue',
        height: 32,
        borderRadius: border_radii.default,
        width: width * 2/3,
        borderColor: colors.blue,
        borderWidth: 1,
        alignItems: 'center',
        overflow: 'hidden'
    };

    const button_renderer = (dispatch) => (_library_type_index) =>  (text, index) => {
        const is_selected = (index === _library_type_index);
        const bg_color_obj = {backgroundColor: (is_selected) ? colors.blue : 'transparent'};
        const underlay_color = (is_selected) ? colors.ocean : 'transparent';
        const key = `library-chooser-${text}-${index}`;
        return (
            <TouchableHighlight key={key}
                                style={[{flex: 1}, bg_color_obj]}
                                underlayColor={underlay_color}
                                onPress={select_tab(dispatch)(index)}>
                <View>
                    <Default_Text line_height={2} text_align={'center'} >
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
        <View style={creeds_chooser_style}>
            {buttons}
        </View>
    );

};

class Creeds extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        book_image_bounce_animation.bounce();
    }

    render() {

        return (
            <Default_bg style={{alignItems: 'center'}}>
                {list_header_component(this.props.library_type_index)}
                {creeds_menu_flatlist(this.props.navigator)(this.props.dispatch)(this.props.library_type_index)(this.props.creeds_library)}
                {creeds_or_forms_chooser(this.props.dispatch)(this.props.library_type_index)}
            </Default_bg>
        );
    }
};


function mapStateToProps(state) {
    return {
        library_type_index: state.creeds_library_type_index,
        creeds_library: state.creeds_library
    };
}

export default connect(mapStateToProps, null)(Creeds);
