
import psalter_json from '../../../data/PsalterJSON.json';
import {PSALTER_ACTIONS} from '../actions/psalter-actions';

export function psalter(state = {}, action = {}) {
    if (action.type === PSALTER_ACTIONS.LOCK_IN) {
        if (isNaN(action.next_val)) return state;

        const next_val = ((_next_val) => {
          if (_next_val < -1) return -1;
          if (_next_val > psalter_json.length) return psalter_json.length;
          return _next_val;
        })(action.next_val);

        const sung_count_key = `psalter-${next_val + 1}`;
        const current_sung_count = state.all_sung_count[sung_count_key];

        return {
            ...state,
            content: psalter_json[next_val] || {},
            index: next_val,
            current_sung_count: isNaN(current_sung_count) ? undefined : current_sung_count
        };

    } else if (action.type === PSALTER_ACTIONS.SET_SUNG_COUNT) {
        const key = isNaN(action.psalter_no) ? undefined : `psalter-${action.psalter_no}`;
        const current_count = state.all_sung_count[key];
        const new_count = isNaN(current_count) ? undefined : current_count + 1;

        return {
            ...state,
            all_sung_count: {...state.all_sung_count, [key]: new_count},
            current_sung_count: new_count
        };

    } else if (action.type === PSALTER_ACTIONS.SET_SUNG_COUNT_ALL) {
        if (!Array.isArray(action.sung_record_array)) return state;
        const sung_record_obj = action.sung_record_array.reduce((acc, [key, entry]) => {
            return {...acc, [key]: parseInt(entry)};
        }, {});

        return {
            ...state, all_sung_count: sung_record_obj
        };
    }

    return {
        content: state.content || [],
        index: isNaN(state.index) ? -1 : state.index,
        current_sung_count: state.current_sung_count,
        all_sung_count: state.all_sung_count || {}
    };
};

export function psalters_count(state = 0, action = {}) {
    return (Array.isArray(psalter_json)) ? psalter_json.length : 0;
};

