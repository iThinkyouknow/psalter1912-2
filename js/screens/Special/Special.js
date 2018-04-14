import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , Image
    , FlatList
    , Animated
    , TouchableHighlight
    , Dimensions
} from 'react-native';

// import styles from './Special.styles';
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
import {is_present_type} from '../../utils/functions';

const special_categories_key_extractor = (item, index) => `special-cat-${item.title}-${index}`;

const categories_data = [
    {
        title: 'Website'
        , image: require('../../../images/website.jpg')
        , nav_to: 'Website'
    }
    , {
        title: 'Sung 123 Times'
        , image: require('../../../images/statistics.jpg')
        , nav_to: ''
    }
    , {
        title: 'Resources'
        , image: require('../../../images/resources.jpg')
        , nav_to: ''
    }
    , {
        title: 'Give Thanks'
        , image: require('../../../images/thanks.jpg')
        , nav_to: ''
    }
];

const navigate_to = (navigator) => (screen_name) => () => {
    if (is_present_type('string')(screen_name)) {
        navigator.push({
            screen: screen_name,
            // navigatorStyle: {
            //     drawUnderNavBar: true,
            //     navBarTranslucent: true,
            // },
            backButtonTitle: 'Special'
        });
    }
};

const renderer = (width) => (navigate) => ({item, index}) => {

    const box_width      = width - (sizes.large * 2 * 1.5);
    const dyn_style      = {
        height: Math.floor(box_width * 1.3)
        , width: box_width
    };
    const renderer_style = {
        marginTop: sizes.x_large
        , padding: sizes.medium
        , borderRadius: border_radii.xx_large
        // , backgroundColor: colors.blue
        , justifyContent: 'flex-end'
        , alignItems: 'flex-end'
        , overflow: 'hidden'
    };

    const imageStyle = {
        position: 'absolute'
    };

    const text_cont_style = {
        backgroundColor: colors.black
        , borderRadius: border_radii.x_large
        , opacity: 0.6
        , paddingHorizontal: sizes.default
        , paddingBottom: 2
    };




    return (
        <TouchableHighlight underlayColor={'transparent'} onPress={navigate(item.nav_to)}>
            <View style={[renderer_style, dyn_style]}>
                <Image style={[imageStyle, dyn_style]} source={item.image}/>
                <View style={text_cont_style}>
                    <Default_Text font_size={'xxx_large'}>{item.title}</Default_Text>
                </View>

            </View>
        </TouchableHighlight>

    );
};

class Special extends Component {
    render() {

        const tab_actions = [];

        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions}>

                <FlatList
                    data={categories_data}
                    renderItem={renderer(Dimensions.get('window').width)(navigate_to(this.props.navigator))}
                    keyExtractor={special_categories_key_extractor}
                    contentContainerStyle={{alignItems: 'center', padding: sizes.large * 1.5}}
                />


            </Default_Bg_w_Tab_Bar>
        );
    }

}
;


function mapStateToProps(state) {
    return {
        // tab_bar_reducer
        tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Special);