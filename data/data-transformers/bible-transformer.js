const fs = require('fs');



const { log, dir } = console;

const jlog = (obj) => {
    return log(JSON.stringify(obj, null, 4));
};


const book_names = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts (of the Apostles)",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation"
];


const bible_json = require('../Bible-kjv-preformatted.json');

const text_attributor = (text) => {

    const new_text = text.replace(/\{|\}/g, '').trim();

    if (/^\{.+:/.test(text)) {

        return {
            is_footnote: true,
            text: new_text
        };

    } else if (/^\{/.test(text)) {

        return {
            is_italics: true,
            text: new_text
        };
    }

    return {
        text: new_text
    };
}

const verses_attributor = (header) => (verses_array, j) => {

    const chapter_title = [
        {
            text: `${header} ${j + 1}`
        }
    ];

    const new_verses_array = verses_array.map((verse, k) => {

        const new_verse_array = verse
            .split(/(?=\{)|\}/g)
            .filter(str => str.trim().length > 0)
            .map(text_attributor);

        return new_verse_array
    });

    
    const new_verses_array_with_title = [
        chapter_title, 
        ...new_verses_array
    ];

    return {
        id: j + 1,
        content: new_verses_array_with_title
    };
};

const book_attributor = (book_names) => (book, index) => {
    const abbrev_header = [book.abbrev];
    const header = book_names[index] || "";

    const new_ch = book.chapters.map(verses_attributor(header));

    return {
        title: "The Holy Bible",
        type: "Bible",
        content: [
            { //gen
                header,
                abbrev_header,
                content: new_ch
            }
        ]
    };
}


const bible_transformer = (book_names) => (bible_json) => {

    const transformed = bible_json.map(book_attributor(book_names));

    return transformed;

};

const transformed_bible = bible_transformer(book_names)(bible_json);

// jlog(transformed_bible);

fs.writeFile('data/Bible-KJV.json', JSON.stringify(transformed_bible, null, 4));