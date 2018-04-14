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
} from './common.styles';

const styles = StyleSheet.create({
    tab_bar: {
        height: native_elements.tab_bar
        , flex: 0
        , flexDirection: 'row'
        , justifyContent: 'space-between'
        , alignItems: 'center'
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

export default Tab_Bar = (on_press_actions_wo_index) => (other_styles) => (selected_index) => {

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
            , icon_default: require('../../images/icons/icon-bible.png')
            , icon_selected: require('../../images/icons/icon-bible-fill.png')
            , on_press: on_press_actions_wo_index
        }
    ].map(get_buttons(selected_index));

    return (
      <View style={[styles.tab_bar, other_styles]}>
          {buttons}
      </View>
    );
};
