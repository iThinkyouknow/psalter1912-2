import {STATE_ACTIONS} from '../actions/state-actions';

export function psalter_text_input(state = "", action = {}) {
    if (action.type === STATE_ACTIONS.PSALTER_TEXT_INPUT) {
        return `${action.val}`;
    }

    return state;
}
