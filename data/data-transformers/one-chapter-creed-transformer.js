
const fs = require('fs');

const {log} = console;

const j = (text) => {
    return JSON.stringify(text, null, 4);
}

// const hc = require('../_The-Heidelberg-Catechism.json');
/**
 * {
 *      title,
 *      type,
 *      content : [
 *
*              {
*                  header: 'First Head of Doctrine - Of Divine Predestination',
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


// const creed = require('../_The-Apostles-Creed.json');

const creeds_array = [
    [require('../_The-Apostles-Creed.json'), 'The-Apostles-Creed'],
    [require('../_The-Nicene-Creed.json'), 'The-Nicene-Creed'],
    [require('../_The-Athanasian-Creed.json'), 'The-Athanasian-Creed'],
    [require('../_The-Creed-of-Chalcedon.json'), 'The-Creed-of-Chalcedon'],
];

const text_attributor = text => {
    // log('-------')
    // log(JSON.stringify(text));
    // const trimmed_text = text.replace(/^( |\v|\t)*|( |\v|\t)*$/g, '');
    const trimmed_text = text.trim();

    if (/#\d#/g.test(trimmed_text)) {
        return {
            is_superscript: true,
            text: trimmed_text
        };

    } else if (/^ *A\./g.test(trimmed_text)) {
        return {
            is_bold: true,
            text: `Answer:`
        };
    } else if (/Q\. *\d+\.+/g.test(trimmed_text)) {
        return {
            is_bold: true,
            text: trimmed_text
                .replace(/Q\. *(\d+)\.+/g, (match, p1) => `Question ${p1}:`)
        };
    } else if (/<(i)[^>]*>.*?<\/\1>/ig.test(trimmed_text)) {
        return {
            is_italics: true,
            text: trimmed_text.replace(/<([\w]+)[^>]*>(.*?)<\/\1>/ig, (match, p1, p2) => p2)
        }
    } else if (/<(b)[^>]*>.*?<\/\1>/ig.test(trimmed_text)) {
        return {
            is_italics: true,
            text: trimmed_text.replace(/<([\w]+)[^>]*>(.*?)<\/\1>/ig, (match, p1, p2) => p2)
        }
    } else if (/Error *:+ *|Rejection *:+ *|\d+ *\.+/ig.test(trimmed_text)) {
        return {
            is_bold: true,
            text: trimmed_text
        }
    }


    return {
        text: trimmed_text
    };

};

const line_is_valid = split_lines => (split_lines !== undefined && !/^( |\t|\v|\n)*$/.test(split_lines) && split_lines !== 'i' && split_lines !== 'b');

const regex = /(\n\n)|(\n)|(#\d#)|(^ *A\.)|(Q\. \d+\.+)|(<([\w]+)[^>]*>.*?<\/\7>)/g;


creeds_array.forEach(([file, output_name]) => {
    const content_array = Object.entries(file.content);
    const new_content = content_array.map(([key, {chapter, header, body}], i) => {
        // const new_header = header
        //     .split(regex)
        //     .filter(line_is_valid)
        //     .map(text_attributor);

        const new_body = body
            .split(regex)
            .filter(line_is_valid)
            .map(text => {
                return text
                    .split(/(\d+ *\.+)/ig)
                    .filter(line_is_valid)
                    .map(text_attributor)
            });


        const new_body_2 = {
            id: i,
            content: new_body
        };

        return {
            header,
            content: new_body_2
        };
    });

// log(j(new_content));

    const new_creed = {
        title: file.title,
        type: file.type,
        content: new_content
    };
//
//
    log(new_content.length);
    const json_creed = JSON.stringify(new_creed, null, 4);

    log(json_creed);



    fs.writeFileSync(`/Users/notforyoutouse/psalter1912-2/data/${output_name}.json`, json_creed);
});









