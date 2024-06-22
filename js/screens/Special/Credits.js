import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View
    , FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

import { user_font_color } from '../../common/common.styles';

import Default_Bg from '../../common/Default-bg';
import FontSlider from '../../common/Font-slider';

import { } from '../../utils/alert';
import { is_string, composer, save_font_size } from '../../utils/functions';

import { credits_texts_init } from '../../redux/actions/credits-actions';
import { set_new_font_size } from '../../redux/actions/state-actions'
import { GestureDetector } from 'react-native-gesture-handler';
import { pinch_text_gesture } from '../../utils/touch-gestures';
import { on_pinch_text_size } from '../../utils/functions';


const Intro_Component = ({text_font_size, user_settings}) => () => {
    const style = {
        alignItems: 'center'
        , paddingTop: native_elements.nav_bar_std + native_elements.status_bar
    };
    const color_style = user_font_color(user_settings)
    return (
        <View style={style}>
            <Default_Text style={color_style} text_align={'center'} font_size={text_font_size + 4}>We would like to give our heartfelt</Default_Text>
            <Default_Text style={color_style} text_align={'center'} font_weight={'bold'}
                font_size={text_font_size + 12}>
                GRATITUDE
            </Default_Text>
            <Default_Text style={color_style} text_align={'center'} font_size={text_font_size + 4}>for the following:</Default_Text>
        </View>
    );
};

const key_extractor = (item, index) => `thanks-${item.title}-${index}`;


const Thanks_Party_Component = ({text_font_size, user_settings}) => ({ item, index }) => {
    const desc = text_formatter(text_font_size, item.description, `thanks-body`, user_settings);
    const color_style = user_font_color(user_settings);
    return (
        <View style={{ padding: sizes.large * 1.5 }}>
            <Default_Text style={color_style} text_align={'center'} font_weight={'bold'} font_size={text_font_size + 4}>{item.title}</Default_Text>
            {is_string(item.source) &&
                <Default_Text font_size={text_font_size} style={{ marginTop: sizes.default, ...color_style }} text_align={'center'}>
                    Source:&nbsp;
                    <Default_Text style={color_style} font_size={text_font_size} text_align={'center'} font_weight="bold">
                        {item.source}
                    </Default_Text>
                </Default_Text>
            }
            <Default_Text font_size={text_font_size} style={{ marginTop: sizes.default, ...color_style }} text_align={'center'}>{desc}</Default_Text>
        </View>
    );
};

const set_font_size = (dispatch) => (new_font_size) => {
    composer([
        set_new_font_size,
        dispatch
    ])(new_font_size);
    save_font_size(AsyncStorage, new_font_size);
};

class Credits extends Component {
    componentDidMount() {
        const creditsStorageKey = 'Credits-Texts';
        AsyncStorage.getItem(creditsStorageKey)
            .then(json_string => {
                const json = JSON.parse(json_string) || require('../../../data/Credits-Texts.json');
                this.props.dispatch(credits_texts_init(json));
            })
            .catch(err => console.error('get credits text storage error:', err))
    }

    render() {
        const {
            dispatch
            , text_font_size
        } = this.props;

        const set_font_size_wo_font_size = set_font_size(dispatch);

        const pinch = pinch_text_gesture(on_pinch_text_size(this.props));

        return (
            <Default_Bg user_settings={this.props.user_settings}>
                <GestureDetector gesture={pinch}>
                    <FlatList ListHeaderComponent={Intro_Component(this.props)}
                        data={this.props.credits_text || []}
                        keyExtractor={key_extractor}
                        contentInsetAdjustmentBehavior={'never'}
                        renderItem={Thanks_Party_Component(this.props)} />
                </GestureDetector>

                <FontSlider value={text_font_size} onSlidingComplete={set_font_size_wo_font_size} user_settings={this.props.user_settings} />
            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        credits_text: state.credits.credits
        // tab_bar_reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
        // state reducer
        , text_font_size: state.text_font_size
        , user_settings: state.user_settings
    };
}

export default connect(mapStateToProps, null)(Credits);