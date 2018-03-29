export const BIBLE_ACTIONS = {
    GET_BIBLE_CHAPTER_LIST: "GET_BIBLE_CHAPTER_LIST"
};

export const get_bible_chapter_list = (book_selected_index) => {
    return {
        type: BIBLE_ACTIONS.GET_BIBLE_CHAPTER_LIST,
        book_selected_index
    }
}