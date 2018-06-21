
import psalter_json from '../../../data/PsalterJSON.json';
import {PSALTER_ACTIONS} from '../actions/psalter-actions';

import {is_present_type} from '../../utils/functions';

export function psalter(state = {}, action = {}) {
    if (action.type === PSALTER_ACTIONS.LOCK_IN) {
        if (isNaN(action.next_val)) return state;

        const next_val = ((_next_val) => {
          if (_next_val < -1) return -1;
          if (_next_val > psalter_json.length) return psalter_json.length;
          return _next_val;
        })(action.next_val);

        const sung_count_key = `psalter-${next_val + 1}`;
        const current_sung_dates = state.all_sung_dates[sung_count_key];

        return {
            ...state,
            content: psalter_json[next_val] || {},
            index: next_val,
            current_sung_dates: is_present_type('array')(current_sung_dates) ? current_sung_dates : []
        };

    } else if (action.type === PSALTER_ACTIONS.SET_SUNG_DATE) {
        const key = isNaN(action.psalter_no) ? undefined : `psalter-${action.psalter_no}`;
        const new_dates = is_present_type('array')(action.sung_dates_array)
            ? action.sung_dates_array
            : [];

        return {
            ...state,
            all_sung_dates: {...state.all_sung_dates, [key]: new_dates},
            current_sung_dates: new_dates
        };

    } else if (action.type === PSALTER_ACTIONS.SET_SUNG_COUNT_ALL) {
        if (!Array.isArray(action.sung_record_array)) return state;
        const sung_record_obj = action.sung_record_array.reduce((acc, [psalter_no_str, sung_dates_array]) => {
            return {...acc, [psalter_no_str]: sung_dates_array};
        }, {});

        return {
            ...state,
            all_sung_dates: sung_record_obj
        };
    }

    return {
        content: state.content || {},
        index: isNaN(state.index) ? -1 : state.index,
        current_sung_dates: state.current_sung_dates,
        all_sung_dates: state.all_sung_dates || {}
    };
};

export function psalters_count(state = 0, action = {}) {
    return (Array.isArray(psalter_json)) ? psalter_json.length : 0;
};

export function first_psalter_index_of_each_psalm_obj(state, action = {}) {
    return psalter_json.reduce((acc, psalter, index) => {
        return (acc[psalter.psalm] === undefined)
            ? {
                ...acc,
                [psalter.psalm]:  index
            }
            : acc;
    }, {});
}

export function pdf_page_to_psalter_index_obj(state = {}, action = {}) {
    return psalter_json.reduce((acc, psalter, index) => {
        return (acc[psalter.scoreRef] === undefined)
            ? {...acc, [psalter.scoreRef]: index}
            : acc;
    }, {});
};

