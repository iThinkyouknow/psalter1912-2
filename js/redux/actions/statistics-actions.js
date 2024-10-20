export const STATISTICS_ACTIONS = {
    SET_SUNG_PSALTER_DETAILS: 'SET_SUNG_PSALTER_DETAILS'
    , NEGLECTED_TEXTS_INIT: 'NEGLECTED_TEXTS_INIT'
    , NEGLECTED_ALERT_TEXTS_INIT: 'NEGLECTED_ALERT_TEXTS_INIT'
};

export const set_sung_psalter_details = (sung_dates_array, psalter_title) => {
    return {
        type: STATISTICS_ACTIONS.SET_SUNG_PSALTER_DETAILS
        , sung_dates_array
        , psalter_title
    }
};

export const neglected_texts_init = (neglected_texts) => {
    return {
        type: STATISTICS_ACTIONS.NEGLECTED_TEXTS_INIT
        , neglected_texts
    };
};

export const neglected_alert_texts_init = (neglected_alert_texts) => {
    return {
        type: STATISTICS_ACTIONS.NEGLECTED_ALERT_TEXTS_INIT
        , neglected_alert_texts
    };
};
