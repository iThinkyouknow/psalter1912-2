import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Platform
    , TextInput
} from 'react-native';

// import styles from './Psalter-PDF.styles';
import {
    colors
    , sizes
    , font_sizes
    , zIndex
    , native_elements
    , buttons
    , border_radii
    , line_height_fn
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text
} from '../../common/Text';

import {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';

import {string_input_error_alert, wrong_number_error_alert} from '../../utils/alert';
import {is_present_type, no_op} from '../../utils/functions';

import {
    get_bible_chapter_list
    , get_bible_passage
} from '../../redux/actions/bible-actions';

import {
    lock_in
} from '../../redux/actions/psalter-actions';

import {
    psalter_pdf_text_input
} from '../../redux/actions/state-actions';

import Pdf from 'react-native-pdf';

const pdf_file = (Platform.OS === 'ios')
    ? require('../../../data/The_Psalter_PDF.pdf')
    : {uri:"bundle-assets://The_Psalter_PDF.pdf", cache: true};


const _Number_input = (os) => (end_text_action) => (change_text_action) => (text_is_valid) => (value) => (style) => (props) => {
    const keyboard_type = (os === 'ios') ? 'number-pad' : 'numeric';

    const text_input_style = {
        flex: 1
        , padding: sizes.default
        , ...line_height_fn('default')(font_sizes.default)
        , borderRadius: border_radii.default
        , fontSize: font_sizes.default
        , borderColor: colors.dark_cerulean
        , backgroundColor: colors.white
    };

    return (
        <TextInput keyboardType={keyboard_type}
                   placeholder={`Psalter # (1 - 413)`}
                   onEndEditing={end_text_action}
                   maxLength={3}
                   onChangeText={change_text_action}
                   value={value}
                   autoCorrect={false}
                   style={[text_input_style, style]}

                   {...props} />
    );

};

const Number_input = _Number_input(Platform.OS);

const on_select_psalter_action = (dispatch) => (e) => {
    const selected_index = parseInt(e.nativeEvent.text) - 1;

    is_present_type('number')(selected_index) ? dispatch(lock_in(selected_index)) : undefined;
};

const on_psalter_text_change = (dispatch) => (max_value) => (value) => {
    const value_trimmed = value.trim();
    const last_char_int = parseInt(value_trimmed.slice(-1));
    const value_int = parseInt(value_trimmed);

    if (value_trimmed.length === 0) {
        dispatch(psalter_pdf_text_input(value));
    } else if (Number.isNaN(last_char_int)) {
        string_input_error_alert();
        dispatch(psalter_pdf_text_input(value_trimmed.slice(0, -1)));
    } else if (value_int > max_value) {
        wrong_number_error_alert(max_value)();
        dispatch(psalter_pdf_text_input(value_trimmed.slice(0, -1)));
    } else if (is_present_type('number')(value_int) && value_int <= max_value ) {
        dispatch(psalter_pdf_text_input(value));
    }


};


class Psalter_PDF extends Component {


    render() {
        //todo isvalidtextinput

        const pdf_style = {
             paddingTop: sizes.large
            , backgroundColor: colors.white
            , flex: 1
        };

        const on_scale = (scale) => {
            scale;
        };

        const on_page_change = (pg, num) => {
            pg;
            num;
        };




        const on_psalter_selected = on_select_psalter_action(this.props.dispatch);
        const on_psalter_input_change = on_psalter_text_change(this.props.dispatch)(413);


        //umber_input =  (end_text_action) => (change_text_action) => (text_is_valid) => (value) => (style) => (props) =>

        const num_input_field = Number_input(on_psalter_selected)(on_psalter_input_change)(true)(this.props.psalter_pdf_input)()();

        const tab_actions = [];
        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions} >
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Pdf source={pdf_file}
                         scale={1}
                         style={pdf_style}
                         horizontal={true}
                         page={this.props.psalter_score_page}
                         onScaleChanged={on_scale} onPageChanged={on_page_change}/>
                </View>
                <View style={{paddingHorizontal: sizes.large, paddingVertical: sizes.default, flexDirection: 'row'}}>
                    {num_input_field}
                </View>

            </Default_Bg_w_Tab_Bar>
        );
    }



};


function mapStateToProps(state) {
    return {
        psalter_index: state.psalter.index
        , psalter_score_page: state.psalter.content.scoreRef
        // state reducer
        , psalter_pdf_input: state.psalter_pdf_input
    };
}

export default connect(mapStateToProps, null)(Psalter_PDF);