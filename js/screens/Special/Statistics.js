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

import {} from '../../utils/alert';


const Per_Section_Render = (screen_width) => ({item, index}) => {
    const dyn_style = {
        width: screen_width - sizes.large * 2
    };
    const style = {
        backgroundColor: 'red'
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

class Statistics extends Component {
    render() {
        const tab_actions = [];

        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions}>


                <ScrollView >
                    <FlatList data={[1, 2, 3, 4, 5]}
                              renderItem={Per_Section_Render(Dimensions.get('window').width)}
                              ListHeaderComponent={Section_Header('Most Sung')}
                              contentContainerStyle={{alignItems: 'center', paddingTop: sizes.x_large}}
                              style={{height: 500}}
                              keyExtractor={per_sect_key_extractor(`most-sung`)}
                              ItemSeparatorComponent={() => <View style={{height: sizes.default}} />} />
                </ScrollView>


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

export default connect(mapStateToProps, null)(Statistics);