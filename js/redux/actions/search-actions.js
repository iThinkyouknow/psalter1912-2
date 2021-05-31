export const SEARCH_ACTIONS = {
    PSALTER_SEARCH_JSON_INIT: 'PSALTER_SEARCH_JSON_INIT'
    , SEARCH_PSALTER: 'SEARCH_PSALTER'
};

export const psaltersearchjson_init = (psalter_search_json) => {
    return {
        type: SEARCH_ACTIONS.PSALTER_SEARCH_JSON_INIT
        , psalter_search_json
    };
};

export const search_psalter = (search_text) => {
    return {
        type: SEARCH_ACTIONS.SEARCH_PSALTER,
        search_text
    };
};
