import {TAB_BAR_ACTIONS} from '../actions/tab-bar-actions';


const _tab_bar_selected_index = (state = 0, action) => {
    if (action.type === TAB_BAR_ACTIONS.SELECT_INDEX) {
        return action.selected_index;
    }

    return state;
};

export const tab_bar_selected_index = _tab_bar_selected_index;
