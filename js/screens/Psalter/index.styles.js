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
    standard_margin_horizontal: {
        marginHorizontal: sizes.x_large
    },
    main_text_margin_top: {
        marginVertical: sizes.default
    },
    text_input_style: {
        flex: 1,
        padding: sizes.default,
        ...line_height_fn('default')(font_sizes.default),
        borderRadius: border_radii.default,
        fontSize: font_sizes.default,
        backgroundColor: colors.white
    },
    slide_down_view_style: {
        backgroundColor: colors.black,
        opacity: 0.8,
        position: 'absolute',
        left: 0,
        zIndex: zIndex.max,
    },
    cancel_more_stuff_menu_cross_style: {
        position: 'absolute',
        top: sizes.large,
        right: sizes.large,
        height: sizes.x_large,
        width: sizes.x_large,
        justifyContent: 'center',
        alignItems: 'center'
    },
    more_stuff_header_style: {
        marginTop: native_elements.status_bar,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: sizes.x_large + sizes.large
    },
    more_section_list: {
        marginBottom: sizes.x_large
    },
    ref_text_container: {
        paddingHorizontal: sizes.x_large,
        marginTop: sizes.default
    },
    more_info_section_container: {
        marginTop: sizes.default
    },
    search_results_view: {
        backgroundColor: colors.black,
        opacity: 0.8,
        position: 'absolute',
        left: sizes.large,
        zIndex: zIndex.max,
        borderRadius: border_radii.large
    },

    search_button_container: {
        marginLeft: sizes.default,
        width: buttons.large,
        height: buttons.large,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    search_results_separator: {
        alignSelf: 'center',
        height: 1,
        backgroundColor: colors.dark_cerulean},
    button_std: {
        width: buttons.default,
        height: buttons.default
    }

});