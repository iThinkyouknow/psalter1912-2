import React from 'react';
import {
    View,
    StyleSheet,

} from 'react-native';

import {colors, background_color_fn} from './common.styles';

import {
    select_tab_index
} from '../redux/actions/tab-bar-actions';

import Tab_Bar from '../common/Tab-bar';

export default function Default_bg(props = {}) {
    return (
        <View style={[styles.background_col, styles.flex, {bottom: 0}, props.style]}>
            {props.children}
        </View>
    )
};

const styles = StyleSheet.create({
    background_col: background_color_fn('dark_cerulean'),
    flex: {
        flex: 1
    }
});


const select_tab_action = (navigator) => (dispatch) => (index) => () => {
    navigator.switchToTab({
        tabIndex: index
    });
    navigator.popToRoot();
    dispatch(select_tab_index(index));
};


export const Default_Bg_w_Tab_Bar = (props = {}) => {
    const select_tab_action_wo_index = select_tab_action(props.navigator)(props.dispatch);

    return (
        <Default_bg style={props.style}>
            {props.children}
            {Tab_Bar(select_tab_action_wo_index)()(props.tab_bar_selected_index)}
        </Default_bg>
    );
};