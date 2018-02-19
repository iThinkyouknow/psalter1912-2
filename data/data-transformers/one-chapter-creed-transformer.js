
const fs = require('fs');

const {log} = console;

const j = (text) => {
    return JSON.stringify(text, null, 4);
}

const common = require('./common');

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
    // [require('../_The-Belgic-Confession.json'), 'The-Belgic-Confession'],
    // [require('../_The-Apostles-Creed.json'), 'The-Apostles-Creed'],
    // [require('../_The-Nicene-Creed.json'), 'The-Nicene-Creed'],
    // [require('../_The-Athanasian-Creed.json'), 'The-Athanasian-Creed'],
    // [require('../_The-Creed-of-Chalcedon.json'), 'The-Creed-of-Chalcedon'],
    // [require('../_The-Form-for-the-Administration-of-Baptism.json'), 'The-Form-for-the-Administration-of-Baptism']
    [require('../_Form-for-Excommunication.json'), 'Form-for-Excommunication'],
    [require('../_Form-for-Public-Confession-of-Faith.json'), 'Form-for-Public-Confession-of-Faith'],
    [require('../_Form-for-Readmitting-Excommunicated-Persons.json'), 'Form-for-Readmitting-Excommunicated-Persons'],
    [require('../_Form-for-the-Administration-of-the-Lord\'s-Supper.json'), 'Form-for-the-Administration-of-the-Lord\'s-Supper'],
    [require('../_Form-for-the-Confirmation-of-Marriage-before-the-Church.json'), 'Form-for-the-Confirmation-of-Marriage-before-the-Church'],
    [require('../_Form-for-the-Installation-of-Professors-of-Theology.json'), 'Form-for-the-Installation-of-Professors-of-Theology'],
    [require('../_Form-for-the-Ordination-(or-Installation)-of-Missionaries.json'), 'Form-for-the-Ordination-(or-Installation)-of-Missionaries'],
    [require('../_Form-of-Ordination-(or-Installation)-of-Ministers-of-God\'s-Word.json'), 'Form-of-Ordination-(or-Installation)-of-Ministers-of-God\'s-Word'],
    [require('../_Form-of-Ordination-of-Elders-and-Deacons.json'), 'Form-of-Ordination-of-Elders-and-Deacons'],
    [require('../_Formula-of-Subscription-(PRCA).json'), 'Formula-of-Subscription-(PRCA).json']
];

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

const line_is_valid = split_lines => (split_lines !== undefined && !/^( |\t|\v|\n)*$/.test(split_lines) && split_lines !== 'i' && split_lines !== 'b');

const regex = /(\n\n)|(\n)|(#\d+#)|(^ *A\. +)|(Q\. \d+\.+)|(<([\w]+)[^>]*>.*?<\/\7>)/g;


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
                    .split(/(\d+ *\. +)/ig)
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









