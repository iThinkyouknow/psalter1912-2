import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Navigation } from 'react-native-navigation';   
import {
    View
    , Image
    , FlatList
    , TouchableHighlight
    , Dimensions
    , Linking
} from 'react-native';

import { navigator_style_push } from '../../../Navigator-Common'

// import styles from './Special.styles';
import {
    colors,
    sizes,
    border_radii
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';

import {} from '../../utils/alert';
import {is_present_type} from '../../utils/functions';

const special_categories_key_extractor = (item, index) => `special-cat-${item.title}-${index}`;


const navigate_to = (componentId) => (screen_name) => () => {
    if (is_present_type('string')(screen_name)) {
        Navigation.push(componentId, {
            component: {
                name: screen_name,
                options: {
                    topBar: {
                        visible: true,
                        drawBehind: true,
                        backButton: {
                            title: 'Special',
                            showTitle: true
                        }
                    }
        
                }
            },
        });
    }
};

const link_to = (url) => () => {
    Linking.openURL(url);
};

const renderer = (width, navigate) => ({item, index}) => {

    const box_width = width - (sizes.large * 2 * 1.5);
    const dyn_style = {
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

    const on_press_action = (is_present_type('string')(item.link))
        ? link_to(item.link)
        : navigate(item.nav_to);

    return (
        <TouchableHighlight underlayColor={'transparent'} onPress={on_press_action}>
            <View style={[renderer_style, dyn_style]}>
                <Image style={[imageStyle, dyn_style]} source={item.image} />
                <View style={text_cont_style}>
                    <Default_Text font_size={'xxx_large'}>{item.title}</Default_Text>
                </View>

            </View>
        </TouchableHighlight>

    );
};

const get_total_sung_count = (psalter_all_sung_dates) => {
    return Object.values(psalter_all_sung_dates)
        .map((date_array) => date_array.length)
        .reduce((acc, count_per_psalter) => acc + count_per_psalter, 0);
};

const get_categories_data = (psalter_all_sung_dates) => {

    const sung_count = get_total_sung_count(psalter_all_sung_dates);
    const Times = sung_count === 1 ? 'Time' : 'Times';

    return [
        {
            title: 'Website'
            , image: require('../../../images/website.jpg')
            , link: 'http://psalterapp.weebly.com/'
            , nav_to: ''
        }
        , {
            title: `Sung ${sung_count} ${Times}`
            , image: require('../../../images/statistics.jpg')
            , link: ''
            , nav_to: 'Statistics'
        }
        , {
            title: 'Resources'
            , image: require('../../../images/resources.jpg')
            , link: ''
            , nav_to: 'Resources'
        }
        , {
            title: 'Give Thanks'
            , image: require('../../../images/thanks.jpg')
            , link: ''
            , nav_to: 'Credits'
        }
    ];
};

class Special extends Component {
    render() {
        const {
            dispatch
            , navigator
            , tab_bar_selected_index
            , psalter_all_sung_dates
            , componentId
        } = this.props;

        const categories_data = get_categories_data(psalter_all_sung_dates);

        return (
            <Default_Bg>
                <FlatList
                    data={categories_data}
                    renderItem={renderer(Dimensions.get('window').width, navigate_to(componentId))}
                    keyExtractor={special_categories_key_extractor}
                    contentContainerStyle={{alignItems: 'center', padding: sizes.large * 1.5}}
                    contentInsetAdjustmentBehavior={"never"}
                />


            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        // tab_bar_reducer
        tab_bar_selected_index: state.tab_bar_selected_index
        //psalter reducer
        , psalter_all_sung_dates: state.psalter.all_sung_dates
    };
}

export default connect(mapStateToProps, null)(Special);