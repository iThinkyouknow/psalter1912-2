import {} from '../actions/bible-actions';

import bible_text from '../../../data/Bible-KJV.json';

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


