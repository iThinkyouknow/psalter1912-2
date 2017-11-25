import React from 'react';
import {
    View,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';

import styles from './index.styles';
import {colors} from '../../common/common.styles';

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


    const render_item = ({item}) => {
        return (
          <View style={{paddingHorizontal: 50}}>
              <Text>{item}</Text>
          </View>

        )
    };

    const keyExtractor = (item, i) => i;
    const {no, title, content, meter, psalm, score_ref, ref} = props.psalter;
    const data = content;

    const header = (
      <View>
          <Text>Psalter {no}</Text>
          <Text>{title}</Text>
          <Text>Psalm {psalm}</Text>
          <Text>Meter: {meter}</Text>
      </View>
    );

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