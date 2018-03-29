import {BIBLE_ACTIONS} from '../actions/bible-actions';

import bible_text from '../../../data/Bible-KJV.json';

import {is_present_type} from '../../utils/functions'

const get_original_chapter_state = (bible_text) => {
    const book = bible_text.content[18];

    const title = book.content[0].content[0]
        .map(({text}) => text)
        .join(' ');
    
    return {
        title,
        description: book.description || '',
        content: book.content[0].content
    }
};


const _bible_chapter = (bible_text) => (cache) => (state = get_original_chapter_state(bible_text), action) => {


    return state;
};

export const bible_chapter = _bible_chapter(bible_text)({});



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
            chapter_list
        };

        cache[action.book_selected_index] = return_value;

        return cache[action.book_selected_index];
    };

    return state;
};

export const selection_bible_chapter_list = _selection_bible_chapter_list(bible_text)({});


