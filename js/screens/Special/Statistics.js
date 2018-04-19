import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View
    , FlatList
    , Animated
    , Image
    , SectionList
    , ScrollView
    , Dimensions
    , TouchableHighlight
} from 'react-native';

import moment from 'moment';

//import styles from './Statistics.styles';
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
} from '../../common/Text';

import Default_bg, {Default_Bg_w_Tab_Bar} from '../../common/Default-bg';
import Segmented_Buttons from '../../common/Segmented-Buttons';
import {select_statistics_tab} from '../../redux/actions/state-actions';

import {} from '../../utils/alert';
import {is_present_type, no_op} from '../../utils/functions';

const Per_Section_Render = (screen_width) => ({item, index}) => {
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
        // , backgroundColor: 'red'
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
        <TouchableHighlight style={[style, dyn_style]} onPress={no_op} underlayColor={'transparent'}>
            <View style={row_container}>
                <View style={text_container}>
                    <Default_Text font_size={'x_large'}  >
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

const per_sect_key_extractor = (prefix) => (item, index) => `psalter-stat-${prefix}-${index}`;


const Section_Header = (title)  => {
    return (
        <Default_Text style={{paddingBottom: sizes.large}}
                      font_weight={'bold'} text_align={'center'}
                      font_size={'xx_large'}>{title}</Default_Text>
    );
};

const Section_Header_Neglected = (title) => {
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
                Notice us Senpai!
            </Default_Text>
            <Default_Text text_align={'center'}
                          font_size={'x_large'}
                          font_weight={'thin'} >
                How long more before you will notice us?
            </Default_Text>
            <Default_Text text_align={'center'}
                          font_size={'x_large'}
                          font_weight={'thin'} >
                You have been neglecting us for too long!

            </Default_Text>
            <Default_Text text_align={'center'}
                          font_size={'xx_large'}
                          font_weight={'thin'}
                          style={{paddingBottom: sizes.large}}>
                Apologize and sing us now!
            </Default_Text>
        </View>

    );
};



const select_tab = (dispatch) => (index) => () => {
    dispatch(select_statistics_tab(index));
};

const Footer = () => <View style={{height: native_elements.tab_bar}}></View>;

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

const most_sung_obj_formatter = ([key, dates_array]) => {
    return {
        psalter: key.replace('-', ' ')
        , last_sung: moment(dates_array[0]).format('D MMM \'YY h:mm A')
        , ago: moment(dates_array[0]).fromNow()
        , sung_count: dates_array.length
    }
};

const most_sung_sort = ([a_key, a_dates_array], [b_key, b_dates_array]) => b_dates_array.length - a_dates_array.length;

const latest_sort = ([a_key, a_dates_array], [b_key, b_dates_array]) => b_dates_array[0] - a_dates_array[0];


const get_psalter_sung_date_details = (sung_dates_array) => (selected_tab_index) => {
    const sort_fns = [
        most_sung_sort
        , latest_sort
    ];

    if (selected_tab_index === 0 || selected_tab_index === 1) {
        return sung_dates_array
            .slice()
            .sort(sort_fns[selected_tab_index])
            .map(most_sung_obj_formatter);
    }

    return [];

};

const book_button = ({width, height}) => (on_press = no_op) => ({item, index}) => { //work on
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
        <TouchableHighlight underlayColor={'transparent'} onPress={on_press} style={[button, button_dyn]} key={`neglected-psalter-${item}-${index}`}>
            <View>
                <Default_Text font_size={'x_large'} text_align={'center'}>12</Default_Text>
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

class Statistics extends Component {
    render() {

        const {
            dispatch
            , navigator
            , all_sung_dates_obj
            , tab_bar_selected_index
            , selected_tab_index
        } = this.props;

        const sung_dates_array = Object.entries(all_sung_dates_obj);

        const tab_actions = [];

        const seg_buttons_width = Math.floor(Dimensions.get('window').width * 9 / 10);

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

        return (
            <Default_Bg_w_Tab_Bar navigator={navigator}
                                  dispatch={dispatch}
                                  tab_bar_selected_index={tab_bar_selected_index}
                                  other_actions_array={tab_actions}
                                  style={{alignItems: 'center'}}>


                {(selected_tab_index === 0 || selected_tab_index === 1)
                    && (
                        <FlatList data={get_psalter_sung_date_details(sung_dates_array)(selected_tab_index)}
                          renderItem={Per_Section_Render(Dimensions.get('window').width)}
                          ListHeaderComponent={Section_Header(title)}
                          ListFooterComponent={Footer()}
                          contentContainerStyle={content_container_style}
                          keyExtractor={per_sect_key_extractor(title)}
                          ItemSeparatorComponent={() => <View style={{height: sizes.default}}/>}/>
                    )
                }
                {
                    (selected_tab_index === 2) && (
                        <FlatList data={[1, 2, 3, 4, 5, 6, 7, 8]}
                                  ListHeaderComponent={Section_Header_Neglected(title)}
                                  ListFooterComponent={Footer()}
                                  numColumns={5}
                                  contentContainerStyle={[content_container_style]}
                                  keyExtractor={per_sect_key_extractor(title)}
                                  renderItem={book_button(Dimensions.get('window'))()}/>
                    )
                }

                <View style={{position: 'absolute', bottom: sizes.default + native_elements.tab_bar}}>
                    {Segmented_Buttons(seg_buttons_width)(seg_buttons_array)()(selected_tab_index)}
                </View>


            </Default_Bg_w_Tab_Bar>
        );
    }
};


function mapStateToProps(state) {
    return {
        //psalter reducer
        all_sung_dates_obj: state.psalter.all_sung_dates
        //state reducer
        , selected_tab_index: state.statistics_selected_tab_index
        // tab_bar_reducer
        , tab_bar_selected_index: state.tab_bar_selected_index
    };
}

export default connect(mapStateToProps, null)(Statistics);