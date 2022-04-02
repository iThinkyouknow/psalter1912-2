import { STATE_ACTIONS } from '../actions/state-actions';
import { font_sizes } from '../../common/common.styles';
import { is_number } from '../../utils/functions';

export function psalter_text_input(state = "", action = {}) {
    if (action.type === STATE_ACTIONS.PSALTER_TEXT_INPUT) {
        return `${action.val}`;
    }

    return state;
}

export function psalter_scroll_details(state = {}, action = {}) {
    if (action.type === STATE_ACTIONS.PSALTER_HEADER_SCROLL_DETAILS) {
        return action.details
    }
    return state;
}

export function bible_scroll_details(state = {}, action = {}) {
    if (action.type === STATE_ACTIONS.BIBLE_HEADER_SCROLL_DETAILS) {
        return action.details
    }
    return state;
}


export function valid_text_input(state = true, action = {}) {
    if (action.type === STATE_ACTIONS.TOGGLE_TEXT_INPUT_VALID) {
        return action.is_valid
    }
    return state;
}

export function music_timer(state = { current: 0, max: 0 }, action = {}) {
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

export function copy_share_btn_props(state, action = {}) {
    if (action.type === STATE_ACTIONS.SET_COPY_SHARE_BTN) {
        return action.properties;
    }
    return state || {
        top: -100,
        left: -100,
        isHidden: true
    };
};

export function text_input_as_search(state = false, action) {
    if (action.type === STATE_ACTIONS.SET_INPUT_AS_SEARCH) {
        if (typeof action.should_search !== "boolean") return state;
        return action.should_search;
    }

    return state;
}

export function psalter_can_search(state = true, action) {
    if (action.type === STATE_ACTIONS.PSALTER_SET_CAN_SEARCH) {
        return action.can_search
    }

    return state;
}

export function text_font_size(state = font_sizes.default, action = {}) {
    if (action.type === STATE_ACTIONS.SET_NEW_FONT_SIZE) {
        return is_number(action.new_font_size) ? action.new_font_size : state;
    }

    return state;
};


export function creeds_library_type_index(state = 0, action) {
    if (action.type === STATE_ACTIONS.SELECT_LIBRARY_TYPE) {
        return action.index;
    }
    return state;
};

export function creeds_chapters_curr_level(state = 1, action = {}) {
    if (action.type === STATE_ACTIONS.CHANGE_CREEDS_CHAPTER_LV) {
        return action.lv
    }
    return state;
}

export function bible_should_show_back_to_books_button(state = false, action = {}) {
    if (action.type === STATE_ACTIONS.BIBLE_TOGGLE_BACK_TO_BOOK_BUTTONS) {
        return action.bible_should_show_back_to_books_button
    }

    return state;
};



export function psalter_pdf_input(state = "", action = {}) {
    if (action.type === STATE_ACTIONS.PSALTER_PDF_TEXT_INPUT) {
        return `${action.val}`;
    }

    return state;
}

export function valid_psalter_pdf_text_input(state = true, action = {}) {
    if (action.type === STATE_ACTIONS.TOGGLE_PSALTER_PDF_TEXT_INPUT_VALID) {
        return action.is_valid
    }
    return state;
}

export function temp_psalter_pdf_page_number_for_pdf(state = NaN, action = {}) {
    if (action.type === STATE_ACTIONS.SET_TEMP_PSALTER_PDF_PAGE_NO) {
        return action.page_no;

    } else if (action.type === STATE_ACTIONS.RESET_TEMP_PSALTER_PDF_PAGE_NO) {
        return NaN;
    }
    return state
};

export function statistics_selected_tab_index(state = 0, action = {}) {
    if (action.type === STATE_ACTIONS.SELECT_STATISTICS_TAB) {
        return action.selected_index;
    }
    return state;
};

export function misc_actions_text_input_pointer_events(state = 'none', action = {}) {
    if (action.type === STATE_ACTIONS.SET_MISC_ACTIONS_TEXT_INPUT_POINTER_EVENTS) {
        return action.pointer_events;
    }
    return state;
}
