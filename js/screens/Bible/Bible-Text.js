import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View
    , FlatList
    , Animated
    , Platform
    , Dimensions
    , SectionList
    , TouchableHighlight
    , Image
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

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';

import {Rounded_Button} from '../../common/Rounded-Button';


import {} from '../../utils/alert';
import {slide_down_animation, slide_side_animation} from '../../utils/animation';

import {is_present_type, no_op} from '../../utils/functions';
import {swipe, swipe_side_action, scroll_swipe_actions} from '../../utils/touch-gestures';

import {bible_toggle_back_to_book_buttons} from '../../redux/actions/state-actions';

import {
    get_bible_chapter_list
    , get_bible_passage
} from '../../redux/actions/bible-actions';

import {
    lock_in
} from '../../redux/actions/psalter-actions';

import {
    on_psalter_change
} from '../Psalter'


// import styles from './Creeds-Text.styles';

const Header_Text_Component = (font_size) => (font_family) => (other_style) => (text) => {
    return (
        <Animated_Text text_align={'center'}
                       font_size={font_size}
                       font_family={font_family}
                       style={other_style}
                       >
            {text}
        </Animated_Text>
    );
};

const list_header_component = (title) => (description) => {
    return (
        <View style={{
            paddingHorizontal: sizes.large * 1.5,
            paddingTop: 3 * sizes.default + native_elements.status_bar,
            marginBottom: 0
        }}>
            {Header_Text_Component(font_sizes.xxxxx_large)('Durwent')()(title)}
            {(description.length > 0) && Header_Text_Component(font_sizes.x_large)()({marginTop: sizes.default})(description)}
        </View>
    );
};

const bible_key_extractor = (item, index) => `${item.title}-${index}`;

const bible_body_component = ({item, index}) => {
    const text_component = (
        <Animated_Text text_align={'justify'} style={{marginTop: sizes.large, paddingHorizontal: sizes.large * 1.5}}>
            <Default_Text>{`${index + 1}. `}</Default_Text>
            {text_formatter(item.filter(text => !text.is_footnote))(0)(`bible-text`)(false)([])}
        </Animated_Text>
    );

    return text_component;
};

const Bible_Text_Component = (swipe) => (scroll_swipe_actions) => (chapter) => {

    return (
        <FlatList data={chapter.content.slice(1)}
                  ListHeaderComponent={list_header_component(chapter.title)(chapter.description)}
                  keyExtractor={bible_key_extractor}
                  renderItem={bible_body_component}
                  onScrollEndDrag={scroll_swipe_actions}
                  {...swipe.panHandlers} />
    );
};


const library_slide_down_animation = slide_down_animation(500)(12);


const library_container_slide_anim = slide_side_animation(100)(0)(Dimensions.get('window').width);

const select_book_action = (dispatch) => (book_index) => () => {
    dispatch(get_bible_chapter_list(book_index));
    library_container_slide_anim.slide();
};


const book_button = ({width, height}) => (selected_index) => (select_book_action) => (book_start_index) => (item, index) => { //work on
    const box_width = Math.floor(width / 6);

    const true_index = is_present_type('number')(book_start_index) ? book_start_index + index : index;

    const border_style = (true_index === 18 && is_present_type('string')(item))
        ? {borderWidth: 2, borderColor: colors.blue}
        : {};

    const bible_books_button = {
        alignItems: 'center',
        justifyContent: 'center'
    };

    const bible_books_button_dyn = {
        width: box_width,
        height: box_width,
    };

    const text_extra_style = {
        color: (true_index === selected_index) ? colors.blue : colors.white
    };

    return (
        <TouchableHighlight onPress={select_book_action(true_index)}
                            style={[bible_books_button, bible_books_button_dyn, border_style]}
                            key={`bible-book-button-${item}-${index}`}>
            <View>
                {Header_Text_Component(font_sizes.large)()(text_extra_style)(item)}
                <View style={{
                    marginTop: sizes.default,
                    height: 1,
                    width: Math.floor(width / 8),
                    backgroundColor: colors.dark_cerulean
                }}/>
            </View>

        </TouchableHighlight>
    );
};


const book_buttons_section_header = (book_button_component_loaded) => ({section: {title, data, book_start_index}}) => {

    const buttons_component = data.map(book_button_component_loaded(book_start_index));

    return (
        <View style={{marginTop: sizes.default * 3}}>
            {Header_Text_Component(font_sizes.x_large)()()(title)}
            <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                {buttons_component}
            </View>
        </View>
    );
}

const bible_library_key_extractor = (item, index) => `bible-book-button-${item}-${index}`;


const bible_library = (book_list) => (book_buttons_section_header_loaded) => {
    const ot = book_list.slice(0, 39);
    const nt = book_list.slice(39);

    const sections = [
        {data: ot, title: 'Old Testament', book_start_index: 0},
        {data: nt, title: 'New Testament', book_start_index: 39}
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

const chapter_key_extractor = (item, index) => `${item}-${index}`;

const chapter_header = (width) => (title) => {
    return (
        Header_Text_Component(font_sizes.x_large)()({marginTop: sizes.default * 3, width})(title)
    );
};


const chapter_button = (book_button_loaded) => ({item, index}) => {
    return book_button_loaded(item, index);
};

const chapter_library = (chapter_header_loaded) => (book_chapters_array = []) => (ch_button_loaded) => {
    const bible_library_style = {
        flexShrink: 0,
        marginTop: sizes.large,
        marginBottom: sizes.x_large + 40
    };

    return (
        <FlatList data={book_chapters_array}
                  ListHeaderComponent={chapter_header_loaded}
                  keyExtractor={chapter_key_extractor}
                  renderItem={ch_button_loaded}
                  numColumns={6}
                  style={bible_library_style}/>
    );

};


const close_library_button = ({width}) => {
    const child_component = (
        <Default_Text text_align={'center'}>
            Cancel
        </Default_Text>
    );

    return Rounded_Button(child_component)(library_slide_down_animation.slide)(width)
};

const back_to_books_btn = ({width}) => {
    const child_component = (
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: buttons.small, height: buttons.small}}
                   source={require('../../../images/icons/icon-back-arrow.png')}/>
            <Default_Text>
                Chapters
            </Default_Text>
        </View>
    );

    return Rounded_Button(child_component)(library_container_slide_anim.slide)(width)

};

const _library_bottom_buttons_container = (width) => (close_library_button) => (back_to_books_button) => {
    const library_bottom_container_style = {
        // flexShrink: 0,
        width,
        justifyContent: 'space-around',
        position: 'absolute',
        flexDirection: 'row',
        bottom: sizes.default,
        height: 40,
        marginBottom: sizes.medium,
        // backgroundColor: 'blue'
    };

    return (
        <View style={library_bottom_container_style}>
            {close_library_button}
            {back_to_books_button}
        </View>
    );
};

const library_bottom_buttons_container = _library_bottom_buttons_container(Dimensions.get('window').width);

const select_chapter_action = (dispatch) => (book_index) => (chapter_index) => () => {
    dispatch(get_bible_passage(book_index)(chapter_index));
    library_slide_down_animation.slide();
    library_container_slide_anim.slide();

};

const _show_back_to_books_button = () => {
    let should_show = true;

    return (width) => (dispatch) => ({value}) => {
        if (should_show && value < width - 20) {
            should_show = false;
            return dispatch(bible_toggle_back_to_book_buttons(true));

        } else if (!should_show && value > width - 20) {
            should_show = true;
            return dispatch(bible_toggle_back_to_book_buttons(false));
        }
    };
};

const show_back_to_books_button = _show_back_to_books_button();


const on_psalter_and_score_tab_select = (dispatch) => (current_book_index) => (current_psalm) => (psalter_psalm) => (psalm_to_psalter_obj) => (tab_index) => () => {
    if ((tab_index === 0 || tab_index === 1) && current_book_index === 18 && current_psalm !== psalter_psalm) {
        on_psalter_change(dispatch)(psalm_to_psalter_obj[current_psalm])();
    }
};

const swipe_right_action = (dispatch) => (per_book_ch_last_index_array) => (book_index) => (ch_index) => () => {
    if (ch_index === 0) {
        if (book_index === 0) {
            const last_book_index = per_book_ch_last_index_array.length - 1;
            dispatch(get_bible_passage(last_book_index)(per_book_ch_last_index_array[last_book_index]));

        } else if (book_index > 0) {
            const prev_book_index = book_index - 1;
            dispatch(get_bible_passage(prev_book_index)(per_book_ch_last_index_array[prev_book_index]));
        }
    } else if (ch_index > 0) {
        dispatch(get_bible_passage(book_index)(ch_index - 1));
    }
};

const swipe_left_action = (dispatch) => (per_book_ch_last_index_array) => (book_index) => (ch_index) => () => {
    if (ch_index === per_book_ch_last_index_array[book_index]) {
        const last_book_index = per_book_ch_last_index_array.length - 1;

        if (book_index === last_book_index) {
            dispatch(get_bible_passage(0)(0));
        } else if (book_index < last_book_index) {
            const next_book_index = book_index + 1;
            dispatch(get_bible_passage(next_book_index)(0));
        }
    } else if (ch_index < per_book_ch_last_index_array[book_index]) {
        dispatch(get_bible_passage(book_index)(ch_index + 1));
    }
};


class Bible_Text extends Component {

    // static navigatorStyle = {
    //     navBarHidden: true,
    //     // tabBarHidden: true
    // };

    constructor(props) {
        super(props);
        library_container_slide_anim.animated_value.addListener(show_back_to_books_button(Dimensions.get('window').width)(props.dispatch));

    }

    componentWillUnmount() {
        library_container_slide_anim.animated_value.removeListener();
    }

    render() {
        const {
            navigator
            , dispatch
            , book_list
            , bible_passage
            , current_book_index
            , current_chapter_index
            , selection_chapter_list
            , selection_selected_book_title
            , selection_book_index
            , tab_bar_selected_index
            , psalter_psalm
            , first_psalter_index_of_each_psalm_obj
            , per_book_ch_last_index_array
            , bible_should_show_back_to_books_button
        } = this.props;

        const library_dynamic_style = {
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            bottom: Dimensions.get('window').height,
            // bottom: 0,
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

        const book_button_component_dimensions = book_button(Dimensions.get('window'));
        const book_button_component = book_button_component_dimensions(current_book_index)(select_book_action(dispatch));

        const book_buttons_section_header_loaded = book_buttons_section_header(book_button_component);

        const bible_library_container_style = {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            overflow: 'hidden',
            left: -Dimensions.get('window').width,
            transform: [
                {translateX: library_container_slide_anim.animated_value}
            ]
        };

        const select_chapter_action_w_book_index = select_chapter_action(dispatch)(selection_book_index);

        const selection_chapter_index = (selection_book_index === current_book_index)
            ? current_chapter_index
            : 0;

        const chapter_button_component = chapter_button(book_button_component_dimensions(selection_chapter_index)(select_chapter_action_w_book_index)(0));

        const chapter_lib_header = chapter_header(Dimensions.get('window').width)(selection_selected_book_title);

        const back_to_books_btn_present = bible_should_show_back_to_books_button ? back_to_books_btn(Dimensions.get('window')) : undefined;

        //(dispatch) => (current_book_index) => (current_psalm) => (psalter_psalm) => (psalm_to_psalter_obj) => (tab_index) => () =>

        const change_psalter_on_tab_action = (
            current_book_index === 18
            && current_chapter_index + 1 !== psalter_psalm
        )
            ? on_psalter_and_score_tab_select(dispatch)(current_book_index)(current_chapter_index + 1)(psalter_psalm)(first_psalter_index_of_each_psalm_obj)
            : () => () => {
        };

        const swipe_right_loaded = swipe_right_action(dispatch)(per_book_ch_last_index_array)(current_book_index)(current_chapter_index);

        const swipe_left_loaded = swipe_left_action(dispatch)(per_book_ch_last_index_array)(current_book_index)(current_chapter_index);

        const swipe_side_action_loaded = swipe_side_action(Math.floor(Dimensions.get('window').width / 4))(swipe_right_loaded)(swipe_left_loaded);

        const scroll_swipe_actions_loaded = Platform.OS === 'android'
            ? scroll_swipe_actions(swipe_left_loaded)(swipe_right_loaded)
            : no_op;

        const tab_actions = [
            change_psalter_on_tab_action
        ];

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props} >
                <Animated.View style={[library_style, library_dynamic_style]}>
                    <Animated.View style={bible_library_container_style}>
                        {bible_library(book_list)(book_buttons_section_header_loaded)}
                        {chapter_library(chapter_lib_header)(selection_chapter_list)(chapter_button_component)}
                    </Animated.View>

                    {library_bottom_buttons_container(close_library_button(Dimensions.get('window')))(back_to_books_btn_present)}
                </Animated.View>
                {Bible_Text_Component(swipe(swipe_side_action_loaded))(scroll_swipe_actions_loaded)(bible_passage)}

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    height: native_elements.nav_bar_std,
                    paddingHorizontal: sizes.large,
                    paddingVertical: sizes.default / 2
                }}>
                    {Rounded_Button(<Default_Text
                        text_align={'center'}>Select</Default_Text>)(library_slide_down_animation.slide)(Dimensions.get('window').width)}
                </View>
            </Default_Bg>
        );
    }
};


function mapStateToProps(state) {
    return {
        book_list: state.bible_book_list
        , bible_passage: state.bible_passage
        , current_book_index: state.bible_passage.book_index
        , current_chapter_index: state.bible_passage.chapter_index
        , selection_chapter_list: state.selection_bible_chapter_list.chapter_list
        , selection_selected_book_title: state.selection_bible_chapter_list.title
        , selection_book_index: state.selection_bible_chapter_list.book_index
        , tab_bar_selected_index: state.tab_bar_selected_index
        , psalter_psalm: state.psalter.content.psalm
        , first_psalter_index_of_each_psalm_obj: state.first_psalter_index_of_each_psalm_obj
        , per_book_ch_last_index_array: state.bible_per_book_ch_last_index_array
        , bible_should_show_back_to_books_button: state.bible_should_show_back_to_books_button // state reducer
    };
}

export default connect(mapStateToProps, null)(Bible_Text);
