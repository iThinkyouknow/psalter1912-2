export const SEARCH_ACTIONS = {
    SEARCH_PSALTER: 'SEARCH_PSALTER'
};

export const search_psalter = (search_text) => {
    return {
        type: SEARCH_ACTIONS.SEARCH_PSALTER,
        search_text
    };
};
