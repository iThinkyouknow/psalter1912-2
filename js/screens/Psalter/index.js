import React from 'react';
import {
    View,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';

import styles from './index.styles';
import {colors, sizes} from '../../common/common.styles';

import Text from '../../common/Text';
import Default_bg from '../../common/Default-bg';

export function App(props) {
    props.navigator.setStyle({
        navBarTransparent: true,
        navBarTextColor: colors.white,
        drawUnderNavBar: true,
        navBarBackgroundColor: colors.ocean,
        screenBackgroundColor: colors.ocean,
    });


    const keyExtractor = (item, i) => i;
    const {no, title, content, meter, psalm, score_ref, ref} = props.psalter;
    const data = content;

    const composable_text = (text_align) => (font_weight) => (font_size) => (line_height) => (key) => (style) => (children) => {

        const style_values = [
            ['text_align', text_align],
            ['font_weight', font_weight],
            ['font_size', font_size],
            ['line_height', line_height]
        ].reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) return {...acc, [key]: value};
            return acc;
        }, {});

        return (
            <Text key={key}
                  style_values={style_values}
                  style={style}>
              {children}
            </Text>
        )
    };

    const centered_text = composable_text('center');
    const bold_centered_text = centered_text('bold');
    const main_title = bold_centered_text('x_large')()()();
    const sub_title = bold_centered_text('large')()()();
    const meter_text = centered_text()('x_small')()()();

    const header = (
        <View style={[styles.standard_margin_horizontal, styles.main_text_margin_top]}>
            {main_title(`Psalter ${no}`)}
            {sub_title(title)}
            {sub_title(`Psalm ${psalm}`)}
            {meter_text(`Meter: ${meter}`)}
        </View>
    );

    const render_item = ({item, index}) => {
        const texts = (Array.isArray(item)) ? item.map((line, i) => {
            const line_to_render = (i === 0) ? `${index + 1}. ${line}` : line;
            return centered_text('normal')('default')(1.3)(`line-${i}`)()(line_to_render);
        }) : item;

        return (
            <View style={[styles.standard_margin_horizontal, styles.main_text_margin_top]}>
                {texts}
            </View>
        )
    };

    return (
        <Default_bg>
            <FlatList data={data}
                      ListHeaderComponent={header}
                      renderItem={render_item}
                      keyExtractor={keyExtractor} />
        </Default_bg>
    );
};

function mapStateToProps(state) {
    return {
        psalter: state.psalter
    };
}


export default connect(mapStateToProps, null)(App);