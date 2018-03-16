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
    book: {
        backgroundColor: 'green',
        width: 75,
        height: 75 * 1.4,
        marginBottom: 0
    },
    header_container: {
        backgroundColor: colors.ocean,
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
        flex: 0
    },
    header_book_container_forms: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
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
        height: 32 + sizes.default * 2
    },
    column_wrapper: {
        marginTop: 16
    }
});
