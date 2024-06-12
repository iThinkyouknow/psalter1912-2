import {PSALTER_ACTIONS} from '../actions/psalter-actions';

import {is_array} from '../../utils/functions';

const default_psalter_obj = {
    psalter_json: {}
    , psalters_count: 0
    , first_psalter_index_of_each_psalm_obj: {}
    , pdf_page_to_psalter_index_obj: {}
    , content: {}
    , index: -1
    , current_sung_dates: []
    , all_sung_dates: {}
};

export function psalter(state = default_psalter_obj, action = {}) {
    if (action.type === PSALTER_ACTIONS.PSALTER_INIT) {
        
        const {psalter_json} = action;
        
        const psalters_count = psalter_json.length;
        const first_psalter_index_of_each_psalm_obj = psalter_json.reduce((acc, psalter, index) => {
            acc[psalter.psalm] = acc[psalter.psalm] || index
            return acc;
        }, {});

        const pdf_page_to_psalter_index_obj = psalter_json.reduce((acc, psalter, index) => {
            acc[psalter.scoreRef] = acc[psalter.scoreRef] || index;
            return acc;
        }, {});

        return {
            ...default_psalter_obj
            , psalter_json
            , psalters_count
            , first_psalter_index_of_each_psalm_obj
            , pdf_page_to_psalter_index_obj
        };
    
    } else if (action.type === PSALTER_ACTIONS.LOCK_IN) {
        if (Number.isNaN(action.next_val)) return state;

        const next_val = ((_next_val) => {
          if (_next_val < -1) return -1;
          if (_next_val > state.psalter_json.length) return state.psalter_json.length;
          return _next_val;
        })(action.next_val);

        const sung_count_key = `psalter-${next_val + 1}`;
        const current_sung_dates = state.all_sung_dates[sung_count_key];

        return {
            ...state,
            content: state.psalter_json[next_val] || {},
            index: next_val,
            current_sung_dates: is_array(current_sung_dates) ? current_sung_dates : []
        };

    } else if (action.type === PSALTER_ACTIONS.SET_SUNG_DATE) {
        const key = isNaN(action.psalter_no) ? undefined : `psalter-${action.psalter_no}`;
        const new_dates = is_array(action.sung_dates_array)
            ? action.sung_dates_array
            : [];

        return {
            ...state,
            all_sung_dates: {...state.all_sung_dates, [key]: new_dates},
            current_sung_dates: new_dates
        };

    } else if (action.type === PSALTER_ACTIONS.SET_SUNG_COUNT_ALL) {
        if (!Array.isArray(action.sung_record_array)) return state;

        const sung_record_obj = Object.fromEntries(
            action.sung_record_array.map(([psalter_no_str, sung_dates_array]) => [psalter_no_str, sung_dates_array])
        );

        return {
            ...state,
            all_sung_dates: sung_record_obj
        };
    }

    return state;
};

