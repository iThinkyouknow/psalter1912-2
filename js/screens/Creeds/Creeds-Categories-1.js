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
    buttons
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

const creed_categories_list = (component_items) => (title) => (content) => () => {

    render_creed_categories = ({item, index}) => {
        const header_text = <Default_Text font_weight={'bold'}>{item.header}</Default_Text>
        const sub_text = item.content.map(({content}, i) => {
            const sub_title = content[0].map(({text}, k) => {
                const actual_text = (k === 0) ? text : ` ${text}`;
                return(
                    <Default_Text key={`category-${k}`}>{actual_text}</Default_Text>
                );
            });

            return <Default_Text key={`creeds-lv-1-sub-title-${i}`}>{sub_title}</Default_Text>

        });

        return (
            <View>
                <Default_Text>{header_text}</Default_Text>
                {sub_text}
            </View>
        );
    };

    creeds_cat_key_ext = (item, j) => `categories-${j}`;

    return (
        <FlatList ListHeaderComponent={header_banner(title)}
                  keyExtractor={creeds_cat_key_ext}
                  data={content}
                  renderItem={render_creed_categories} />
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
                {creed_categories_list(component_items)(this.props.creed_title)(this.props.creed_content)()}
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