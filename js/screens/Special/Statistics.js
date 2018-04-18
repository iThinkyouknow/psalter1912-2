import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Image
    , SectionList
    , ScrollView
    , Dimensions
} from 'react-native';

//import styles from './Statistics.styles';
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

import Default_bg, {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';
import Segmented_Buttons from '../../common/Segmented-Buttons';
import {select_statistics_tab} from '../../redux/actions/state-actions';

import {} from '../../utils/alert';


const Per_Section_Render = (screen_width) => ({item, index}) => {
    const dyn_style = {
        width: screen_width - sizes.large * 2
    };
    const style = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
        , height: 100
        , borderRadius: border_radii.large
    }
    return <View style={[style, dyn_style]}/>
};

const per_sect_key_extractor = (prefix) => (item, index) => `psalter-stat-${prefix}-${index}`;


const Section_Header = (title) => () => {
    return (
        <Default_Text style={{paddingBottom: sizes.large}} font_weight={'bold'} text_align={'center'} font_size={'xx_large'}>{title}</Default_Text>
    );

};

const select_tab = (dispatch) => (index) => () => {
    dispatch(select_statistics_tab(index));
};

const Footer = () => <View style={{height: native_elements.tab_bar}}></View>

class Statistics extends Component {
    render() {
        const tab_actions = [];

        const seg_buttons_width = Math.floor(Dimensions.get('window').width * 9 / 10);

        const select_tab_w_dispatch = select_tab(this.props.dispatch);
        const seg_buttons_array = [
            {
                text: 'Most Sung'
                , on_press: select_tab_w_dispatch(0)
            }
            , {
                text: 'Latest'
                , on_press: select_tab_w_dispatch(1)
            }
            , {
                text: 'Neglected'
                , on_press: select_tab_w_dispatch(2)
            }
        ];

        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions}
                                  style={{alignItems: 'center'}}>



                    <FlatList data={[1, 2, 3, 4, 5]}
                              renderItem={Per_Section_Render(Dimensions.get('window').width)}
                              ListHeaderComponent={Section_Header('Most Sung')}
                              ListFooterComponent={Footer()}
                              contentContainerStyle={{alignItems: 'center', paddingTop: sizes.x_large}}
                              style={{height: 500}}
                              keyExtractor={per_sect_key_extractor(`most-sung`)}
                              ItemSeparatorComponent={() => <View style={{height: sizes.default}} />} />

                <View style={{position: 'absolute', bottom: sizes.default + native_elements.tab_bar}}>
                    {Segmented_Buttons(seg_buttons_width)(seg_buttons_array)()(this.props.selected_tab_index)}
                </View>


            </Default_Bg_w_Tab_Bar>
        );
    }
}
;


function mapStateToProps(state) {
    return {
        //state reducer
        selected_tab_index: state.statistics_selected_tab_index
        // tab_bar_reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Statistics);