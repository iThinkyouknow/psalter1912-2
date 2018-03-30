import {BIBLE_ACTIONS} from '../actions/bible-actions';

import bible_text from '../../../data/Bible-KJV.json';

import {is_present_type} from '../../utils/functions'

const get_bible_passage = (bible_text) => (book_index) => (chapter_index) => {
    const book = bible_text.content[book_index];

    const title = book.content[chapter_index].content[0]
        .map(({text}) => text)
        .join(' ');

    return {
        title,
        description: book.description || '',
        content: book.content[chapter_index].content
    }
};


const _bible_passage = (bible_text) => (cache) => (state = get_bible_passage(bible_text)(18)(0), action) => {

    if (action.type === BIBLE_ACTIONS.GET_BIBLE_PASSAGE) {
        return get_bible_passage(bible_text)(action.book_selected_index)(action.chapter_selected_index);
    };


    return state;
};

export const bible_passage = _bible_passage(bible_text)({});



export const bible_book_list = (state, action) => {
    return bible_text.content.map(book => book.abbrev_header[0]);
};

const _selection_bible_chapter_list = (bible_text) => (cache) => (state = [], action = {}) => {
    if (action.type === BIBLE_ACTIONS.GET_BIBLE_CHAPTER_LIST) {

        if (is_present_type('array')(cache[action.book_selected_index])) return cache[action.book_selected_index];
        const book = bible_text.content[action.book_selected_index];
        const title = book.header;
        const chapter_list = book.content
            .map((chapter, index) => index + 1);

        const return_value = {
            title,
            chapter_list,
            book_index: action.book_selected_index
        };

        cache[action.book_selected_index] = return_value;

        return cache[action.book_selected_index];
    };

    return state;
};

export const selection_bible_chapter_list = _selection_bible_chapter_list(bible_text)({});


