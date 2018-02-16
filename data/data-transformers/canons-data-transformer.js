const fs = require('fs');

const {log} = console;

const j = (text) => {
    return JSON.stringify(text, null, 4);
}
// const hc = require('../_The-Heidelberg-Catechism.json');
const creed = require('../_The-Canons-of_Dordt.json');
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

const creed_content = creed[3].content;
const content_array = Object.entries(creed_content);


const text_attributor = text => {
    // log('-------')
    // log(JSON.stringify(text));
    const trimmed_text = text.replace(/^( |\v|\t)*|( |\v|\t)*$/g, '');

    if (/#\d#/g.test(trimmed_text)) {
        return {
            is_superscript: true,
            text: trimmed_text
        };

    } else if (/A\./g.test(trimmed_text)) {
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
    } else if (/Error *:+ *|Rejection *:+ */ig.test(trimmed_text)) {
        return {
            is_bold: true,
            text: trimmed_text
        }
    }


    return {
        text: trimmed_text
    };
};

const line_is_valid = split_lines => (split_lines !== undefined && !/^( |\t\v)*$/.test(split_lines) && split_lines !== 'i' && split_lines !== 'b');

const regex = /(\n\n)|(\n)|(#\d#)|(A\.)|(Q\. \d+\.+)|(<([\w]+)[^>]*>.*?<\/\7>)|(Error *:+ *)|(Rejection *:+ *)/g;

const new_content = content_array.map(([key, {chapter, content}]) => {
    const body_array = Object.entries(content);
    const new_body = body_array.map(([key, {header, body}]) => {
        const new_header = header
            .split(regex)
            .filter(line_is_valid)
            .map(text_attributor);
        //end of new_header

        const new_body_2 = body
            .split(regex)
            .filter(line_is_valid)
            .map(text_attributor);
        //end of new_body

        const proof_regex = /(\d\.) +(\d+\.+)/ig;

        // const new_proof = (proof || '')
        //     .replace(proof_regex, (m, p1, p2) => `${p1}\n${p2}`)
        //     .split(regex)
        //     .filter(line_is_valid)
        //     .map(text_attributor);

        const new_content = [new_header, new_body_2];

        const key_int = parseInt(key);


        return {
            id: isNaN(key_int) ? key : key_int,
            content: new_content,

        }
    });

    ;

    return {
        header: chapter,
        content: new_body
    }
});

// log(j(new_content.slice(1, 2)));



const new_creed = {
    title: creed[3].title,
    type: creed[3].type,
    content: new_content,
    levels_deep: 2
};


// log(new_content.length);
const json_new_creed = JSON.stringify(new_creed, null, 4);
// log(json_new_creed);



fs.writeFile('/Users/notforyoutouse/psalter1912-2/data/The-Canons-of-Dordt.json', json_new_creed);

