const fs = require('fs');

const {log} = console;

const j = (text) => {
    return JSON.stringify(text, null, 4);
}
// const hc = require('../_The-Heidelberg-Catechism.json');


const common = require('./common');
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




const text_attributor = text => {
    // log('-------')
    // log(JSON.stringify(text));
    const trimmed_text = text.replace(common.space_remove_regex, '');

    if (common.proof_super_s_regex.test(trimmed_text)) {
        return {
            is_superscript: true,
            text: trimmed_text.replace(common.proof_super_s_regex, common.proof_replace_by)
        };

    } else if (common.ans_regex.test(trimmed_text)) {
        return {
            is_bold: true,
            text: common.ans_replace_by
        };
    } else if (common.q_regex.test(trimmed_text)) {
        return {
            is_bold: true,
            text: trimmed_text
                .replace(common.q_regex, common.q_replace_by)
        };
    } else if (common.italics_regex.test(trimmed_text)) {
        return {
            is_italics: true,
            text: trimmed_text.replace(common.italics_regex, common.italics_n_bold_replace_by)
        }
    } else if (common.bold_regex.test(trimmed_text)) {
        return {
            is_bold: true,
            text: trimmed_text.replace(common.bold_regex, common.italics_n_bold_replace_by)
        }
    } else if (common.error_or_rej_regex.test(trimmed_text)) {
        return {
            is_bold: true,
            text: trimmed_text
        }
    }

    return {
        text: trimmed_text
    };
};

// const line_is_valid = split_lines => (split_lines !== undefined && !/^( |\t\v)*$/.test(split_lines) && split_lines !== 'i' && split_lines !== 'b');

const regex = /(\n\n)|(\n)|(#\d#)|(A\. +)|(Q\. \d+\.+)|(<([\w]+)[^>]*>.*?<\/\7>)|(Error *:+ *)|(Rejection *:+ *)/g;

const rej_preamble = [
    {
        text: 'The true doctrine concerning'
    }
    , {
        is_italics: true
        , text: 'Election'
    }
    , {
        text: 'and'
    }
    , {
        is_italics: true
        , text: 'Reprobation'
    }
    , {
        text: 'having been explained,'
    }
    , {
        text: 'the Synod'
    }
    , {
        is_italics: true
        , text: 'rejects'
    }
    , {
        text: 'the errors of those:'
    }
];

[
    [require('../_The-Canons-of_Dordt.json'), 'The-Canons-of_Dordt'. rej_preamble],
    [require('../_The-Church-Order.json'), 'The-Church-Order', []]
].forEach(([file, output_name, rej_preamble]) => {
    const creed_content = file.content;
    const content_array = Object.entries(creed_content);
    const new_content = content_array.map(([key, {chapter, content}]) => {
        const body_array = Object.entries(content);
        const new_body = body_array.map(([key, {header, body}]) => {
            const new_header = header
                .split(regex)
                .filter(common.line_is_valid)
                .map(text_attributor);
            //end of new_header



            const new_body_2 = body
                .split(regex)
                .filter(common.line_is_valid)
                .map(text_attributor);
            //end of new_body

            // const proof_regex = /(\d\.) +(\d+\.+)/ig;

            // const new_proof = (proof || '')
            //     .replace(proof_regex, (m, p1, p2) => `${p1}\n${p2}`)
            //     .split(regex)
            //     .filter(common.line_is_valid)
            //     .map(text_attributor);

            const is_err_text = /^Rejection of Error/i.test(new_header[0].text);

            const new_content = (is_err_text && rej_preamble.length > 0)
                ? [new_header, rej_preamble, new_body_2]
                : [new_header, new_body_2];

            const key_int = parseInt(key);

            return {
                id: isNaN(key_int) ? key : key_int,
                content: new_content,
            }
        });

        return {
            header: chapter,
            content: new_body
        }
    });

// log(j(new_content.slice(1, 2)));

    const new_creed = {
        title: file.title,
        type: file.type,
        content: new_content,
        levels_deep: 2
    };


// log(new_content.length);
    const json_new_creed = JSON.stringify(new_creed, null, 4);
// log(json_new_creed);


    fs.writeFile(`/Users/notforyoutouse/psalter1912-2/data/${output_name}.json`, json_new_creed);
});



