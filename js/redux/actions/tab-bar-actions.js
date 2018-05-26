export const TAB_BAR_ACTIONS = {
    SELECT_INDEX: 'SELECT_INDEX'
};

export const select_tab_index = (selected_index) => {
    return {
        type: TAB_BAR_ACTIONS.SELECT_INDEX
        , selected_index
    };
}
