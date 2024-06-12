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
    floating_header: {
        backgroundColor: colors.dark_cerulean
        , alignSelf: 'stretch'
        , position: 'absolute'
        , top: 0
        , left: 0
        , right: 0

    },
    header_background: {
        backgroundColor: colors.dark_cerulean
    },
    standard_margin_horizontal: {
        marginHorizontal: sizes.x_large
    },
    main_text_margin_top: {
        marginVertical: sizes.default
    },
    main_text_padding_top: {
        paddingVertical: sizes.default,
        paddingTop: 3 * sizes.default + native_elements.status_bar
    },
    text_input_style: {
        flex: 1,
        padding: sizes.default,
        ...line_height_fn('default', font_sizes.default),
        borderRadius: border_radii.default,
        fontSize: font_sizes.default,
        backgroundColor: colors.white,
        color: colors.black
    },
    slide_down_view_style: {
        backgroundColor: colors.black,
        opacity: 0.8,
        position: 'absolute',
        left: 0,
        zIndex: zIndex.max
    },
    more_stuff_list_header: {
        paddingTop: native_elements.nav_bar_std + native_elements.status_bar
    },
    more_stuff_bottom_buttons_container: {
        flexDirection: 'row'
        , justifyContent: 'center'
        , height: native_elements.tab_bar
        , paddingVertical: sizes.default / 2
        , marginBottom: sizes.large
    },
    more_section_list: {
        marginBottom: sizes.default
    },
    ref_text_container: {
        paddingHorizontal: sizes.x_large,
        marginTop: sizes.default
    },
    more_info_section_container: {
        marginVertical: sizes.default
    },
    search_results_view: {
        backgroundColor: colors.black,
        opacity: 0.8,
        position: 'absolute',
        left: sizes.large,
        zIndex: zIndex.xxx_large,
        borderRadius: border_radii.large
    },

    bottom_button_container: {
        marginLeft: sizes.default,
        width: buttons.large,
        height: buttons.large,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    search_results_separator: {
        alignSelf: 'center',
        height: 1,
        backgroundColor: colors.dark_cerulean
    },
    button_std: {
        width: buttons.default,
        height: buttons.default
    }

});