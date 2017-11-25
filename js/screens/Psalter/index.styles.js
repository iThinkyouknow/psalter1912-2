import {
    StyleSheet
} from 'react-native';

export const colors = {
    ocean: 'rgb(0, 84, 147)'
};

const background_color_fn = (col) => {
    return {
        backgroundColor: colors[col] || col
    }
}

export default styles = StyleSheet.create({
    background: {
        ...background_color_fn('ocean'),
        // flex: 1,
    }
});