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

import {is_present_type, no_op, debounce} from '../../utils/functions';

import {
    get_bible_chapter_list
    , get_bible_passage
} from '../../redux/actions/bible-actions';

import {
    lock_in
} from '../../redux/actions/psalter-actions';

import {
    psalter_pdf_text_input
    , toggle_psalter_pdf_text_input_valid
    , set_temp_psalter_pdf_page_no
    , reset_temp_psalter_pdf_page_no
} from '../../redux/actions/state-actions';

import Pdf from 'react-native-pdf';

const pdf_file = (Platform.OS === 'ios')
    ? require('../../../data/The_Psalter_PDF.pdf')
    : {uri: "bundle-assets://The_Psalter_PDF.pdf", cache: true};


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

const on_select_psalter_action = (dispatch) =>(text_input_is_valid) => (e) => {
    const selected_index = parseInt(e.nativeEvent.text) - 1;

    if (is_present_type('number')(selected_index) && text_input_is_valid) {
        dispatch(lock_in(selected_index));
        dispatch(psalter_pdf_text_input(""));
    }
};

const on_psalter_text_change = (dispatch) => (max_value) => (value) => {
    const value_trimmed = value.trim();
    const last_char_int = parseInt(value_trimmed.slice(-1));
    const value_int     = parseInt(value_trimmed);

    const set_text_input_true_action = () => dispatch(toggle_psalter_pdf_text_input_valid(true));

    if (value_trimmed.length === 0) {
        dispatch(psalter_pdf_text_input(value));

    } else if (Number.isNaN(last_char_int)) {
        dispatch(toggle_psalter_pdf_text_input_valid(false));
        string_input_error_alert(set_text_input_true_action);
        dispatch(psalter_pdf_text_input(value_trimmed.slice(0, -1)));

    } else if (value_int > max_value) {
        dispatch(toggle_psalter_pdf_text_input_valid(false));
        wrong_number_error_alert(max_value)(set_text_input_true_action);
        dispatch(psalter_pdf_text_input(value_trimmed.slice(0, -1)));

    } else if (is_present_type('number')(value_int) && value_int <= max_value) {
        dispatch(psalter_pdf_text_input(value));
    }
};

const on_page_change = (dispatch) => (pg, num) => {
    dispatch(set_temp_psalter_pdf_page_no(pg));
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


        const on_psalter_selected     = on_select_psalter_action(this.props.dispatch)(this.props.valid_psalter_pdf_text_input);
        const on_psalter_input_change = on_psalter_text_change(this.props.dispatch)(413);


        //umber_input =  (end_text_action) => (change_text_action) => (text_is_valid) => (value) => (style) => (props) =>

        const num_input_field = Number_input(on_psalter_selected)(on_psalter_input_change)(true)(this.props.psalter_pdf_input)()();

        const select_tab = (dispatch) => (psalter_index) => (pdf_page_to_psalter_index_obj) => (temp_psalter_pdf_page_number_for_pdf) => (tab_index) => () => {
            if (tab_index === 0) {
                const new_psalter_index = pdf_page_to_psalter_index_obj[temp_psalter_pdf_page_number_for_pdf]
                    || pdf_page_to_psalter_index_obj[temp_psalter_pdf_page_number_for_pdf - 1] + 1;

                const pdf_page_did_change = !Number.isNaN(temp_psalter_pdf_page_number_for_pdf)
                    && !Number.isNaN(new_psalter_index)
                    && psalter_index !== new_psalter_index;

                if (pdf_page_did_change) {
                    dispatch(lock_in(new_psalter_index));
                    dispatch(reset_temp_psalter_pdf_page_no());
                }
            }
        };

        const tab_actions = [
            select_tab(this.props.dispatch)(this.props.psalter_index)(this.props.pdf_page_to_psalter_index_obj)(this.props.temp_psalter_pdf_page_number_for_pdf)
        ];
        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Pdf source={pdf_file}
                         scale={1}
                         style={pdf_style}
                         horizontal={true}
                         page={this.props.psalter_score_page}
                         onScaleChanged={on_scale}
                         onPageChanged={on_page_change(this.props.dispatch)}/>
                </View>
                <View style={{paddingHorizontal: sizes.large, paddingVertical: sizes.default, flexDirection: 'row'}}>
                    {num_input_field}
                </View>

            </Default_Bg_w_Tab_Bar>
        );
    }
}
;


function mapStateToProps(state) {
    return {
        psalter_index: state.psalter.index
        , psalter_score_page: state.psalter.content.scoreRef
        , pdf_page_to_psalter_index_obj: state.pdf_page_to_psalter_index_obj
        // state reducer
        , psalter_pdf_input: state.psalter_pdf_input
        , valid_psalter_pdf_text_input: state.valid_psalter_pdf_text_input
        , temp_psalter_pdf_page_number_for_pdf: state.temp_psalter_pdf_page_number_for_pdf
    };
}

export default connect(mapStateToProps, null)(Psalter_PDF);