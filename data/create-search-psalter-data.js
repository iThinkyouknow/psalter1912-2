const psalterJSON_array = require('./PsalterJSON.json');
const fs = require('fs');
const t0 = Date.now();
const searchJSON_array = psalterJSON_array.map((psalter, index) => {
    const {no, title, meter, psalm, content, ref} = psalter;


    const ref_text = Array.isArray(ref) ? ref.reduce((acc, {v, refs}, j) => {
        const formatted_ref = `Psalm ${psalm}:${v} ${refs}`;
        if (j === 0) return `${acc}${formatted_ref}`;
        return `${acc} | ${formatted_ref}`;
    }, '\n') : '';


    const content_text = content.reduce((accumulator, paragraph, _index) => {
        const para_text = paragraph.reduce((acc, sentence, i) => {
            if (i === 0) return `${sentence}`;
            return `${acc} ${sentence}`;
        }, '');

        if (_index === 0) return `${_index + 1}. ${para_text}`;
        return `${accumulator} ${_index + 1}. ${para_text}`;
    }, '');

    const text = `Psalter ${no}\n${title}\nMeter:${meter}\nPsalm ${psalm}\n${content_text}${ref_text}`;
    return {
        index,
        title: `Psalter ${no}`,
        text
    };
});

const t1 = Date.now();
console.log(`time: ${(t1 - t0)}`);

const searchJSON_json = JSON.stringify(searchJSON_array, null, 4);

fs.writeFile('data/PsalterSearchJSON.json', searchJSON_json, 'utf8', (err) => {

    console.log(err);
});

