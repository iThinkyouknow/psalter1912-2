import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    FlatList,
    Animated,
    Dimensions,
    Image
} from 'react-native';

// import styles from './Creeds-Categories-1.styles';
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

import {} from '../../utils/alert';

const header_banner = (title) => {
    const {width, height} = Dimensions.get('window');

    const header_banner_sm_style = {
        height: height / 4,
        justifyContent: 'center',
    };

    const header_banner_sm_image_style = {
        position: 'absolute',
        top: 0,
        width: 0,
        height: height / 4,
        width: width
    };

    const header_banner_sm_mask_style = {
        ...header_banner_sm_image_style,
        backgroundColor: colors.black,
        opacity: 0.5
    };

    const text_container_style = {
        backgroundColor: 'transparent',
        marginHorizontal: sizes.x_large,
        marginTop: sizes.large
    };

    return (
        <View style={header_banner_sm_style} >
            <Image style={header_banner_sm_image_style}
                   source={require('../../../images/Heidelberg-Catechism.jpg')} resizeMode={'cover'} />
            <View style={header_banner_sm_mask_style} />
            <View style={text_container_style}>
                <Default_Text font_size={font_sizes.xx_large}>{title}</Default_Text>
            </View>
        </View>
    );
};

const creed_categories_list = (component_items) => (title) => (content) => (creed_level) => {

    const render_creed_categories = (creed_level) => ({item, index}) => {
        const header_text = (<Default_Text font_size={'large'} font_weight={'bold'}>{item.header}</Default_Text>);

        const sub_text_component = (item.content[0] === item.header || item.content[0].length < 1 || creed_level > 1) // impure
            ? null
            : item.content.map((text, i) => {
                const sub_title_style = {
                    marginTop: sizes.default
                };

                return (<Default_Text style={sub_title_style} key={`creeds-lv-1-sub-title-${i}`}>{text}</Default_Text>);
            });


        const categories_container_style = {
            marginTop: sizes.large,
            marginHorizontal: sizes.large,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            borderRadius: border_radii.default,
            padding: sizes.large,
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            shadowColor: colors.black,
            shadowOffset: {
                width: sizes.default,
                height: sizes.default
            }

        };

        return (
            <View style={categories_container_style}>
                <Default_Text>{header_text}</Default_Text>
                <View style={{marginLeft: sizes.medium}}>
                    {sub_text_component}
                </View>
            </View>
        );


    };

    creeds_cat_key_ext = (item, j) => `categories-${j}`;

    return (
        <FlatList ListHeaderComponent={header_banner(title)}
                  keyExtractor={creeds_cat_key_ext}
                  data={content}
                  renderItem={render_creed_categories(creed_level)} />
    );
};

class Creeds_Categories_1 extends Component {

    render() {
        const component_items = {
            navigator: this.props.navigator,
            dispatch: this.props.dispatch
        }
        return (
            <Default_bg>
                {creed_categories_list(component_items)(this.props.creed_title)(this.props.creed_content)(this.props.creed_level)}
            </Default_bg>
        )
    }
};





function mapStateToProps(state) {
    return {
        creed_content: state.creed.content,
        creed_level: state.creed.levels_deep || 0,
        creed_title: state.creed.title
    };
}

export default connect(mapStateToProps, null)(Creeds_Categories_1);