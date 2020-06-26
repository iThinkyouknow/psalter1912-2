import { COPY_ACTIONS } from '../actions/copy-actions';

export const text_to_be_copied = (state = "", action) => {
    if (action.type === COPY_ACTIONS.SET_COPY_TEXT) {
        return action.copy_text;
    }

    return state;
};