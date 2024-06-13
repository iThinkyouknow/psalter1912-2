import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Navigation } from 'react-native-navigation';
import {
    View
    , FlatList
    , Image
    , TouchableHighlight
    , Linking
    , Dimensions
} from 'react-native';

import {
    colors
    , sizes
    , border_radii
} from '../../common/common.styles';

import {
    Default_Text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';

import {} from '../../utils/alert';

const data = [
    {
        title: '"Through Endless Ages Sound His Praise": The History of Psalm-Singing in the Church'
        , author: 'Rev. Brian Huizinga'
        , publication: 'The Standard Bearer'
        , link: 'https://standardbearer.rfpa.org/node/54271'
    }
    , {
        title: 'Our Psalter: 100 Years of Praise (1) Called to Sing Psalms'
        , author: 'Rev. David Overway'
        , publication: 'The Standard Bearer'
        , link: 'https://standardbearer.rfpa.org/articles/o-ur-psalter-100-years-praise-1-called-sing-psalms'
    }
    , {
        title: 'Basil the Great (c. A.D. 330-c. A.D. 379) on Psalm Singing'
        , author: 'The Great Basil'
        , publication: 'The Standard Bearer'
        , link: 'https://standardbearer.rfpa.org/articles/basil-great-c-ad-330-c-ad-379-psalm-singing'
    }
    , {
        title: 'Worship the Lord in Psalms'
        , author: 'Prof. Herman Hanko'
        , publication: 'The Standard Bearer'
        , link: 'https://standardbearer.rfpa.org/node/51294'
    }
    , {
        title: 'The Secession of 1857: A Return to Psalm-Singing'
        , author: 'Rev Cory Griess'
        , publication: 'The Standard Bearer'
        , link: 'https://standardbearer.rfpa.org/node/53694'
    }
    , {
        title: 'Singing the Imprecatory Psalms'
        , author: 'Rev Ronald Hanko'
        , publication: 'The Standard Bearer'
        , link: 'https://standardbearer.rfpa.org/node/54274'
    }

]

const resources_key_ext = (item, index) => `resources-${item.title}-${index}`;

const open_link = (link) => () => Linking.openURL(link);

const resources_renderer = ({item}) => {

    const container_style = {
        marginTop: sizes.large
        , marginHorizontal: sizes.large
        , borderColor: 'rgba(0, 0, 0, 0.1)'
        , borderWidth: 1
        , borderRadius: border_radii.x_large
        , padding: sizes.large
        , overflow: 'hidden'
        , backgroundColor: 'rgba(0, 0, 0, 0.2)'
        , shadowColor: colors.black
        , shadowOffset: {
            width: sizes.default
            , height: sizes.default
        }
        , justifyContent: 'space-between'
    };

    return (
        <TouchableHighlight underlayColor={'transparent'} onPress={open_link(item.link)}>
            <View style={container_style}>
                <Image style={{position: 'absolute'}} source={require('../../../images/website.jpg')} resizeMode={'contain'}/>
                <View style={{position: 'absolute', flex: 1, height: 500, width: 500, backgroundColor: 'rgba(0, 0 , 0, 0.4)'}} />
                <View>
                    <Default_Text font_size={'large'} font_weight="bold">{item.title}</Default_Text>
                </View>
                <View style={{marginTop: sizes.large, alignItems: 'flex-end'}}>
                    <Default_Text text_align={'right'} style={{paddingTop: sizes.small}}>{item.author}</Default_Text>
                    <Default_Text style={{fontStyle: 'italic'}}>{item.publication}</Default_Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const header_component = () => {
    const {
        statusBarHeight,
    } = Navigation.constantsSync();
    
    return <Default_Text style={{marginTop: statusBarHeight}} text_align={'center'}  font_weight={'bold'} font_size={'xx_large'}>Resources</Default_Text>
};

class Resources extends Component {
    render() {
        const {height} = Dimensions.get('window');

        return (
            <Default_Bg>
                <FlatList data={data}
                        keyExtractor={resources_key_ext}
                        renderItem={resources_renderer}
                        contentInsetAdjustmentBehavior={'never'}
                        ListHeaderComponent={header_component}/>
            </Default_Bg>
        );
    }
}
;


function mapStateToProps(state) {
    return {
        // tab_bar_reducer
        tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Resources);