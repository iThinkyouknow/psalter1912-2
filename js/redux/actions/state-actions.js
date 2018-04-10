export const STATE_ACTIONS = {
    PSALTER_TEXT_INPUT: 'PSALTER_TEXT_INPUT'
    , PSALTER_PDF_TEXT_INPUT: 'PSALTER_PDF_TEXT_INPUT'
    , TOGGLE_TEXT_INPUT_VALID: "TOGGLE_TEXT_INPUT_INVALID"
    , SET_MUSIC_TIMER: 'SET_MUSIC_TIMER'
    , SET_MAX_MUSIC_TIMER: 'SET_MAX_MUSIC_TIMER'
    , SET_INPUT_AS_SEARCH: 'SET_INPUT_AS_SEARCH'
    , SELECT_LIBRARY_TYPE: 'SELECT_LIBRARY_TYPE'
    , CHANGE_CREEDS_CHAPTER_LV: 'CHANGE_CREEDS_CHAPTER_LV'
    , BIBLE_TOGGLE_BACK_TO_BOOK_BUTTONS: 'BIBLE_TOGGLE_BACK_TO_BOOK_BUTTONS'
    , TOGGLE_PSALTER_PDF_TEXT_INPUT_VALID: 'TOGGLE_PSALTER_PDF_TEXT_INPUT_VALID'
    , SET_TEMP_PSALTER_PDF_PAGE_NO: 'SET_TEMP_PSALTER_PDF_PAGE_NO'
    , RESET_TEMP_PSALTER_PDF_PAGE_NO: 'RESET_TEMP_PSALTER_PDF_PAGE_NO'
};

export const psalter_text_input = (val) => {
    return {
        type: STATE_ACTIONS.PSALTER_TEXT_INPUT,
        val
    }
};

export const psalter_pdf_text_input = (val) => {
    return {
        type: STATE_ACTIONS.PSALTER_PDF_TEXT_INPUT,
        val
    }
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

