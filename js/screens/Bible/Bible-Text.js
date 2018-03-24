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
    buttons
} from '../../common/common.styles';

import {
    Default_Text,
    Animated_Text,
    text_formatter
} from '../../common/Text';

import Default_bg from '../../common/Default-bg';

import {} from '../../utils/alert';

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
                <View style={{marginTop: sizes.default, height: 1, width: Math.floor(width/8), backgroundColor: colors.ocean}} />
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

const bible_library_key_extractor = (item, index) => `bible-book-button-fake-${item}-${index}`


const bible_library = (book_list) => (book_buttons_section_header_loaded) => {
    const ot = book_list.slice(0, 39);
    const nt = book_list.slice(39);

    const sections = [
        {data: ot, title: 'Old Testament' },
        {data: nt, title: 'New Testament'}
    ];


    return (
        <SectionList sections={sections}
                     renderSectionHeader={book_buttons_section_header_loaded}
                     renderItem={() => null}
                     keyExtractor={bible_library_key_extractor}
                      />
    );
}

class Bible_Text extends Component {

    render() {

        const library_style = {
            position: 'absolute',
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            left: 0,
            bottom: 0,
            backgroundColor: colors.black,
            opacity: 0.8,
            zIndex: zIndex.small
        };

        const book_buttons_section_header_loaded = book_buttons_section_header(book_button(Dimensions.get('window')));

        return (
            <Default_bg >
                <Animated.View style={library_style}>
                    {bible_library(this.props.book_list)(book_buttons_section_header_loaded)}
                </Animated.View>
                {Chapter_Component(this.props.chapter)}
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