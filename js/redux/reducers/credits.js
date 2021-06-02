import {CREDITS_ACTIONS} from '../actions/credits-actions';

export const credits = (state = {}, action = {}) => {
    if (action.type === CREDITS_ACTIONS.INIT) {
        return {
            ...state,
            credits: action.credits
        }
    }
    return state;
}