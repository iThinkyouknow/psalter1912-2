
export const PSALTER_ACTIONS = {
    LOCK_IN: 'LOCK_IN'
};

export const lock_in = (next_val) => {
    return {
        type: PSALTER_ACTIONS.LOCK_IN,
        next_val
    }
};