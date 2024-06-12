
export const PSALTER_ACTIONS = {
    PSALTER_INIT: 'PSALTER_INIT',
    LOCK_IN: 'LOCK_IN',
    SET_SUNG_DATE: 'SET_SUNG_DATE',
    GET_SUNG_COUNT: 'GET_SUNG_COUNT',
    SET_SUNG_COUNT_ALL: 'SET_SUNG_COUNT_ALL',
};

export const psalter_init = (psalter_json) => {
    return {
        type: PSALTER_ACTIONS.PSALTER_INIT,
        psalter_json
    }
};

export const lock_in = (next_val) => {
    return {
        type: PSALTER_ACTIONS.LOCK_IN,
        next_val
    }
};

export const set_sung_count_all = (sung_record_array) => {
    return {
        type: PSALTER_ACTIONS.SET_SUNG_COUNT_ALL,
        sung_record_array
    };
};

export const get_sung_count = (psalter_no) => {
    return {
        type: PSALTER_ACTIONS.GET_SUNG_COUNT,
        psalter_no
    };
};

export const set_sung_date = (psalter_no, sung_dates_array) => {
    return {
        type: PSALTER_ACTIONS.SET_SUNG_DATE,
        psalter_no,
        sung_dates_array
    }
};
