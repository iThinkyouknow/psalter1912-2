export const SEARCH_ACTIONS = {
    PSALTER_SEARCH_JSON_INIT: 'PSALTER_SEARCH_JSON_INIT'
    , SEARCH_PSALTER: 'SEARCH_PSALTER'
    , CREEDS_SEARCH_JSON_INIT: 'CREEDS_SEARCH_JSON_INIT'
    , SEARCH_CREEDS: 'SEARCH_CREEDS'
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

export const creeds_search_json_init = (creeds_search_json) => {
    return {
        type: SEARCH_ACTIONS.CREEDS_SEARCH_JSON_INIT
        , creeds_search_json
    };
};

export const search_creeds = (search_text) => {
    return {
        type: SEARCH_ACTIONS.SEARCH_CREEDS,
        search_text
    };
};
