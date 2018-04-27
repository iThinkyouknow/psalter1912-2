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

import styles from './Creeds-Categories.styles';
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

import Default_Bg from '../../common/Default-bg';
import Tab_Bar from '../../common/Tab-bar';

import {} from '../../utils/alert';
import {
    no_op,
    composer
} from '../../utils/functions';

import {change_creeds_chapter_lv} from '../../redux/actions/state-actions';
import {lock_in_creed_level_2, lock_in_creed_body} from '../../redux/actions/creeds-actions';

import {creeds_images_array, scenary_images_array, churches_images_array} from '../../utils/images'


const header_banner = ({Dimensions, styles}) => (title) => {
    const {width, height} = Dimensions.get('window');

    const header_banner_sm_style = {
        height: height / 4
    };

    const header_banner_sm_image_style = {
        height: height / 4,
        width: width
    };

    return (
        <View style={[styles.head_banner, header_banner_sm_style]}>
            <Image style={[styles.head_banner_image, header_banner_sm_image_style]}
                   source={require('../../../images/Heidelberg-Catechism.jpg')} resizeMode={'cover'}/>
            <View style={[styles.head_banner_image, header_banner_sm_image_style, styles.head_banner_mask]}/>
            <View style={[styles.text_container]}>
                <Default_Text font_size={font_sizes.xx_large}>{title}</Default_Text>
            </View>
        </View>
    );
};


const go_to_next_creed_level = ({navigator = {}, dispatch = no_op}) => (library_type_index) => (selected_creed_index) => (creed_level) => (selected_chapter_index) => (selected_article) => () => {
    if (creed_level === 2) {
        dispatch(change_creeds_chapter_lv(2));
        dispatch(lock_in_creed_level_2(library_type_index)(selected_creed_index)(selected_chapter_index));
        navigator.push({
            screen: 'Creeds_Categories',
            navigatorStyle: {
                drawUnderNavBar: true,
                navBarTranslucent: true
            },
            backButtonTitle: 'Chapters'
        });

    } else if (creed_level === undefined || creed_level < 2) {
        dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(selected_chapter_index)(selected_article));
        navigator.push({
            screen: 'Creeds_Text',
            navigatorStyle: {
                drawUnderNavBar: true,
                navBarTranslucent: true
            },
            backButtonTitle: 'Chapters'
        });
    }
};

const render_creed_categories = ({styles}) => (creed_level) => (selected_chapter_index) => (go_to_next_creed_level_action) => ({item, index}) => {
    const header_text = (<Default_Text font_size={'large'} font_weight={'bold'}>{item.header}</Default_Text>);

    const sub_text_component = (item.content[0] === item.header || item.content[0].length < 1 || creed_level > 1)
        ? null
        : item.content.map((text, i) => {
        const sub_title_style = {
            marginTop: sizes.default
        };

        return (<Default_Text style={sub_title_style} key={`creeds-lv-1-sub-title-${i}`}>{text}</Default_Text>);
    });

    const go_to_creeds_text = (selected_chapter_index >= 0)
        ? go_to_next_creed_level_action(selected_chapter_index)(index)
        : go_to_next_creed_level_action(index)();

    return (
        <TouchableHighlight underlayColor={colors.dark_cerulean}
                            onPress={go_to_creeds_text}>
            <View style={[styles.categories_container]}>
                <Default_Text>{header_text}</Default_Text>
                <View style={[styles.sub_text_container]}>
                    {sub_text_component}
                </View>
            </View>
        </TouchableHighlight>

    );
};

const creed_categories_list = (header_banner_component) => (content) => (render_creed_categories) => {

    const creeds_cat_key_ext = (item, j) => `categories-${j}`;

    return (
        <FlatList ListHeaderComponent={header_banner_component}
                  keyExtractor={creeds_cat_key_ext}
                  data={content}
                  renderItem={render_creed_categories}/>
    );
};

const tab_2_actions = (navigator) => () => navigator.popToRoot();

const select_tab = (tab_2_actions) => (tab_index) => () => {
    if (tab_index === 2) {
        tab_2_actions();
    }
};


class Creeds_Categories extends Component {

    componentWillUnmount() {
        if (this.props.creeds_chapters_curr_level === 2) this.props.dispatch(change_creeds_chapter_lv(1));
    }

    render() {
        const {
            dispatch
            , navigator
            , creed_content
            , creed_level
            , creed_title
            , creeds_chapters_curr_level
            , library_type_index
            , selected_creed_index
            , creed_articles_title
            , creed_articles_content
            , creed_articles_level
            , selected_chapter_index
            , tab_bar_selected_index
        } = this.props;

        const component_obj = {
            styles,
            images: {
                creeds_images_array,
                scenary_images_array,
                churches_images_array
            },
            random: Math.random,
            Dimensions,
            navigator: navigator,
            dispatch: dispatch
        };

        const header_banner_w_title = (creeds_chapters_curr_level === 2)
            ? header_banner(component_obj)(creed_articles_title)
            : header_banner(component_obj)(creed_title);

        const go_to_next_creed_level_action = (creeds_chapters_curr_level === 2)
            ? go_to_next_creed_level(component_obj)(library_type_index)(selected_creed_index)(creed_level - 1)
            : go_to_next_creed_level(component_obj)(library_type_index)(selected_creed_index)(creed_level);

        const render_creed_categories_w_data = (creeds_chapters_curr_level === 2)
            ? render_creed_categories(component_obj)(creed_level - 1)(selected_chapter_index)(go_to_next_creed_level_action)
            : render_creed_categories(component_obj)(creed_level)()(go_to_next_creed_level_action);

        const creed_categories_list_component = (creeds_chapters_curr_level === 2)
            ? creed_categories_list(header_banner_w_title)(creed_articles_content)(render_creed_categories_w_data)
            : creed_categories_list(header_banner_w_title)(creed_content)(render_creed_categories_w_data);

        const tab_2_w_nav = tab_2_actions(navigator);

        const select_tab_wo_tab_index = select_tab(tab_2_w_nav);

        const tab_actions = [
            select_tab_wo_tab_index
        ];

        const Tab_Bar_w_Props = Tab_Bar(dispatch)(navigator)(tab_actions)()(tab_bar_selected_index);

        return (
            <Default_Bg Tab_Bar={Tab_Bar_w_Props} >
                {creed_categories_list_component}
            </Default_Bg>
        )
    }
}
;

function mapStateToProps(state) {
    return {
        creed_content: state.creed.content
        , creed_level: state.creed.levels_deep || 0
        , creed_title: state.creed.title
        , creeds_chapters_curr_level: state.creeds_chapters_curr_level
        , library_type_index: state.creed.library_type_index
        , selected_creed_index: state.creed.selected_index
        , creed_articles_title: state.creed_level_2.title
        , creed_articles_content: state.creed_level_2.content
        , creed_articles_level: state.creed_level_2.levels_deep
        , selected_chapter_index: state.creed_level_2.selected_chapter_index
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Creeds_Categories);
