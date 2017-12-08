export const STATE_ACTIONS = {
    PSALTER_TEXT_INPUT: 'PSALTER_TEXT_INPUT',
    TOGGLE_TEXT_INPUT_VALID: "TOGGLE_TEXT_INPUT_INVALID"
};

export const psalter_text_input = (val) => {
    return {
        type: STATE_ACTIONS.PSALTER_TEXT_INPUT,
        val
    }
};

export const toggle_text_as_valid = (is_valid) => {
    return {
        type: STATE_ACTIONS.TOGGLE_TEXT_INPUT_VALID,
        is_valid
    }
}