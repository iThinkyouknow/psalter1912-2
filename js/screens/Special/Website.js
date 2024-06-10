import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    WebView
} from 'react-native';

import Default_Bg from '../../common/Default-bg';

import {} from '../../utils/alert';

class Website extends Component {
    render() {

        return (
            <Default_Bg>
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