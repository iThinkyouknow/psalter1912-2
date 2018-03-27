import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    FlatList,
    Animated,
    Platform,
    Dimensions,
    SectionList,
    TouchableHighlight
} from 'react-native';

// import styles from './creeds-text.styles';
import {
    colors,
    sizes,
    font_sizes,
    zIndex,
    native_elements,
    buttons,
    border_radii
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text,
    text_formatter
} from '../../common/Text';

import Default_bg from '../../common/Default-bg';

import {} from '../../utils/alert';
import {slide_down_animation} from '../../utils/animation';

import {is_present_type} from '../../utils/functions';

import {} from '../../redux/actions/state-actions';
// import {} from '../../redux/actions/bible-actions';

// import styles from './Creeds-Text.styles';

const Header_Text_Component = (font_size) => (other_style) => (text) => {
    return (
        <Animated_Text text_align={'center'}
                       font_size={font_size}
                       style={other_style}
                       font_weight={'bold'}>
            {text}
        </Animated_Text>
    );
};

const list_header_component = (title) => (description) => {
    return (
        <View>
            {Header_Text_Component(font_sizes.xx_large)()(title)}
            {(description.length > 0) && Header_Text_Component(font_sizes.x_large)({marginTop: sizes.default})(description)}
        </View>
    );
};

const bible_key_extractor = (item, index) => `${item.title}-${index}`;

const bible_body_component = ({item, index}) => {
    const text_component = (
        <Animated_Text style={{marginTop: sizes.large}}>
            <Default_Text>{`${index + 1}. `}</Default_Text>
            {text_formatter(item.filter(text => !text.is_footnote))(0)(`bible-text`)(false)([])}
        </Animated_Text>
    );

    return text_component;
};

const Chapter_Component = (chapter) => {

    return (
        <FlatList data={chapter.content.slice(1)}
                  ListHeaderComponent={list_header_component(chapter.title)(chapter.description)}
                  keyExtractor={bible_key_extractor}
                  style={{paddingHorizontal: sizes.large * 1.5, marginVertical: sizes.default}}
                  renderItem={bible_body_component}/>
    );
};



const library_slide_down_animation = slide_down_animation(500)(12);

const book_button = ({width, height}) => (item, index) => { //work on
    const box_width = Math.floor(width / 6);

    const bible_books_button = {
        width: box_width,
        height: box_width,
        // backgroundColor: index % 2 ? 'red' : 'blue',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <TouchableHighlight style={bible_books_button} key={`bible-book-button-${item}-${index}`}>
            <View>
                {Header_Text_Component(font_sizes.large)()(item)}
                <View style={{marginTop: sizes.default, height: 1, width: Math.floor(width/8), backgroundColor: colors.dark_cerulean}} />
            </View>

        </TouchableHighlight>
    );
};

const book_buttons_section_header = (book_button_component_loaded) => ({section: {title, data}}) => {

    const buttons_component = data.map(book_button_component_loaded);

    return (
        <View style={{marginTop: sizes.default * 3}}>
            {Header_Text_Component(font_sizes.x_large)()(title)}
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                {buttons_component}
            </View>

        </View>

    );
}

const bible_library_key_extractor = (item, index) => `bible-book-button-fake-${item}-${index}`;


const bible_library = (book_list) => (book_buttons_section_header_loaded) => {
    const ot = book_list.slice(0, 39);
    const nt = book_list.slice(39);

    const sections = [
        {data: ot, title: 'Old Testament' },
        {data: nt, title: 'New Testament'}
    ];

    const bible_library_style = {
        flexShrink: 0,
        marginTop: sizes.large,
        marginBottom: sizes.x_large + 40
    };


    return (
        <SectionList sections={sections}
                     renderSectionHeader={book_buttons_section_header_loaded}
                     renderItem={() => null}
                     keyExtractor={bible_library_key_extractor}
                     style={bible_library_style}
                      />
    );
};

const close_library_action = (dispatch) => () => {
    library_slide_down_animation.slide();
};

const close_library_button = ({width}) => (close_library_action) => {
    const close_library_button_style =
    {
        flexShrink: 0,
        position: 'absolute',
        flexDirection: 'row',
        bottom: sizes.default,
        height: 40,
        borderRadius: border_radii.default,
        borderColor: colors.blue,
        borderWidth: 1,
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: sizes.medium,
        // backgroundColor: colors.blue
    };

    const close_library_button_dyn_style = {
        width: Math.floor(width * 1/3)
    };


    return (
        <TouchableHighlight onPress={library_slide_down_animation.slide}
                            underlayColor={colors.blue}
                            style={[close_library_button_style, close_library_button_dyn_style]}>
            <View style={{flex: 1}}>
                <Default_Text text_align={'center'}>Cancel</Default_Text>
            </View>
        </TouchableHighlight>
    );

};

class Bible_Text extends Component {

    static navigatorStyle = {
        navBarHidden: true,
        // tabBarHidden: true
    };




    render() {

        const library_dynamic_style = {
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            // bottom: Dimensions.get('window').height,
            bottom: 0,
            transform: [
                {translateY: library_slide_down_animation.animated_value}
            ]
        };

        const library_style = {
            position: 'absolute',
            left: 0,
            backgroundColor: colors.black,
            opacity: 0.8,
            zIndex: zIndex.small,
            alignItems: 'center'
        };

        const book_buttons_section_header_loaded = book_buttons_section_header(book_button(Dimensions.get('window')));

        return (
            <Default_bg >
                <Animated.View style={[library_style, library_dynamic_style]}>
                    <View style={{flexDirection: 'row', alignSelf: 'flex-start', overflow: 'hidden', left: -150}}>
                        {bible_library(this.props.book_list)(book_buttons_section_header_loaded)}
                        <Default_Text style={{flexShrink: 0}}>Apple</Default_Text>
                    </View>

                    {close_library_button(Dimensions.get('window'))(close_library_action(this.props.dispatch))}
                </Animated.View>
                {Chapter_Component(this.props.chapter)}
                <View style={{alignItems: 'flex-end'}}>
                    <TouchableHighlight underlayColor={colors.blue} style={{justifyContent: 'center', minWidth: buttons.default, height: native_elements.nav_bar_std}} onPress={library_slide_down_animation.slide}>
                        <View>
                            <Default_Text>Open</Default_Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </Default_bg>
        );
    }

}
;


function mapStateToProps(state) {
    return {
        book_list: state.bible_book_list,
        chapter: state.bible_chapter
    };
}

export default connect(mapStateToProps, null)(Bible_Text);