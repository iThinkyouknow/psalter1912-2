import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    FlatList,
    Animated,
    Dimensions,
    Image,
    TouchableHighlight
} from 'react-native';

// import styles from './Creeds-Categories-1.styles';
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
    Animated_Text
} from '../../common/Text';

import Default_bg from '../../common/Default-bg';

import {} from '../../utils/alert';
import {
    no_op,
    composer
} from '../../utils/functions';

import {change_creeds_chapter_lv} from '../../redux/actions/state-actions'
import {lock_in_creed_level_2} from '../../redux/actions/creeds-actions'

const header_banner = (title) => {
    const {width, height} = Dimensions.get('window');

    const header_banner_sm_style = {
        height: height / 4,
        justifyContent: 'center',
    };

    const header_banner_sm_image_style = {
        position: 'absolute',
        top: 0,
        width: 0,
        height: height / 4,
        width: width
    };

    const header_banner_sm_mask_style = {
        ...header_banner_sm_image_style,
        backgroundColor: colors.black,
        opacity: 0.5
    };

    const text_container_style = {
        backgroundColor: 'transparent',
        marginHorizontal: sizes.x_large,
        marginTop: sizes.large
    };

    return (
        <View style={header_banner_sm_style} >
            <Image style={header_banner_sm_image_style}
                   source={require('../../../images/Heidelberg-Catechism.jpg')} resizeMode={'cover'} />
            <View style={header_banner_sm_mask_style} />
            <View style={text_container_style}>
                <Default_Text font_size={font_sizes.xx_large}>{title}</Default_Text>
            </View>
        </View>
    );
};

const creed_categories_list = (component_items) => (library_type_index) => (selected_creed_index) => (title) => (content) => (creed_level) => {

    const render_creed_categories = (component_items) => (library_type_index) => (selected_creed_index) => (creed_level) => ({item, index}) => {
        const header_text = (<Default_Text font_size={'large'} font_weight={'bold'}>{item.header}</Default_Text>);

        const sub_text_component = (item.content[0] === item.header || item.content[0].length < 1 || creed_level > 1)
            ? null
            : item.content.map((text, i) => {
                const sub_title_style = {
                    marginTop: sizes.default
                };

                return (<Default_Text style={sub_title_style} key={`creeds-lv-1-sub-title-${i}`}>{text}</Default_Text>);
            });


        const categories_container_style = {
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
        };

        const go_to_next_creed_level = ({navigator = {}, dispatch = no_op}) => (library_type_index) => (selected_creed_index) => (creed_level) => (selected_chapter_index) => () => {
            if (creed_level === 2) {
                dispatch(change_creeds_chapter_lv(2));
                dispatch(lock_in_creed_level_2(library_type_index)(selected_creed_index)(selected_chapter_index));
                navigator.push({
                    screen: 'Creeds_Categories_1',
                    navigatorStyle: {
                        drawUnderNavBar: true,
                        navBarTranslucent: true
                    },
                    backButtonTitle: 'Chapters'
                });




            } else if (creed_level === undefined || creed_level < 2) {

            }
        };

        return (
            <TouchableHighlight underlayColor={colors.ocean} onPress={go_to_next_creed_level(component_items)(library_type_index)(selected_creed_index)(creed_level)(index)}>
                <View style={categories_container_style}>
                    <Default_Text>{header_text}</Default_Text>
                    <View style={{marginLeft: sizes.medium}}>
                        {sub_text_component}
                    </View>
                </View>
            </TouchableHighlight>

        );


    };

    creeds_cat_key_ext = (item, j) => `categories-${j}`;

    return (
        <FlatList ListHeaderComponent={header_banner(title)}
                  keyExtractor={creeds_cat_key_ext}
                  data={content}
                  renderItem={render_creed_categories(component_items)(library_type_index)(selected_creed_index)(creed_level)} />
    );
};


const onNavigatorEvent = (dispatch) => (creeds_chapters_curr_level) => (event) => { // this is the onPress handler for the two buttons together
    if (event.id == 'willDisappear') { // this is the event type for button presses
        if (creeds_chapters_curr_level === 2) dispatch(change_creeds_chapter_lv(1));
    }
}



class Creeds_Categories_1 extends Component {

    componentDidMount() {
        this.props.navigator.setOnNavigatorEvent(onNavigatorEvent(this.props.dispatch)(this.props.creeds_chapters_curr_level));
    }


    render() {
        const component_items = {
            navigator: this.props.navigator,
            dispatch: this.props.dispatch
        };

        const {
                  library_type_index,
                  selected_creed_index,
                  creeds_chapters_curr_level,
                  creed_articles_title,
                  creed_articles_content,
                  creed_articles_level,
                  creed_title,
                  creed_content,
                  creed_level
        } = this.props;

        const creed_categories = creed_categories_list(component_items)(library_type_index)(selected_creed_index);

        const creed_categories_list_component = (creeds_chapters_curr_level === 2)
            ? creed_categories(creed_articles_title)(creed_articles_content)(creed_articles_level)
            : creed_categories(creed_title)(creed_content)(creed_level);


        return (
            <Default_bg>
                {creed_categories_list_component}
            </Default_bg>
        )
    }
};

function mapStateToProps(state) {
    return {
        creed_content: state.creed.content,
        creed_level: state.creed.levels_deep || 0,
        creed_title: state.creed.title,
        creeds_chapters_curr_level: state.creeds_chapters_curr_level,
        library_type_index: state.creed.library_type_index,
        selected_creed_index: state.creed.selected_index,
        creed_articles_title: state.creed_level_2.title,
        creed_articles_content: state.creed_level_2.content,
        creed_articles_level: state.creed_level_2.levels_deep
    };
}

export default connect(mapStateToProps, null)(Creeds_Categories_1);