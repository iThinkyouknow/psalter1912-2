export const STATE_ACTIONS = {
    PSALTER_TEXT_INPUT: 'PSALTER_TEXT_INPUT',
    TOGGLE_TEXT_INPUT_VALID: "TOGGLE_TEXT_INPUT_INVALID",
    SET_MUSIC_TIMER: 'SET_MUSIC_TIMER',
    SET_MAX_MUSIC_TIMER: 'SET_MAX_MUSIC_TIMER',
    SET_INPUT_AS_SEARCH: 'SET_INPUT_AS_SEARCH',
    SELECT_LIBRARY_TYPE: 'SELECT_LIBRARY_TYPE',
    CHANGE_CREEDS_CHAPTER_LV: 'CHANGE_CREEDS_CHAPTER_LV'
};

export const psalter_text_input = (val) => {
    return {
        type: STATE_ACTIONS.PSALTER_TEXT_INPUT,
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