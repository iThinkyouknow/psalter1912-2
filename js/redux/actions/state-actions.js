export const STATE_ACTIONS = {
    PSALTER_TEXT_INPUT: 'PSALTER_TEXT_INPUT'
    , PSALTER_PDF_TEXT_INPUT: 'PSALTER_PDF_TEXT_INPUT'
    , PSALTER_HEADER_SCROLL_DETAILS: 'PSALTER_HEADER_SCROLL_DETAILS'
    , BIBLE_HEADER_SCROLL_DETAILS: 'BIBLE_HEADER_SCROLL_DETAILS'
    , TOGGLE_TEXT_INPUT_VALID: "TOGGLE_TEXT_INPUT_INVALID"
    , SET_MUSIC_TIMER: 'SET_MUSIC_TIMER'
    , SET_MAX_MUSIC_TIMER: 'SET_MAX_MUSIC_TIMER'
    , SET_INPUT_AS_SEARCH: 'SET_INPUT_AS_SEARCH'
    , PSALTER_SET_CAN_SEARCH: 'PSALTER_SET_CAN_SEARCH'
    , SET_NEW_FONT_SIZE: 'SET_NEW_FONT_SIZE'
    , SET_USER_SETTINGS: 'SET_USER_SETTINGS'
    , SELECT_LIBRARY_TYPE: 'SELECT_LIBRARY_TYPE'
    , CHANGE_CREEDS_CHAPTER_LV: 'CHANGE_CREEDS_CHAPTER_LV'
    , BIBLE_TOGGLE_BACK_TO_BOOK_BUTTONS: 'BIBLE_TOGGLE_BACK_TO_BOOK_BUTTONS'
    , TOGGLE_PSALTER_PDF_TEXT_INPUT_VALID: 'TOGGLE_PSALTER_PDF_TEXT_INPUT_VALID'
    , SET_TEMP_PSALTER_PDF_PAGE_NO: 'SET_TEMP_PSALTER_PDF_PAGE_NO'
    , RESET_TEMP_PSALTER_PDF_PAGE_NO: 'RESET_TEMP_PSALTER_PDF_PAGE_NO'

    , SELECT_STATISTICS_TAB: 'SELECT_STATISTICS_TAB'

    , SET_COPY_SHARE_BTN: 'SET_COPY_SHARE_BTN'
    , SET_MISC_ACTIONS_TEXT_INPUT_POINTER_EVENTS: 'SET_MISC_ACTIONS_TEXT_INPUT_POINTER_EVENTS'
};

export const psalter_text_input = (val) => {
    return {
        type: STATE_ACTIONS.PSALTER_TEXT_INPUT,
        val
    }
};

export const set_psalter_header_scroll_details = (details) => {
    return {
        type: STATE_ACTIONS.PSALTER_HEADER_SCROLL_DETAILS,
        details
    };
};

export const set_bible_header_scroll_details = (details) => {
    return {
        type: STATE_ACTIONS.BIBLE_HEADER_SCROLL_DETAILS,
        details
    };
};

export const toggle_text_as_valid = (is_valid) => {
    return {
        type: STATE_ACTIONS.TOGGLE_TEXT_INPUT_VALID,
        is_valid
    }
};

export const set_music_timer = (time) => {
    return {
        type: STATE_ACTIONS.SET_MUSIC_TIMER,
        time
    }
};

export const set_max_music_timer = (time) => {
    return {
        type: STATE_ACTIONS.SET_MAX_MUSIC_TIMER,
        time
    }
};

export const set_input_as_search = (should_search) => {
    return {
        type: STATE_ACTIONS.SET_INPUT_AS_SEARCH,
        should_search
    }
};

export const set_can_search = (can_search) => {
    return {
        type: STATE_ACTIONS.PSALTER_SET_CAN_SEARCH
        , can_search
    }
}

export const psalter_pdf_text_input = (val) => {
    return {
        type: STATE_ACTIONS.PSALTER_PDF_TEXT_INPUT,
        val
    }
};

export const set_new_font_size = (new_font_size) => {
    return {
        type: STATE_ACTIONS.SET_NEW_FONT_SIZE
        , new_font_size
    }
};
export const set_new_user_settings = (settings = {}) => {
    return {
        type: STATE_ACTIONS.SET_USER_SETTINGS
        , settings
    }
};

export const select_creeds_or_forms = (index) => {
    return {
        type: STATE_ACTIONS.SELECT_LIBRARY_TYPE,
        index
    }
};

export const change_creeds_chapter_lv = (lv) => {
    return {
        type: STATE_ACTIONS.CHANGE_CREEDS_CHAPTER_LV,
        lv
    };
};

export const bible_toggle_back_to_book_buttons = (bible_should_show_back_to_books_button) => {
    return {
        type: STATE_ACTIONS.BIBLE_TOGGLE_BACK_TO_BOOK_BUTTONS,
        bible_should_show_back_to_books_button
    }
};

export const toggle_psalter_pdf_text_input_valid = (is_valid) => {
    return {
        type: STATE_ACTIONS.TOGGLE_PSALTER_PDF_TEXT_INPUT_VALID
        , is_valid
    }
};

export const set_temp_psalter_pdf_page_no = (page_no) => {
    return {
        type: STATE_ACTIONS.SET_TEMP_PSALTER_PDF_PAGE_NO
        , page_no
    }
};

export const reset_temp_psalter_pdf_page_no = () => {
    return {
        type: STATE_ACTIONS.RESET_TEMP_PSALTER_PDF_PAGE_NO
    }
};

export const select_statistics_tab = (selected_index) => {
    return {
        type: STATE_ACTIONS.SELECT_STATISTICS_TAB
        , selected_index
    }
};

export const credits_text_set_new_font_size = (new_font_size) => {
    return {
        type: STATE_ACTIONS.CREDITS_TEXT_SET_NEW_FONT_SIZE
        , new_font_size
    }
};

export const set_copy_share_btn = (properties = { top: 0, left: 0, isHidden: true }) => {
    return {
        type: STATE_ACTIONS.SET_COPY_SHARE_BTN
        , properties
    }
}

export const set_misc_actions_text_input_pointer_events = (pointer_events = 'none') => {
    return {
        type: STATE_ACTIONS.SET_MISC_ACTIONS_TEXT_INPUT_POINTER_EVENTS
        , pointer_events
    }
}

