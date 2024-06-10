import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import {
    View,
    FlatList,
    Dimensions,
    Image,
    TouchableHighlight
} from 'react-native';

import { navigator_style_push, hide_tabs_action } from '../../../Navigator-Common'

import styles from './Creeds-Categories.styles';
import {
    colors,
    sizes,
    font_sizes
} from '../../common/common.styles';

import {
    Default_Text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';

import { } from '../../utils/alert';
import {
    no_op
    , getty
} from '../../utils/functions';

import { change_creeds_chapter_lv } from '../../redux/actions/state-actions';
import { lock_in_creed_level_2, lock_in_creed_body } from '../../redux/actions/creeds-actions';

import { creeds_images_array, scenary_images_array, churches_images_array } from '../../utils/images'


const header_banner = ({ Dimensions, styles }) => (title) => {
    const { width, height } = Dimensions.get('window');

    const header_banner_sm_style = {
        height: height / 4
    };

    const header_banner_sm_image_style = {
        height: height / 4,
        width: width
    };

    const font_size = (title.length > 100) ? font_sizes.xx_large : font_sizes.xxx_large;

    return (
        <View style={[styles.head_banner, header_banner_sm_style]}>
            <Image style={[styles.head_banner_image, header_banner_sm_image_style]}
                source={require('../../../images/Heidelberg-Catechism.jpg')} resizeMode={'cover'} />
            <View style={[styles.head_banner_image, header_banner_sm_image_style, styles.head_banner_mask]} />
            <View style={[styles.text_container]}>
                <Default_Text font_family={'Durwent'} font_size={font_size}>{title}</Default_Text>
            </View>
        </View>
    );
};


const go_to_next_creed_level = ({ dispatch = no_op, componentId = '' }) => (library_type_index) => (selected_creed_index) => (creed_level) => (selected_chapter_index) => (selected_article) => () => {

    if (creed_level === 2) {
        dispatch(change_creeds_chapter_lv(2));
        dispatch(lock_in_creed_level_2(library_type_index)(selected_creed_index)(selected_chapter_index));
        Navigation.push(componentId, {
            component: {
                name: 'Creeds_Categories',
                options: {
                    topBar: {
                        visible: true,
                        backButton: {
                            title: 'Chapters',
                            showTitle: true
                        }
                    }
                }
            }
        });

    } else if (creed_level === undefined || creed_level < 2) {
        dispatch(lock_in_creed_body(library_type_index)(selected_creed_index)(selected_chapter_index)(selected_article));

        Navigation.push(componentId, {
            component: {
                name: 'Creeds_Text',
                options: {
                    topBar: {
                        visible: true,
                        backButton: {
                            title: 'Chapters',
                            showTitle: true
                        }
                    }
                }
            }
        });
    }
};

const render_creed_categories = ({ styles }) => (creed_level) => (selected_chapter_index) => (go_to_next_creed_level_action) => ({ item, index }) => {
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
                {header_text}
                <View style={[styles.sub_text_container]}>
                    {sub_text_component}
                </View>
            </View>
        </TouchableHighlight>

    );
};

const creed_categories_list = (header_banner_component) => (content) => (render_creed_categories) => {

    const creeds_cat_key_ext = (item, j) => `categories-${j}`;

    const {height} = Dimensions.get('window');

    return (
        <FlatList ListHeaderComponent={header_banner_component}
            keyExtractor={creeds_cat_key_ext}
            data={content}
            renderItem={render_creed_categories} />
    );
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
            , selected_chapter_index
            , tab_bar_selected_index
            , componentId
        } = this.props;

        hide_tabs_action(navigator)();

        const component_obj = {
            styles,
            images: {
                creeds_images_array,
                scenary_images_array,
                churches_images_array
            },
            random: Math.random,
            Dimensions,
            componentId,
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

        return (
            <Default_Bg>
                {creed_categories_list_component}
            </Default_Bg>
        )
    }
}
;

function mapStateToProps(state) {
    return {
        creed_content: state.creeds.creed.content
        , creed_level: state.creeds.creed.levels_deep || 0
        , creed_title: state.creeds.creed.title
        , creeds_chapters_curr_level: state.creeds_chapters_curr_level
        , library_type_index: state.creeds.creed.library_type_index
        , selected_creed_index: state.creeds.creed.selected_index
        , creed_articles_title: getty(state)('creeds.creed_level_2.title')() || ''
        , creed_articles_content: getty(state)('creeds.creed_level_2.content')() || []
        , creed_articles_level: getty(state)('creeds.creed_level_2.levels_deep')() || 0
        , selected_chapter_index: getty(state)('creeds.creed_level_2.selected_chapter_index')() || 0
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Creeds_Categories);
