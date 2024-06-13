import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View
    , FlatList
    , Dimensions
    , TouchableHighlight
} from 'react-native';

import { Navigation } from 'react-native-navigation';

import AsyncStorage from '@react-native-async-storage/async-storage';


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime);
//import styles from './Statistics.styles';
import {
    colors
    , sizes
    , native_elements
    , border_radii
} from '../../common/common.styles';

import {
    Default_Text
} from '../../common/Text';

import Default_Bg from '../../common/Default-bg';
import Segmented_Buttons from '../../common/Segmented-Buttons';


import {select_statistics_tab} from '../../redux/actions/state-actions';

import {
    select_tab_index
} from '../../redux/actions/tab-bar-actions';
import {
    set_sung_psalter_details
    , neglected_texts_init
    , neglected_alert_texts_init
} from '../../redux/actions/statistics-actions';

import {
    on_psalter_change
} from '../Psalter/Psalter';

import {neglected_alert} from '../../utils/alert';
import {no_op} from '../../utils/functions';

const Psalter_Btn_Component = (screen_width) => ({item, index}) => {
    const dyn_style = {
        width: screen_width - sizes.large * 2
    };
    const style = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
        , height: 100
        , borderRadius: border_radii.large
        , overflow: 'hidden'
        , padding: sizes.large
        , paddingVertical: 0
    };

    const row_container = {
        flexDirection: 'row'
        , justifyContent: 'space-between'
        , alignItems: 'center'
        , flex: 1
    }


    const text_container = {
        flexDirection: 'column'
        , justifyContent: 'center'
        // , backgroundColor: 'green'
    };

    const right_container = {
        justifyContent: 'space-around'
        , alignItems: 'flex-end'
        // , backgroundColor: 'orange'
    };

    const Psalter_Stats_Details = (text) => {
        return (
            <Default_Text font_size={'small'} style={{paddingVertical: 2}}>
                {text}
            </Default_Text>
        );
    };

    const times = item.sung_count === 1 ? 'Time' : 'Times';

    return (
        <TouchableHighlight style={[style, dyn_style]} onPress={item.on_press} underlayColor={'transparent'}>
            <View style={row_container}>
                <View style={text_container}>
                    <Default_Text font_size={'x_large'}>
                        {item.psalter}
                    </Default_Text>
                </View>
                <View style={[text_container, right_container]}>
                    {Psalter_Stats_Details(item.last_sung)}
                    {Psalter_Stats_Details(item.ago)}
                    {Psalter_Stats_Details(`Sung ${item.sung_count} ${times}`)}
                </View>
            </View>

        </TouchableHighlight>

    );
};

const get_text_index_of_array = (array_length) => {
    return ~~(Math.random() * array_length)
};

const per_sect_key_extractor = (item, index) => {
    return index;
}

const Section_Header = (title) => {
    return (
        <Default_Text style={{paddingBottom: sizes.large}}
                      font_weight={'bold'} text_align={'center'}
                      font_size={'xx_large'}>{title}</Default_Text>
    );
};

const Section_Header_Neglected = (text_array, title) => {

    return (
        <View>
            <Default_Text
                font_weight={'bold'} text_align={'center'}
                font_size={'xx_large'}>
                {title}
            </Default_Text>

            <Default_Text text_align={'center'}
                          font_size={'x_large'}
                          font_weight={'thin'}
                          style={{paddingTop: sizes.default}}>
                {text_array[0]}
            </Default_Text>
            <Default_Text text_align={'center'}
                          font_size={'x_large'}
                          font_weight={'thin'}>
                {text_array[1]}
            </Default_Text>
            <Default_Text text_align={'center'}
                          font_size={'x_large'}
                          font_weight={'thin'}>
                {text_array[2]}

            </Default_Text>
            <Default_Text text_align={'center'}
                          font_size={'xx_large'}
                          font_weight={'thin'}
                          style={{paddingBottom: sizes.large}}>
                {text_array[3]}
            </Default_Text>
        </View>

    );
};

const select_tab = (dispatch) => (index) => () => {
    dispatch(select_statistics_tab(index));
};

const Footer = (
    <View style={{height: native_elements.tab_bar}}></View>
);

const titles = [
    'Most Sung'
    , 'Latest'
    , 'Neglected'
];

const content_container_style = {
    alignItems: 'center'
    , paddingTop: sizes.x_large
    , paddingHorizontal: sizes.large
};

const change_psalter_num_string_to_int = (psalter_num_str) => parseInt(psalter_num_str.replace('psalter-', ''));

const most_sung_obj_formatter = (on_press_wo_dates_psalter_title) => ([key, dates_array]) => {
    return {
        psalter: key.replace('psalter-', 'Psalter ')
        , last_sung: dayjs(dates_array[0]).format('D MMM \'YY h:mm A')
        , ago: dayjs(dates_array[0]).fromNow()
        , sung_count: dates_array.length
        , on_press: on_press_wo_dates_psalter_title(dates_array, key.replace('psalter-', 'Psalter '))
    }
};

const most_sung_sort = ([a_key, a_dates_array], [b_key, b_dates_array]) => b_dates_array.length - a_dates_array.length;

const latest_sort = ([a_key, a_dates_array], [b_key, b_dates_array]) => b_dates_array[0] - a_dates_array[0];


const get_psalter_sung_date_details = (most_sung_obj_formatter_w_on_press, sung_dates_array, selected_tab_index) => {
    const sort_fns = [
        most_sung_sort
        , latest_sort
    ];

    return sung_dates_array
        .slice()
        .sort(sort_fns[selected_tab_index])
        .map(most_sung_obj_formatter_w_on_press);
};

const flatlist_item_layout = (height) => (data, index) => {
    return {length: height, offset: height * index, index}
};


const neglected_book_button = (on_press = no_op) => ({item, index}) => { //work on
    const {width} = Dimensions.get('window');
    const box_width = Math.floor(width / 6);

    const button = {
        alignItems: 'center',
        justifyContent: 'center'
    };

    const button_dyn = {
        width: box_width,
        height: box_width,
    };

    return (
        <TouchableHighlight underlayColor={'transparent'} onPress={on_press(item - 1)} style={[button, button_dyn]}
                            key={`neglected-psalter-${item}-${index}`}>
            <View>
                <Default_Text font_size={'x_large'} text_align={'center'}>{item}</Default_Text>
                <View style={{
                    marginTop: sizes.default,
                    height: 1,
                    width: Math.floor(width / 8),
                    backgroundColor: colors.blue
                }}/>
            </View>
        </TouchableHighlight>
    );
};


const get_unsung_array = (all_sung_dates_obj) => {
    const all_psalters = Array.from(new Array(434), (item, index) => `psalter-${index + 1}`);

    const get_not_sung = (sung_obj) => (psalter_num_str) => {
        return (sung_obj[psalter_num_str] === undefined);
    };

    return all_psalters
        .filter(get_not_sung(all_sung_dates_obj))
        .map(change_psalter_num_string_to_int);
};

const get_least_sung_psalter_array = (all_sung_dates_array) => {
    // ['psalter-1',  [4957348957, 45987345897345]]

    const get_key_int_count = ([key, values_array]) => {
        const key_int = change_psalter_num_string_to_int(key);
        return [key_int, values_array.length];
    };

    const sort_by_count_asc = ([aKey, aCount], [bKey, bCount]) => {
        return aCount - bCount
    };

    const get_lowest = ([key, count], index, array) => {
        const lowest_count = array[0][1];
        return (count === lowest_count);
    };

    const sung_dates_num_count_sorted_array = all_sung_dates_array
        .map(get_key_int_count)
        .sort(sort_by_count_asc)
        .filter(get_lowest)
        .map(([key, count]) => key);

    return sung_dates_num_count_sorted_array;
};

const on_press_action_for_sung_psalters = (dispatch, componentId) => (sung_array, psalter_title) => () => {
    dispatch(set_sung_psalter_details(sung_array, psalter_title));
    Navigation.push(componentId, {
        component: {
            name: 'Psalter_Sung_Details',
            options: {
                topBar: {
                    visible: true,
                    drawBehind: true,
                    backButton: {
                        title: 'All',
                        showTitle: true
                    }
                }
    
            }
        },
    });
};

const neglected_on_press_yes = (dispatch) => (index) => () => {
    on_psalter_change(dispatch, index)();
    Navigation.mergeOptions('BOTTOM_TABS',{
        bottomTabs: {
            currentTabIndex: 0
        }
    });
    dispatch(select_tab_index(0));
};

class Statistics extends Component {
    componentDidMount() {
        const neglected_texts_storage_key = 'Neglected-Texts';
        AsyncStorage.getItem(neglected_texts_storage_key)
            .then(json_string => {
                const json = JSON.parse(json_string) || require('../../../data/Neglected-Texts.json');
                this.props.dispatch(neglected_texts_init(json));
            })
            .catch(err => console.error('get neglected texts storage error:', err));
        
        const neglected_alert_storage_key = 'Neglected-Alert-Texts';
        AsyncStorage.getItem(neglected_alert_storage_key)
            .then(json_string => {
                const json = JSON.parse(json_string) || require('../../../data/Neglected-Alert-Texts.json');
                this.props.dispatch(neglected_alert_texts_init(json));
            })
            .catch(err => console.error('get neglected alert texts storage error:', err));
    }

    render() {

        const {
            dispatch
            , all_sung_dates_obj
            , selected_tab_index
            , componentId
        } = this.props;

        const screen_width = Dimensions.get('window').width;

        const sung_dates_array = Object.entries(all_sung_dates_obj);

        const seg_buttons_width = Math.floor(screen_width * 9 / 10);

        const select_tab_w_dispatch = select_tab(dispatch);
        const seg_buttons_array = [
            {
                text: titles[0]
                , on_press: select_tab_w_dispatch(0)
            }
            , {
                text: titles[1]
                , on_press: select_tab_w_dispatch(1)
            }
            , {
                text: titles[2]
                , on_press: select_tab_w_dispatch(2)
            }
        ];

        const title = titles[selected_tab_index];

        const unsung_psalters_array = get_unsung_array(all_sung_dates_obj);
        const neglected_psalters_array = (unsung_psalters_array.length > 0)
            ? unsung_psalters_array
            : get_least_sung_psalter_array(sung_dates_array);

        const on_press_action_for_sung_psalters_wo_sung_array = on_press_action_for_sung_psalters(dispatch, componentId);

        const text_index = get_text_index_of_array(this.props.neglected_texts.length);
        const text_array = this.props.neglected_texts[text_index];

        const neglected_on_press_yes_wo_index = neglected_on_press_yes(dispatch);

        return (
            <Default_Bg style={{alignItems: 'center'}}>

                {(selected_tab_index === 0 || selected_tab_index === 1)
                && (
                    <FlatList
                        
                        data={get_psalter_sung_date_details(most_sung_obj_formatter(on_press_action_for_sung_psalters_wo_sung_array), sung_dates_array, selected_tab_index)}
                        renderItem={Psalter_Btn_Component(screen_width)}
                        ListHeaderComponent={Section_Header(title)}
                        ListFooterComponent={Footer}
                        contentContainerStyle={content_container_style}
                        keyExtractor={per_sect_key_extractor}
                        contentInsetAdjustmentBehavior={'never'}
                        ItemSeparatorComponent={() => <View style={{height: sizes.default}}/>}/>
                )
                }
                {
                    (selected_tab_index === 2) && (
                        <FlatList
                            data={neglected_psalters_array}
                            ListHeaderComponent={Section_Header_Neglected(text_array, title)}
                            ListFooterComponent={Footer}
                            numColumns={5}
                            contentContainerStyle={[content_container_style]}
                            keyExtractor={per_sect_key_extractor}
                            getItemLayout={flatlist_item_layout(Math.floor(screen_width / 6))}
                            contentInsetAdjustmentBehavior={'never'}
                            renderItem={neglected_book_button(
                                neglected_alert(
                                    this.props.neglected_alert_texts, 
                                    neglected_on_press_yes_wo_index, 
                                    undefined
                                )
                            )}/>
                    )
                }

                <View style={{
                    position: 'absolute',
                    bottom: sizes.medium
                }}>
                    {Segmented_Buttons(seg_buttons_width, seg_buttons_array, undefined, selected_tab_index)}
                </View>

            </Default_Bg>
        );
    }
}


function mapStateToProps(state) {
    return {
        //psalter reducer
        all_sung_dates_obj: state.psalter.all_sung_dates
        //state reducer
        , selected_tab_index: state.statistics_selected_tab_index
        // tab_bar_reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
        , neglected_texts: state.neglected_texts.neglected_texts || []
        , neglected_alert_texts: state.neglected_texts.neglected_alert_texts || []
    };
}

export default connect(mapStateToProps, null)(Statistics);