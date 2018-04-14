import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Image
    , WebView
} from 'react-native';

//import styles from './Website.styles';
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

class Website extends Component {
    render() {
        const tab_actions = [];

        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions}>
                <WebView source={{uri: 'http://psalterapp.weebly.com/'}}/>
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

export default connect(mapStateToProps, null)(Website);