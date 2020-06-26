export const COPY_ACTIONS = {
    SET_COPY_TEXT: 'SET_COPY_TEXT'
};

export const set_copy_text = (copy_text) => {
    return {
        type: COPY_ACTIONS.SET_COPY_TEXT,
        copy_text
    }
}