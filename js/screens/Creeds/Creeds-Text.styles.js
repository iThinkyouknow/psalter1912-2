import {
    StyleSheet
} from 'react-native';

import {
    native_elements,
    sizes,
    zIndex,
    border_radii,
    font_sizes,
    colors,
    line_height_fn,
    buttons
} from '../../common/common.styles';


export default styles = StyleSheet.create({
    creeds_body_header: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: native_elements.status_bar + native_elements.nav_bar_std
    },
    flatlist_padding_horizontal: {paddingHorizontal: sizes.large * 1.5}
});
