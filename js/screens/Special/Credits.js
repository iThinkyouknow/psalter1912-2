import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Image
} from 'react-native';

//import styles from './Credits.styles';
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
    , text_formatter
} from '../../common/Text';

import Default_bg, {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';

import {} from '../../utils/alert';
import {is_present_type} from '../../utils/functions';

import credits_text from '../../../data/Credits-Texts.json'

const Intro_Component = () => {
    const style = {
        alignItems: 'center'
        , paddingTop: native_elements.nav_bar_std + native_elements.status_bar
    };
    return (
        <View style={style}>
            <Default_Text font_size={'x_large'}>We would like to give our heartfelt</Default_Text>
            <Default_Text font_weight={'bold'}
                          font_size={'xxx_large'}>
                GRATITUDE
            </Default_Text>
            <Default_Text font_size={'x_large'}>for the following:</Default_Text>
        </View>
    );
};

const key_extractor = (item, index) => `thanks-${item.title}-${index}`;


const Thanks_Party_Component = ({item, index}) => {
    const desc = text_formatter(item.description)(0)(`thanks-body`)(false)([]);

    return (
        <View style={{padding: sizes.large}}>
            <Default_Text text_align={'center'} font_weight={'bold'} font_size={'x_large'} >{item.title}</Default_Text>
            {is_present_type('string')(item.source) &&
                <Default_Text style={{marginTop: sizes.default}} text_align={'center'}>
                    Source:&nbsp;
                    <Default_Text font_weight="bold">
                        {item.source}
                    </Default_Text>
                </Default_Text>
            }
            <Default_Text style={{marginTop: sizes.default}} text_align={'center'}>{desc}</Default_Text>
        </View>
    );
};

class Credits extends Component {
    render() {
        const tab_actions = [];

        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions}>
                <FlatList ListHeaderComponent={Intro_Component}
                          data={credits_text}
                          keyExtractor={key_extractor}
                          renderItem={Thanks_Party_Component} />


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

export default connect(mapStateToProps, null)(Credits);