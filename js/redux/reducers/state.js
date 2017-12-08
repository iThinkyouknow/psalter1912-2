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
