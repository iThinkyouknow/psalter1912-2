export const CREEDS_ACTIONS = {
    LOCK_IN_CREED: 'LOCK_IN_CREED',
    LOCK_IN_CREED_LEVEL_2: 'LOCK_IN_CREED_LEVEL_2'
};

export const lock_in_creed = (library_type_index) => (selected_index) => (levels_deep) => {
    return {
        type: CREEDS_ACTIONS.LOCK_IN_CREED,
        library_type_index,
        selected_index,
        levels_deep
    };
};

export const lock_in_creed_level_2 = library_type_index => selected_creed_index => selected_chapter_index => {
    return {
        type: CREEDS_ACTIONS.LOCK_IN_CREED_LEVEL_2,
        library_type_index,
        selected_creed_index,
        selected_chapter_index
    }
}


