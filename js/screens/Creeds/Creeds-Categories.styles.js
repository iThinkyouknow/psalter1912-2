import {
    StyleSheet
} from 'react-native';

import {
    sizes,
    border_radii,
    colors
} from '../../common/common.styles';

const _styles = {
    head_banner: {
        justifyContent: 'center'
    },
    head_banner_image: {
        position: 'absolute',
        top: 0,
        width: 0
    },
    head_banner_mask: {
        backgroundColor: colors.black,
        opacity: 0.5
    },
    text_container: {
        backgroundColor: 'transparent',
        marginHorizontal: sizes.x_large,
        marginTop: sizes.large
    },
    categories_container: {
        marginTop: sizes.large,
        marginHorizontal: sizes.large,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: border_radii.default,
        padding: sizes.large,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        shadowColor: colors.black,
        shadowOffset: {
            width: sizes.default,
            height: sizes.default
        }
    },
    sub_text_container: {
        marginLeft: sizes.medium
    }

};

export default styles = StyleSheet.create(_styles);
