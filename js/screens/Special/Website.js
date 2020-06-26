import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    WebView
} from 'react-native';

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';

import {} from '../../utils/alert';

class Website extends Component {
    render() {
        const tab_actions = [];
        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props} >
                <WebView source={{uri: 'http://psalterapp.weebly.com/'}}/>
            </Default_Bg>
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