
export const PSALTER_ACTIONS = {
    SWIPE: 'SWIPE',
};

export const swipe = (next_val) => {
    return {
        type: PSALTER_ACTIONS.SWIPE,
        next_val
    }
};