import React from 'react';
import {
    StyleSheet
} from 'react-native';

import { sizes, colors } from '../../common/common.styles';

export default styles = StyleSheet.create({
    text_input: {
        flex: 1
        , padding: sizes.large
        , color: colors.white
    }
    , pro_tip_container: {
        paddingVertical: sizes.x_large
        , paddingHorizontal: sizes.x_large * 3
        , alignItems: 'center'
    }
    , bottom_buttons_container_extra: { 
        justifyContent: 'space-evenly'
        , marginBottom: sizes.x_large 
    }
});