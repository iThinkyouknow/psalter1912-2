export const CREEDS_ACTIONS = {
    LOCK_IN_CREED: 'LOCK_IN_CREED',
    SELECT_LIBRARY_TYPE: 'SELECT_LIBRARY_TYPE'
};

export const lock_in_creed = (library_type_index) => (selected_index) => (levels_deep) => {
    return {
        type: CREEDS_ACTIONS.LOCK_IN_CREED,
        library_type_index,
        selected_index,
        levels_deep
    };
};


