const fs = require('fs');

const {log} = console;

const j = (text) => {
    return JSON.stringify(text, null, 4);
}

const common = require('./common');

/**
 * {
 *      title,
 *      type,
 *      content : [
 *
*              {
*                  header: 'Lord's Day 1',
*                  content: [
*                       {
*                           id: int
*                           content: [
*                               style,
*                               text
*                           ],
*                           [...answer...],
*                           [...proof...]
*                       },
*                       {
*                       ...
*                       }
*
*                  ]
*              }
 *
 *
 *
 *      ]
 *
 * }

 * **/



// const text_attributor = text => {
//
//     const trimmed_text = text.replace(common.space_remove_regex, '');
//
//     if (common.proof_super_s_regex.test(trimmed_text)) {
//         return {
//             is_superscript: true,
//             text: trimmed_text.replace(common.proof_super_s_regex, common.proof_replace_by)
//         };
//
//     } else if (common.ans_regex.test(trimmed_text)) {
//         return {
//             is_bold: true,
//             text: common.ans_replace_by
//         };
//     } else if (common.q_regex.test(trimmed_text)) {
//         return {
//             is_bold: true,
//             text: trimmed_text
//                 .replace(common.q_regex, common.q_replace_by)
//         };
//     } else if (common.italics_regex.test(trimmed_text)) {
//         return {
//             is_italics: true,
//             text: trimmed_text.replace(common.italics_regex, common.italics_n_bold_replace_by)
//         }
//     } else if (common.bold_regex.test(trimmed_text)) {
//         return {
//             is_italics: true,
//             text: trimmed_text.replace(common.bold_regex, common.italics_n_bold_replace_by)
//         }
//     }
//
//     return {
//         text: trimmed_text
//     };
// };


const text_attributor = style => text => {
    const {
        compose,
        proof_super_script_fn,
        ans_fn,
        q_fn,
        italics_fn,
        bold_fn,
        list_fn,
        text_trimmer
    } = common;

    const style_obj = (style !== undefined) ? {
        [style]: true,
        text
    } : {
        text
    };

    return [
        proof_super_script_fn,
        ans_fn,
        q_fn,
        italics_fn,
        bold_fn,
        list_fn,
        text_trimmer
    ].reduce(compose, style_obj);
};


// const line_is_valid = split_lines => (split_lines !== undefined && !/^( |\t\v)*$/.test(split_lines) && split_lines !== 'i' && split_lines !== 'b');

const regex = /(\n\n)|(\n)|(#\d+#)|(^ *A\. +)|(Q\. \d+\.+)|(<([\w]+)[^>]*>.*?<\/\7>)|(?:^|\n\n| *)(\d+\.) +/g;

[
    // [require('../_The-Heidelberg-Catechism.json'), 'The-Heidelberg-Catechism(by-LD)']
    // [require('../_The-Belgic-Confession.json'), 'The-Belgic-Confession']
    // [require('../_The-Apostles-Creed.json'), 'The-Apostles-Creed']
    // [require('../_The-Athanasian-Creed.json'), 'The-Athanasian-Creed'],
    // [require('../_The-Creed-of-Chalcedon.json'), 'The-Creed-of-Chalcedon'],
    [require('../_Form-for-the-Administration-of-Baptism.json'), 'Form-for-the-Administration-of-Baptism'],
    // [require('../_The-Nicene-Creed.json'), 'The-Nicene-Creed'],
    // [require('../_Form-for-Excommunication.json'), 'Form-for-Excommunication'],
    // [require('../_Form-for-Public-Confession-of-Faith.json'), 'Form-for-Public-Confession-of-Faith'],
    // [require('../_Form-for-Readmitting-Excommunicated-Persons.json'), 'Form-for-Readmitting-Excommunicated-Persons'],
    // [require('../_Form-for-the-Administration-of-the-Lord\'s-Supper.json'), 'Form-for-the-Administration-of-the-Lord\'s-Supper'],
    // [require('../_Form-for-the-Confirmation-of-Marriage-before-the-Church.json'), 'Form-for-the-Confirmation-of-Marriage-before-the-Church'],
    // [require('../_Form-for-the-Installation-of-Professors-of-Theology.json'), 'Form-for-the-Installation-of-Professors-of-Theology'],
    // [require('../_Form-for-the-Ordination-(or-Installation)-of-Missionaries.json'), 'Form-for-the-Ordination-(or-Installation)-of-Missionaries'],
    // [require('../_Form-of-Ordination-(or-Installation)-of-Ministers-of-God\'s-Word.json'), 'Form-of-Ordination-(or-Installation)-of-Ministers-of-God\'s-Word'],
    // [require('../_Form-of-Ordination-of-Elders-and-Deacons.json'), 'Form-of-Ordination-of-Elders-and-Deacons'],
    // [require('../_Formula-of-Subscription-(PRCA).json'), 'Formula-of-Subscription-(PRCA)'],
].forEach(([file, output_name]) => {
    const content_array = Object.entries(file.content);

    const new_content = content_array.map(([key, {header, body, chapter, proof}]) => {

        const new_header = header
            .split(regex)
            .filter(common.line_is_valid)
            .map(text_attributor('is_bold'));
        //end of new_header

        const new_body = body
            .split(regex)
            .filter(common.line_is_valid)
            .map(text_attributor());
        //end of new_body

        const proof_regex = /(\d\.) +(\d+\.+)/ig;

        const new_proof = (proof || '')
            .replace(proof_regex, (m, p1, p2) => `${p1}\n${p2}`)
            .split(regex)
            .filter(common.line_is_valid)
            .map(text_attributor());

        const new_content = [new_header, new_body, new_proof];

        const key_int = parseInt(key);


        return {
            header: (key.toLowerCase() === 'introduction') ? header : chapter,
            content: new_content,
            id: (typeof key_int === 'number') ? key_int : key
    }
    });

// log(j(new_content));

    const sort_by_chapter = (content_array, i, return_array) => {
        if (i >= content_array.length) return return_array;
        const new_i = i + 1;
        if (return_array.length === 0 || content_array[i].header !== return_array.slice(-1)[0].header) {
            const new_return_array = [...return_array, {
                header: content_array[i].header,
                content: [
                    {
                        id: content_array[i].id,
                        content: content_array[i].content
                    }
                ]
            }
            ];

            return sort_by_chapter(content_array, new_i, new_return_array);

        } else if (content_array[i].header === return_array.slice(-1)[0].header) {
            const new_return_array = [
                ...return_array.slice(0, -1),
                {
                    ...return_array.slice(-1)[0],
                    content: [
                        ...return_array.slice(-1)[0].content,
                        {
                            id: content_array[i].id,
                            content: content_array[i].content
                        }
                    ]
                }
            ];
            return sort_by_chapter(content_array, new_i, new_return_array);
        };
    };

    const content_sorted_by_ch = sort_by_chapter(new_content, 0, []);

    // log(j(content_sorted_by_ch.slice(0, 2)));

    const new_creed = {
        title: file.title,
        type: file.type,
        content: content_sorted_by_ch
    };


    log(content_sorted_by_ch.length);
    const json_new_creed = JSON.stringify(new_creed, null, 4);

    log(json_new_creed);

    fs.writeFileSync(`/Users/notforyoutouse/psalter1912-2/data/${output_name}.json`, json_new_creed);

});


