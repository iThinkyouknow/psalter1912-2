import {STATE_ACTIONS} from '../actions/state-actions';

export function psalter_text_input(state = "", action = {}) {
    if (action.type === STATE_ACTIONS.PSALTER_TEXT_INPUT) {
        return `${action.val}`;
    }

    return state;
}

export function valid_text_input(state = "", action = {}) {
    if (action.type === STATE_ACTIONS.TOGGLE_TEXT_INPUT_VALID) {
        return action.is_valid
    }
    return state;
}

export function music_timer(state = {current: 0, max: 0}, action = {}) {
    if (action.type === STATE_ACTIONS.SET_MUSIC_TIMER) {
        if (action.time === null || action.time === undefined || isNaN(action.time)) return state;
        return {
            ...state,
            current: action.time
        };

    } else if (action.type === STATE_ACTIONS.SET_MAX_MUSIC_TIMER) {
        if (action.time === null || action.time === undefined || isNaN(action.time)) return state;

        return {
            ...state,
            max: action.time
        };
    }

    return state;
}

export function text_input_as_search(state = false, action) {
    if (action.type === STATE_ACTIONS.SET_INPUT_AS_SEARCH) {
        if (typeof action.should_search !== "boolean") return state;
        return action.should_search;
    }

    return state;
}

export function creeds_library_type_index(state = 0, action) {
    if (action.type === STATE_ACTIONS.SELECT_LIBRARY_TYPE) {
        return action.index;
    }
    return state;
};

export function creeds_chapters_curr_level(state = 1, action) {
    if (action.type === STATE_ACTIONS.CHANGE_CREEDS_CHAPTER_LV) {
        return action.lv
    }
    return state;
}
