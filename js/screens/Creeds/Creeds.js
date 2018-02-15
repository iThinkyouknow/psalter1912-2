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

const list_header_component = () => {
    const {height, width} = Dimensions.get('window');
    //import fonts
    //get images
    //animate images

    const images_array = [
        require('../../../images/The-synod-of-dordt.jpg'),
        require('../../../images/Belgic-Confession.jpg'),
        require('../../../images/Heidelberg-Catechism.jpg')
    ];
    const image = images_array[Math.floor(Math.random() * images_array.length)];

    const image_style = {
        width: width,
        height: height / 3.2,
        position: 'absolute',
    };
    return (
        <View style={{height: height / 3.2, width, backgroundColor: colors.ocean, flexDirection: 'row'}}>
            <Image source={image} style={image_style} resizeMode={'cover'}></Image>
            <View style={{position: 'absolute', width, height: height / 3.2, backgroundColor: 'rgb(0, 0, 0)', opacity: 0.5}}></View>
            <View style={{marginLeft: sizes.x_large, marginTop: 32, justifyContent: 'center', backgroundColor: 'transparent', flex: 1, maxWidth: width * (2/3) - sizes.x_large}}>
                <Default_Text font_size={font_sizes.xxxxx_large} font_weight={'bold'}>THE</Default_Text>
                <Default_Text font_size={font_sizes.xx_large + 2} font_weight={'bold'}>CONFESSIONS</Default_Text>
            </View>
            <View style={{justifyContent: 'center', flex: 0}}>
                <View style={{backgroundColor: 'green', width: 75, height: 75 * 1.4, marginBottom: 0, transform: [{rotate: '-25deg'}, {translateX: -8}]}}></View>
            </View>



        </View>
    );
};

const creeds_menu_flatlist = () => () => {

    const render_item = ({item, index}) => {
        const {height, width} = Dimensions.get('window');
        const should_margin_left = (index % 2 > 0);
        return (
            <View style={{width: width / 2 - sizes.x_large, height: width / 2 - sizes.x_large, borderRadius: border_radii.default, backgroundColor: 'red', marginLeft: (should_margin_left) ? sizes.large : 0}}>

            </View>
        )
    };

    const creeds_menu_key_ext = (item, index) => `creeds-menu-${item.title}-${index}`;



    return (
        <FlatList
                  data={[1,2,3,4, 5, 6]}
                  renderItem={render_item}
                  numColumns={2}
                  keyExtractor={creeds_menu_key_ext}
                  columnWrapperStyle={{marginTop: 16}}
                  contentContainerStyle={{alignItems: 'center', backgroundColor: 'transparent'}}>

        </FlatList>
    );
};

const creeds_or_forms_chooser = () => {
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
    return (
        <View style={creeds_chooser_style}>
            <TouchableHighlight style={{backgroundColor: colors.blue, flex: 1}}>
                <View>
                    <Default_Text line_height={2} text_align={'center'} >
                        Confessions
                    </Default_Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={{flex: 1, backgroundColor: 'transparent'}}>
                <View>
                    <Default_Text line_height={2} text_align={'center'}>
                        Forms
                    </Default_Text>
                </View>

            </TouchableHighlight>

        </View>
    );

};

class Creeds extends Component {
    render() {
        return (
            <Default_bg style={{alignItems: 'center'}}>
                {list_header_component()}
                {creeds_menu_flatlist()()}
                {creeds_or_forms_chooser()}
            </Default_bg>
        );
    }
};


function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps, null)(Creeds);
