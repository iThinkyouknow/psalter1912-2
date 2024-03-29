import React from 'react';
import {
    Text
    , StyleSheet
    , Animated
    , Platform
    , View
    , TouchableHighlight
    , Image
} from 'react-native';

import {
    Default_Text
} from './Text'

import {
    colors
    , font_sizes
    , font_size_fn
    , text_align_fn
    , font_weight_fn
    , line_height_fn
    , line_heights
    , native_elements
    , buttons
    , sizes
    , is_iPhone_X
} from './common.styles';

import {
    select_tab_index
} from '../redux/actions/tab-bar-actions';

const styles = StyleSheet.create({
    tab_bar: {
        paddingTop: sizes.default / 2,
        height: native_elements.tab_bar
        , flex: 0
        , flexDirection: 'row'
        , justifyContent: 'space-between'
        , alignItems: 'flex-start'
        , marginBottom: is_iPhone_X ? native_elements.x_bottom_safe_area : 0
    }
    , button: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
    // , button_image_container: {
    //     height: buttons.medium
    //     , width: buttons.medium,
    //     alignItems: 'center',
    //     justifyContent: 'center'
    // }
    , button_image: {
        height: buttons.medium
        , width: buttons.medium
    }
});

const get_buttons = (selected_index) => ({text, icon_default, icon_selected, on_press}, index) => {

    const icon = (selected_index === index) ? icon_selected : icon_default;

    return (
        <TouchableHighlight key={`tab-bar-button-${text}-${index}`}
                            style={styles.button}
                            underlayColor={'transparent'} onPress={on_press(index)} >
            <View>
                <Image style={styles.button_image} source={icon} />

                <Default_Text text_align={'center'} font_size={'xx_small'}>{text}</Default_Text>
            </View>
        </TouchableHighlight>
    );
};

export const select_tab_action = (navigator) => (dispatch) => (tab_index) => () => {
    navigator.switchToTab({
        tabIndex: tab_index
    });
    dispatch(select_tab_index(tab_index));
};

const on_press_actions = (select_tab_action_wo_index) => (other_actions_array) => (index) => () => {

    const actions_w_index = index => action => action(index)();

    other_actions_array.map(actions_w_index(index));
    select_tab_action_wo_index(index)();
};

export default Tab_Bar = (dispatch) => (navigator) => (other_actions_array = []) => (other_styles) => (selected_index) => {
    const select_tab_action_wo_index = select_tab_action(navigator)(dispatch);
    const on_press_actions_wo_index = on_press_actions(select_tab_action_wo_index)(other_actions_array || []);


    const buttons = [
        {
            text: 'Psalter'
            , icon_default: require('../../images/icons/icon-open-book.png')
            , icon_selected: require('../../images/icons/icon-open-book-fill.png')
            , on_press: on_press_actions_wo_index
        }
        , {
            text: 'Score'
            , icon_default: require('../../images/icons/icon-music-score.png')
            , icon_selected: require('../../images/icons/icon-music-score-fill.png')
            , on_press: on_press_actions_wo_index
        }
        , {
            text: 'Creeds'
            , icon_default: require('../../images/icons/icon-creeds.png')
            , icon_selected: require('../../images/icons/icon-creeds-fill.png')
            , on_press: on_press_actions_wo_index
        }
        , {
            text: 'Bible'
            , icon_default: require('../../images/icons/icon-bible.png')
            , icon_selected: require('../../images/icons/icon-bible-fill.png')
            , on_press: on_press_actions_wo_index
        }
        , {
            text: 'Special'
            , icon_default: require('../../images/icons/icon-special.png')
            , icon_selected: require('../../images/icons/icon-special-fill.png')
            , on_press: on_press_actions_wo_index
        }
    ].map(get_buttons(selected_index));

    return (
      <View style={[styles.tab_bar, other_styles]}>
          {buttons}
      </View>
    );
};
