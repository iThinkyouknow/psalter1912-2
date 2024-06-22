import React, { Component } from 'react';
import {
    View
    , Platform
    , TextInput
} from 'react-native';

import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
// import styles from './Psalter-PDF.styles';
import {
    colors
    , sizes
    , font_sizes
    , border_radii
    , line_height_fn
} from '../../common/common.styles';

import Default_Bg from '../../common/Default-bg';

import { string_input_error_alert, wrong_number_error_alert } from '../../utils/alert';

import { is_number, is_object } from '../../utils/functions';

import {
    get_bible_passage
} from '../../redux/actions/bible-actions';

import {
    lock_in
} from '../../redux/actions/psalter-actions';

import {
    set_file_source_init
} from '../../redux/actions/psalter-pdf-actions';

import {
    psalter_pdf_text_input
    , toggle_psalter_pdf_text_input_valid
    , set_temp_psalter_pdf_page_no
    , reset_temp_psalter_pdf_page_no
} from '../../redux/actions/state-actions';
import { user_settings } from '../../redux/reducers/state';
import { set_navigation_colors } from '../../..';

const _Number_input = (os) => (end_text_action, change_text_action, text_is_valid, value, style, props) => {
    const keyboard_type = (os === 'ios') ? 'number-pad' : 'numeric';

    const text_input_style = {
        flex: 1
        , padding: sizes.default
        , ...line_height_fn('default', font_sizes.default)
        , borderRadius: border_radii.default
        , fontSize: font_sizes.default
        , borderColor: colors.dark_cerulean
        , backgroundColor: colors.white
        , color: colors.black
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
            placeholderTextColor={colors.grey}
            underlineColorAndroid={'transparent'}
            {...props} />
    );
};

const Number_input = _Number_input(Platform.OS);

const on_select_psalter_action = (dispatch, text_input_is_valid) => (e) => {
    const selected_index = parseInt(e.nativeEvent.text) - 1;

    if (is_number(selected_index) && text_input_is_valid) {
        dispatch(lock_in(selected_index));
        dispatch(psalter_pdf_text_input(""));
    }
};

const on_psalter_text_change = (dispatch, max_value) => (value) => {
    const value_trimmed = value.trim();
    const last_char_int = parseInt(value_trimmed.slice(-1));
    const value_int = parseInt(value_trimmed);

    const set_text_input_true_action = () => dispatch(toggle_psalter_pdf_text_input_valid(true));

    if (value_trimmed.length === 0) {
        dispatch(psalter_pdf_text_input(value));

    } else if (Number.isNaN(last_char_int)) {
        dispatch(toggle_psalter_pdf_text_input_valid(false));
        string_input_error_alert(set_text_input_true_action);
        dispatch(psalter_pdf_text_input(value_trimmed.slice(0, -1)));

    } else if (value_int > max_value) {
        dispatch(toggle_psalter_pdf_text_input_valid(false));
        wrong_number_error_alert(max_value, set_text_input_true_action);
        dispatch(psalter_pdf_text_input(value_trimmed.slice(0, -1)));

    } else if (is_number(value_int) && value_int <= max_value) {
        dispatch(psalter_pdf_text_input(value));
    }
};

const select_tab_0 = ({dispatch, psalter_index, pdf_page_to_psalter_index_obj, temp_psalter_pdf_page_number_for_pdf}) => {
    const new_psalter_index = pdf_page_to_psalter_index_obj[temp_psalter_pdf_page_number_for_pdf]
        || pdf_page_to_psalter_index_obj[temp_psalter_pdf_page_number_for_pdf - 1] + 1;

    const pdf_page_did_change = !Number.isNaN(temp_psalter_pdf_page_number_for_pdf)
        && !Number.isNaN(new_psalter_index)
        && psalter_index !== new_psalter_index;

    if (pdf_page_did_change) {
        dispatch(lock_in(new_psalter_index));
        dispatch(reset_temp_psalter_pdf_page_no());
    }

};

const select_tab_3 = ({dispatch, psalter_psalm}) => dispatch(get_bible_passage(18, psalter_psalm - 1));


const on_page_change = (dispatch) => (pg, num) => {
    dispatch(set_temp_psalter_pdf_page_no(pg));
};

let Pdf = () => { };

const pdf_style = {
    paddingTop: sizes.large
    , backgroundColor: colors.white
    , flex: 1
};

const on_scale = (scale) => {
    scale;
};
let bottomTabEventListener;
let is_component_mounted = false;
class Psalter_PDF extends Component {

    componentDidMount() {
        is_component_mounted = true;
        Pdf = require('react-native-pdf').default;
        setTimeout(() => this.props.dispatch(set_file_source_init()), 1000);
        bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
            if (unselectedTabIndex !== 1) return;
            if (selectedTabIndex === 0) {
                select_tab_0(
                    this.props
                )
            }

            if (selectedTabIndex === 3) {
                select_tab_3(this.props)
            }
           
        });
    }

    componentWillUnmount() {
        bottomTabEventListener && bottomTabEventListener.remove();
    }

    render() {

        const {
            dispatch
            , psalter_score_page
            , psalter_pdf_input
            , valid_psalter_pdf_text_input
            , psalter_pdf_file_source
        } = this.props;

        is_component_mounted && set_navigation_colors(this.props.componentId, this.props.user_settings)

        const on_psalter_selected = on_select_psalter_action(dispatch, valid_psalter_pdf_text_input);
        const on_psalter_input_change = on_psalter_text_change(dispatch, 413);

        const num_input_field = Number_input(on_psalter_selected, on_psalter_input_change, true, psalter_pdf_input);

        const can_load_pdf = (is_number(psalter_pdf_file_source) || is_object(psalter_pdf_file_source));
        const initial_scale = Platform.OS === 'ios'
            ? 1
            : 1.5;
        return (
            <Default_Bg user_settings={this.props.user_settings}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {can_load_pdf &&
                        <Pdf source={psalter_pdf_file_source}
                            minScale={0.5}
                            maxScale={3}
                            scale={initial_scale}
                            style={pdf_style}
                            horizontal={true}
                            page={psalter_score_page}
                            enablePaging={true}
                            onScaleChanged={on_scale}
                            onPageChanged={on_page_change(dispatch)} />}
                </View>
                <View style={{ paddingHorizontal: sizes.large, paddingVertical: sizes.default, flexDirection: 'row' }}>
                    {num_input_field}
                </View>

            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        psalter_index: state.psalter.index
        , psalter_score_page: state.psalter.content.scoreRef || 14
        , psalter_psalm: state.psalter.content.psalm || 1
        , pdf_page_to_psalter_index_obj: state.psalter.pdf_page_to_psalter_index_obj
        , psalter_pdf_file_source: state.psalter_pdf_file_source
        // state reducer
        , psalter_pdf_input: state.psalter_pdf_input
        , valid_psalter_pdf_text_input: state.valid_psalter_pdf_text_input
        , temp_psalter_pdf_page_number_for_pdf: state.temp_psalter_pdf_page_number_for_pdf
        , user_settings: state.user_settings
        // tab reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Psalter_PDF);
