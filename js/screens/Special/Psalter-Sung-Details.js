import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Dimensions
    , TouchableHighlight
} from 'react-native';

import {
    sizes
    , native_elements
    , border_radii
    , user_font_color
} from '../../common/common.styles';

import {
    Default_Text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';
import { on_psalter_change } from '../Psalter/Psalter';
import { Navigation } from 'react-native-navigation';
import { select_tab_index } from '../../redux/actions/tab-bar-actions';
import { switch_to_psalter_tab_alert } from '../../utils/alert';


const Sung_Details_Header = (title, user_settings) => () => {

    return (
        <Default_Text font_size={'xx_large'}
                      style={{paddingBottom: sizes.large, ...user_font_color(user_settings)}}
                      font_weight={'bold'}
                      text_align={'center'}>
            {title}
        </Default_Text>
    );
};

const switch_to_psalter_tab = (dispatch, psalter_index) => () => {
    on_psalter_change(dispatch, psalter_index)();
    Navigation.mergeOptions('BOTTOM_TABS',{
        bottomTabs: {
            currentTabIndex: 0
        }
    });
    dispatch(select_tab_index(0));
}

const Date_Details_Component = (screen_width, on_press, user_settings) => ({item}) => {
    const dyn_style = {
        width: screen_width - sizes.large * 2
    };
    const style = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
        , borderRadius: border_radii.large
        , overflow: 'hidden'
        , padding: Math.floor(sizes.large * 1.5)
    };

    const text_container_style = {
        flexDirection: 'row'
        , justifyContent: 'space-between'
        , alignItems: 'center'
    };

    const color_style = user_font_color(user_settings);

    return (
        <TouchableHighlight style={[style, dyn_style]} onPress={on_press} underlayColor={'transparent'}>
            <View style={[text_container_style]}>
                <Default_Text style={color_style}>{item.date_time}</Default_Text>
                <Default_Text style={color_style}>{item.ago}</Default_Text>

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


class Psalter_Sung_Details extends Component {
    render() {
        const {
            sung_psalter_date_details_array
            , psalter_title
        } = this.props;
        
        const psalter_index = +(psalter_title.replace('Psalter ', '')) - 1;
        const on_sung_detail_pressed = switch_to_psalter_tab_alert(psalter_title, switch_to_psalter_tab(this.props.dispatch, psalter_index));
        return (
            <Default_Bg user_settings={this.props.user_settings}>
                <FlatList data={sung_psalter_date_details_array}
                    keyExtractor={sung_details_key_extractor}
                    renderItem={Date_Details_Component(Dimensions.get('window').width, on_sung_detail_pressed, this.props.user_settings)}
                    contentContainerStyle={content_container_style}
                    ItemSeparatorComponent={() => <View style={{height: sizes.default}}/>}
                    contentInsetAdjustmentBehavior={'never'}
                    ListFooterComponent={Footer()}
                    ListHeaderComponent={Sung_Details_Header(psalter_title, this.props.user_settings)} />
            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        //statistics_reducer
        psalter_title: state.statistics_sung_psalter_date_details.psalter_title
        , sung_psalter_date_details_array: state.statistics_sung_psalter_date_details.dates_array
        // tab_bar_reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
        , user_settings: state.user_settings
    };
}

export default connect(mapStateToProps, null)(Psalter_Sung_Details);