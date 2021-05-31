export const CREDITS_ACTIONS = {
    INIT: "INIT"
}

export const credits_texts_init = (credits) => {
    return {
        type: CREDITS_ACTIONS.INIT
        , credits
    };
};