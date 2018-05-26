export const STATISTICS_ACTIONS = {
    SET_SUNG_PSALTER_DETAILS: 'SET_SUNG_PSALTER_DETAILS'
};

export const set_sung_psalter_details = (sung_dates_array) => (psalter_title) => {
    return {
        type: STATISTICS_ACTIONS.SET_SUNG_PSALTER_DETAILS
        , sung_dates_array
        , psalter_title
    }
};
