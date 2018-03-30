export const BIBLE_ACTIONS = {
    GET_BIBLE_CHAPTER_LIST: "GET_BIBLE_CHAPTER_LIST"
    , GET_BIBLE_PASSAGE: "GET_BIBLE_PASSAGE"
};

export const get_bible_chapter_list = (book_selected_index) => {
    return {
        type: BIBLE_ACTIONS.GET_BIBLE_CHAPTER_LIST,
        book_selected_index
    }
};

export const get_bible_passage = (book_selected_index) => (chapter_selected_index) => {
    return {
        type: BIBLE_ACTIONS.GET_BIBLE_PASSAGE,
        book_selected_index,
        chapter_selected_index
    }
};