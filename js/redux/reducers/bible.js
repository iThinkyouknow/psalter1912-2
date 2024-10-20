import { BIBLE_ACTIONS } from '../actions/bible-actions';

import { is_array } from '../../utils/functions'

const get_bible_passage = (bible_text, book_index, chapter_index) => {
    const book = bible_text.content[book_index];

    const title = book.content[chapter_index].content[0]
        .map(({ text }) => text)
        .join(' ');

    return {
        title,
        description: book.description || '',
        content: book.content[chapter_index].content,
        book_index: book_index,
        chapter_index: chapter_index
    }
};


const _selection_bible_chapter_list = (cache) => (bible_text, book_selected_index) => {


    if (is_array(cache[book_selected_index])) return cache[book_selected_index];

    const book = bible_text.content[book_selected_index];
    const title = book.header;
    const chapter_list = book.content
        .map((chapter, index) => index + 1);

    const return_value = {
        title,
        chapter_list,
        book_index: book_selected_index
    };

    cache[book_selected_index] = return_value;

    return cache[book_selected_index];



};

const selection_bible_chapter_list = _selection_bible_chapter_list({});

const default_state = {
    bible: {}
    , bible_book_list: []
    , bible_passage: {}
    , selection_bible_chapter_list: {}
    , bible_per_book_ch_last_index_array: []
};


export const bible = (state = default_state, action = {}) => {
    if (action.type === BIBLE_ACTIONS.GET_BIBLE_INIT) {        
        const bible = action.bible;
        const bible_book_list = bible.content.map(book => book.abbrev_header[0]);
        const bible_passage = get_bible_passage(bible, 18, 0);
        const selection_bible_chapter_list = {
            title: "",
            chapter_list: [],
            book_index: NaN
        };
        const bible_per_book_ch_last_index_array = bible.content.map(({ content }) => content.length - 1);

        return {
            bible
            , bible_book_list
            , bible_passage
            , selection_bible_chapter_list
            , bible_per_book_ch_last_index_array
        }
    } else if (action.type === BIBLE_ACTIONS.GET_BIBLE_PASSAGE) {
        const new_state_w_bible_passage = {
            ...state,
            bible_passage: get_bible_passage(state.bible, action.book_selected_index, action.chapter_selected_index)
        }
        return new_state_w_bible_passage;
    } else if (action.type === BIBLE_ACTIONS.GET_BIBLE_CHAPTER_LIST) {
        return {
            ...state,
            selection_bible_chapter_list: selection_bible_chapter_list(state.bible, action.book_selected_index)
        }
    };

    return state;
};

