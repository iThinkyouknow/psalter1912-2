import {
    StyleSheet
    , Dimensions
} from 'react-native';

import {
    native_elements
    , sizes
    , border_radii
    , colors
    , is_iPhone_X
    , buttons
    , line_height_fn
    , font_sizes
    , zIndex
} from '../../common/common.styles';

export default styles = StyleSheet.create({
    book: {
        width: 75,
        height: 75 * 1.4,
        marginBottom: 0
    },
    header_container: {
        backgroundColor: colors.dark_cerulean,
        flexDirection: 'row'
    },
    header_image: {
        position: 'absolute'
    },
    header_img_mask: {
        position: 'absolute',
        backgroundColor: 'rgb(0, 0, 0)',
        opacity: 0.5
    },
    header_title_container: {
        marginLeft: sizes.x_large,
        marginTop: 32,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        flex: 1
    },
    header_book_container: {
        justifyContent: 'center',
        flex: 0,
        transform: [
            { translateX: -8 },
            { rotate: '-25deg' }
        ]
    },
    header_book_container_forms: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        transform: [
            { rotate: '-25deg' },
            { translateX: 32 }
        ]
    },
    forms_book: {
        marginTop: 48
    },
    header_forms_title_container: {
        marginLeft: sizes.x_large + 32,
        marginTop: 32,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        flex: 2
    },
    library_selection: {
        overflow: 'hidden',
        borderRadius: border_radii.default
    },
    library_selection_image: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    library_selection_mask: {
        backgroundColor: colors.black,
        opacity: 0.5,
    },
    library_text_container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: sizes.default
    },
    flatlist_container: {
        alignItems: 'flex-start',
        backgroundColor: 'transparent'
    },
    creeds_chooser: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: sizes.default,
        height: 32,
        borderRadius: border_radii.default,
        borderColor: colors.blue,
        borderWidth: 1,
        alignItems: 'center',
        overflow: 'hidden'
    },
    default_bg: {
        alignItems: 'center'
    },
    footer_component: {
        height: native_elements.tab_bar
    },
    column_wrapper: {
        marginTop: 16
    },
    bottom_button_container: {
        position: 'absolute',
        right: sizes.large,
        bottom: sizes.default,
        width: buttons.default,
        height: buttons.default,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    button_std: {
        width: buttons.default,
        height: buttons.default
    },
    text_input_container: {
        width: Dimensions.get('window').width * 0.8,
        height: buttons.large,
        position: 'absolute',
        left: sizes.large,
        bottom: sizes.default,
    },
    text_input_style: {
        height: 42,
        padding: sizes.default,
        ...line_height_fn('default', font_sizes.default),
        borderRadius: border_radii.default,
        fontSize: font_sizes.default,
        backgroundColor: colors.white,
        color: colors.black
    },
    search_results: {
        backgroundColor: colors.black,
        opacity: 0.8,
        position: 'absolute',
        left: sizes.large,
        zIndex: zIndex.xxx_large,
        borderRadius: border_radii.large
    },
    search_results_separator: {
        alignSelf: 'center',
        height: 1,
        backgroundColor: colors.dark_cerulean
    },
});
