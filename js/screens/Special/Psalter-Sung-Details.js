import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Image
    , Dimensions
    , TouchableHighlight
} from 'react-native';

//import styles from './Psalter-Sung-Details.styles';
import {
    colors
    , sizes
    , font_sizes
    , zIndex
    , native_elements
    , buttons
    , border_radii
} from '../../common/common.styles';

import {
    Default_Text
    , Animated_Text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';

import {} from '../../utils/alert';



const Sung_Details_Header = (title) => () => {

    return (
        <Default_Text font_size={'xx_large'}
                      style={{paddingBottom: sizes.large}}
                      font_weight={'bold'}
                      text_align={'center'}>
            {title}
        </Default_Text>
    );
};

const Date_Details_Component = (screen_width) => ({item, index}) => {
    const dyn_style = {
        width: screen_width - sizes.large * 2
    };
    const style = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
        // , height: 100
        , borderRadius: border_radii.large
        , overflow: 'hidden'
        , padding: Math.floor(sizes.large * 1.5)
    };

    const text_container_style = {
        flexDirection: 'row'
        , justifyContent: 'space-between'
        , alignItems: 'center'
    };

    return (
        <TouchableHighlight style={[style, dyn_style]} onPress={item.on_press} underlayColor={'transparent'}>
            <View style={[text_container_style]}>
                <Default_Text>{item.date_time}</Default_Text>
                <Default_Text>{item.ago}</Default_Text>

            </View>
        </TouchableHighlight>
    );
};

const sung_details_key_extractor = (item, index) => `sung-details-${item.psalter}-${index}`;

const content_container_style = {
    alignItems: 'center'
    , paddingTop: sizes.x_large
    , paddingHorizontal: sizes.large
};

const Footer = () => <View style={{height: native_elements.tab_bar}}></View>;

const tab_4_actions = (navigator) => () => navigator.popToRoot();

const select_tab = (tab_4_actions) => (tab_index) => () => {
    if (tab_index === 4) {
        tab_4_actions();
    }
};

class Psalter_Sung_Details extends Component {
    render() {
        const {
            dispatch
            , navigator
            , tab_bar_selected_index
            , sung_psalter_date_details_array
            , psalter_title
        } = this.props;

        const tab_actions = [select_tab(tab_4_actions(navigator))];

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props} >

                <FlatList data={sung_psalter_date_details_array}
                          keyExtractor={sung_details_key_extractor}
                          renderItem={Date_Details_Component(Dimensions.get('window').width)}
                          contentContainerStyle={content_container_style}
                          ItemSeparatorComponent={() => <View style={{height: sizes.default}}/>}
                          ListFooterComponent={Footer()}
                          ListHeaderComponent={Sung_Details_Header(psalter_title)} />

            </Default_Bg>
        );
    }
}
;


function mapStateToProps(state) {
    return {
        //statistics_reducer
        psalter_title: state.statistics_sung_psalter_date_details.psalter_title
        , sung_psalter_date_details_array: state.statistics_sung_psalter_date_details.dates_array
        // tab_bar_reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Psalter_Sung_Details);