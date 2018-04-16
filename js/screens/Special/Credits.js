import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Image
} from 'react-native';

//import styles from './Credits.styles';
import {
    colors
    , sizes
    , font_sizes
    , zIndex
    , native_elements
    , buttons
    , border_radii
} from '../../common/common.styles';

import {
    Default_Text
    , Animated_Text
    , text_formatter
} from '../../common/Text';

import Default_bg, {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';

import {} from '../../utils/alert';
import {is_present_type} from '../../utils/functions';

const Intro_Component = () => {
    const style = {
        alignItems: 'center'
        , paddingTop: native_elements.nav_bar_std + native_elements.status_bar
    };
    return (
        <View style={style}>
            <Default_Text font_size={'x_large'}>We would like to give our heartfelt</Default_Text>
            <Default_Text font_weight={'bold'}
                          font_size={'xxx_large'}>
                GRATITUDE
            </Default_Text>
            <Default_Text font_size={'x_large'}>for the following:</Default_Text>
        </View>
    );
};

const data = [
    {
        title: 'The Lord God Almighty'
        , description: [
            {
                text: 'First & foremost, we thank God, our Lord for the fruition of this work.'
            }
            , {
                text: '\n'
            }
            , {
                is_italics: true
                , text: 'For of him, and through him, and to him, are all things: to whom be glory for ever. Amen.'
            }
            , {
                text: '- Romans 11: 36'
            }
        ]
    }
    , {
        title: 'Inspiration & Audio Files'
        , source: 'Cornelius Boon'
        , description: [
            {
                text: 'Cornelius is the developer of a different version of the  Psalter App & the contributor of the audio files with reduced file size.'
            }
        ]
    }
    , {
        title: 'Beta Testers'
        , source: 'Select Individuals'
        , description: [
            {
                text: 'We would also like to thank the beta testers for testing the app so that you get as little problems as possible inn using this app - they know who they are 😄.'
            }
        ]
    }
    , {
        title: 'The Bible'
        , source: 'thiagobodruk'
        , description: [
            {
                text: 'The JSON file for the Bible (in King James Version) used in this app is obtained from thiagobodruk\'s GitHub repository.'
            }
            , {
                text: '\n'
            }
            , {
                text: 'We thank him for his generosity in providing this resource.'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'https://github.com/thiagobodruk/bible/blob/master/json/en_kjv.json'
            }
        ]
    }
    , {
        title: 'Confessions, Forms & Church Order'
        , source: 'Protestant Reformed Churches of America (PRCA)'
        , description: [
            {
                text: 'The Confessions, Forms, and Church Order in this app were obtained form the website of the PRCA.'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'http://www.prca.org'
            }
        ]
    }
    , {
        title: 'Psalter Scores'
        , source: 'Google'
        , description: [
            {
                text: 'The original book is in public domain, having its copyright expired, and was digitized by Google.'
            }
        ]
    }
    , {
        title: 'Music for the Psalters'
        , source: 'Protestant Reformed Churches of America (PRCA)'
        , description: [
            {
                text: 'The music were also obtained from the website of the PRCA.'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'http://www.prca.org'
            }
        ]
    }
    , {
        title: 'Cross References for the Psalms'
        , source: 'Bible Study Tools'
        , description: [
            {
                text: 'The cross references for the Psalms were obtained from the website using the English Standard Version (ESV) of the Bible.'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'http://www.biblestudytools.com/'
            }
        ]
    }
    , {
        title: 'Icons'
        , source: 'Icons 8'
        , description: [
            {
                text: 'The icons were obtained from Icons 8, with a "Creative Commmons Attribution-NoDerivs 3.0 Unported" licence'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'https://icons8.com/'
            }
        ]
    }
    , {
        title: 'Durwent Font'
        , source: '1001Fonts'
        , description: [
            {
                text: 'The font for "The Psalter" and the like is "Durwent" and was obtained from 1001Fonts, with a "1001Fonts Free For Commercial Use License (FFC)"'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'http://www.1001fonts.com/'
            }
        ]
    }
    , {
        title: 'App Icon'
        , source: 'Appicon.build'
        , description: [
            {
                text: 'The App Icon was generated from'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'http://appicon.build/'
            }
        ]
    }
    , {
        title: 'Screenshots wrapped in Devices'
        , source: 'MockuPhone'
        , description: [
            {
                text: 'The screenshots on the website were generated from'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'http://mockuphone.com/'
            }
        ]
    }
    , {
        title: 'Images'
        , source: 'Pexels & Wikimedia'
        , description: [
            {
                text: 'The images of scenary were obtained from Pexel and Wikimedia, with Creative-Commons or No Attribution licences'
            }
            , {
                text: '\n'
            }
            , {
                is_link: true,
                text: 'https://pexels.com/'
            }
        ]
    }
];

const key_extractor = (item, index) => `thanks-${item.title}-${index}`;


const Thanks_Party_Component = ({item, index}) => {
    const desc = text_formatter(item.description)(0)(`thanks-body`)(false)([]);

    return (
        <View style={{padding: sizes.large}}>
            <Default_Text text_align={'center'} font_weight={'bold'} font_size={'x_large'} >{item.title}</Default_Text>
            {is_present_type('string')(item.source) &&
                <Default_Text style={{marginTop: sizes.default}} text_align={'center'}>
                    Source:&nbsp;
                    <Default_Text font_weight="bold">
                        {item.source}
                    </Default_Text>
                </Default_Text>
            }
            <Default_Text style={{marginTop: sizes.default}} text_align={'center'}>{desc}</Default_Text>
        </View>
    );
};

class Credits extends Component {
    render() {
        const tab_actions = [];

        return (
            <Default_Bg_w_Tab_Bar navigator={this.props.navigator}
                                  dispatch={this.props.dispatch}
                                  tab_bar_selected_index={this.props.tab_bar_selected_index}
                                  other_actions_array={tab_actions}>
                <FlatList ListHeaderComponent={Intro_Component}
                          data={data}
                          keyExtractor={key_extractor}
                          renderItem={Thanks_Party_Component} />


            </Default_Bg_w_Tab_Bar>
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

export default connect(mapStateToProps, null)(Credits);