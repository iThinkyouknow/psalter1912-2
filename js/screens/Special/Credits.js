import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
} from 'react-native';

//import styles from './Credits.styles';
import {
    sizes
    , font_sizes
    , native_elements
} from '../../common/common.styles';

import {
    Default_Text
    , text_formatter
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';
import FontSlider from '../../common/Font-slider';

import {} from '../../utils/alert';
import {is_present_type, composer} from '../../utils/functions';

import credits_text from '../../../data/Credits-Texts.json';
import {credits_text_set_new_font_size} from '../../redux/actions/state-actions'

const Intro_Component = (font_size) => () => {
    const style = {
        alignItems: 'center'
        , paddingTop: native_elements.nav_bar_std + native_elements.status_bar
    };
    return (
        <View style={style}>
            <Default_Text text_align={'center'} font_size={font_size + 4}>We would like to give our heartfelt</Default_Text>
            <Default_Text  text_align={'center'} font_weight={'bold'}
                          font_size={font_size + 12}>
                GRATITUDE
            </Default_Text>
            <Default_Text  text_align={'center'} font_size={font_size + 4}>for the following:</Default_Text>
        </View>
    );
};

const key_extractor = (item, index) => `thanks-${item.title}-${index}`;


const Thanks_Party_Component = (font_size) => ({item, index}) => {
    const desc = text_formatter(font_size)(item.description)(`thanks-body`);

    return (
        <View style={{padding: sizes.large * 1.5}}>
            <Default_Text text_align={'center'} font_weight={'bold'} font_size={font_size + 4}>{item.title}</Default_Text>
            {is_present_type('string')(item.source) &&
            <Default_Text font_size={font_size} style={{marginTop: sizes.default}} text_align={'center'}>
                Source:&nbsp;
                <Default_Text font_size={font_size} text_align={'center'} font_weight="bold">
                    {item.source}
                </Default_Text>
            </Default_Text>
            }
            <Default_Text font_size={font_size} style={{marginTop: sizes.default}} text_align={'center'}>{desc}</Default_Text>
        </View>
    );
};

const tab_4_actions = (navigator) => () => navigator.popToRoot();

const select_tab = (tab_4_actions) => (tab_index) => () => {
    if (tab_index === 4) {
        tab_4_actions();
    }
};

const set_font_size = (dispatch) => (new_font_size) => {
    composer([
        credits_text_set_new_font_size,
        dispatch
    ])(new_font_size);
};

class Credits extends Component {
    render() {
        const {
            dispatch
            , navigator
            , tab_bar_selected_index
            , credits_text_font_size
        } = this.props;

        const tab_actions = [select_tab(tab_4_actions(navigator))];

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);
        const set_font_size_wo_font_size = set_font_size(dispatch);
        
        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props}>
                <FlatList ListHeaderComponent={Intro_Component(credits_text_font_size)}
                          data={credits_text}
                          keyExtractor={key_extractor}
                          renderItem={Thanks_Party_Component(credits_text_font_size)} />

                <FontSlider onSlidingComplete={(e) => {
                    set_font_size_wo_font_size(e * font_sizes.default);
                }} />
            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        // tab_bar_reducer
        tab_bar_selected_index: state.tab_bar_selected_index
        // state reducer
        , credits_text_font_size: state.credits_text_font_size
    };
}

export default connect(mapStateToProps, null)(Credits);