const fs = require('fs');
const { log } = console;

const j = (obj) => {
    log(JSON.stringify(obj, null, 2));
};

const psalterJSON = require('../_PsalterJSON.json');

const psalterObj = psalterJSON
    // .slice(40, 42);

// j(psalterObj);

const psalters_w_merged_chorus = psalterObj.map((p, i) => {
    const content = p.content;

    const merger = (content_array, index, result_content_array) => {

        const lines_array = content_array[index];

        const chorus_regex = /^chorus/i;

        const has_chorus = index > 0 && chorus_regex.test(lines_array[0]);

        const lines_w_edited_chorus = chorus_regex.test(lines_array[0])
            ? [lines_array[0].replace(/^chorus:?/i, 'CHORUS'), ...lines_array.slice(1)]
            : lines_array;

        const new_result_content_array = (has_chorus)
            ? [...result_content_array.slice(0, -1), [...content_array[index -1], '', ...lines_w_edited_chorus]]
            : [...result_content_array, lines_array];

        const new_index = index + 1;
        if (new_index < content_array.length) {
            return merger(content_array, new_index, new_result_content_array)
        } else {
            return new_result_content_array;
        }
    };

    return {
        ...p,
        content: merger(content, 0, [])
    };
});

j(psalters_w_merged_chorus);

const merged_chorus_ps_json = JSON.stringify(psalters_w_merged_chorus, null, 2);

// fs.writeFile('data/PsalterJSON.json', merged_chorus_ps_json, 'utf8', (err) => {
//
//     console.log(err);
// });



