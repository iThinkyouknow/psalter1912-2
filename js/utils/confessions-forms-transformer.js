const fs = require('fs');

const {log} = console;

const j = (text) => {
    return JSON.stringify(text, null, 4);
}

const hc = require('/Users/notforyoutouse/psalter1912-2/data/_The-Heidelberg-Catechism.json');
/**
 * {
 *      title,
 *      type,
 *      content : [
 *
*              {
*                  header: 'Lord's Day 1',
*                  body: [
*                       [ //Q1
*                           {style, text} //question
*                           {style, text} //question
*                           {style, text} //question
*                       ],
*                       [ //Q2
*                           {style, text} //question
*                           {style, text} //question
*                           {style, text} //question
*                       ],
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

const content_array = Object.entries(hc[1].content);

const t0 = Date.now()
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
    }


    return {
        text: trimmed_text
    };
};

const line_is_valid = split_lines => (split_lines !== undefined && !/^( |\t\v)*$/.test(split_lines) && split_lines !== 'i' && split_lines !== 'b');

const regex = /(\n\n)|(\n)|(#\d#)|(A\.)|(Q\. \d+\.+)|(<([\w]+)[^>]*>.*?<\/\7>)/g;

const new_content = content_array.map(([key, {header, body, chapter, proof}]) => {

    const new_header = header
        .split(regex)
        .filter(line_is_valid)
        .map(text_attributor);
//end of new_header

    const new_body = body
        .split(regex)
        .filter(line_is_valid)
        .map(text_attributor);
    //end of new_body

    const proof_regex = /(\d\.) +(\d+\.+)/ig

    const new_proof = (proof || '')
        .replace(proof_regex, (m, p1, p2) => `${p1}\n${p2}`)
        .split(regex)
        .filter(line_is_valid)
        .map(text_attributor);

    const new_content = [new_header, new_body, new_proof];

    const key_int = parseInt(key);


    return {
        header: (key.toLowerCase() === 'introduction') ? header : chapter,
        content: new_content,
        id: isNaN(key_int) ? key : key_int
    }
});

// log(j(new_content));

const sort_by_LD = (content_array, i, return_array) => {
    if (i > 129) return return_array;
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

        return sort_by_LD(content_array, new_i, new_return_array);

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
        return sort_by_LD(content_array, new_i, new_return_array);
    };



};

const content_sorted_by_LD = sort_by_LD(new_content, 0, []);

// log(j(content_sorted_by_LD.slice(48)));

const new_hc = {
    title: hc[1].title,
    type: hc[1].type,
    content: content_sorted_by_LD
};

const json_new_hc = JSON.stringify(new_hc, null, 4);

console.log(Date.now() - t0);

fs.writeFile('/Users/notforyoutouse/psalter1912-2/data/The-Heidelberg-Catechism(by-LD).json', json_new_hc);

