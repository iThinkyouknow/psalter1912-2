const regex = /(\n\n)|(\n)|(#\d+#)|(A\. +)|(Q\. \d+\.+)|(<([\w]+)[^>]*>.*?<\/\7>)/g;

const line_is_valid = split_lines => (split_lines !== undefined && !/^( |\t\v)*$/.test(split_lines) && split_lines !== 'i' && split_lines !== 'b');

const space_remove_regex = /^( |\v|\t)*|( |\v|\t)*$/g;

const proof_super_s_regex = /#(\d+)#/g;
const proof_replace_by = (m, p1) => p1;

const ans_regex = /^A\. +/g;
const ans_replace_by = `Answer:`;

const q_regex = /Q\. *(\d+)\.+/g;
const q_replace_by = (m, p1) => `Question ${p1}:`;

const italics_regex = /<([i]+)[^>]*>(.*?)<\/\1>/ig;
const bold_regex = /<([b]+)[^>]*>(.*?)<\/\1>/ig;
const italics_n_bold_replace_by = (m, p1, p2) => p2;

const error_or_rej_regex = /Error *:+ *|Rejection *:+ */ig;

const list_regex = /^(\d+\.) +/;
const list_replace_by = proof_replace_by;

const text_trimmer = text_obj => {
    return {
        ...text_obj,
        text: text_obj.text.replace(space_remove_regex, '')
    };
};

const replace = to_replace_regex => output => text => text.replace(to_replace_regex, output);


const text_attr_fn =  (style) => (regex) => (replace_by) => (text_obj) => {
    const replace_output = replace(regex)(replace_by)(text_obj.text);

    return regex.test(text_obj.text) ? {
        ...text_obj,
        [style]: true,
        text: replace_output
    }
    : text_obj;
};

const bold_text_attr = text_attr_fn('is_bold');



const proof_super_script_fn = text_attr_fn('is_superscript')(proof_super_s_regex)(proof_replace_by);
const ans_fn = bold_text_attr(ans_regex)(ans_replace_by);
const q_fn = bold_text_attr(q_regex)(q_replace_by);
const italics_fn = text_attr_fn('is_italics')(italics_regex)(italics_n_bold_replace_by);
const bold_fn = bold_text_attr(bold_regex)(italics_n_bold_replace_by);
const list_fn = text_attr_fn('is_list')(list_regex)(list_replace_by);


const compose = (val, fn) => {
    return fn(val);
};




module.exports = {
    regex,
    line_is_valid,
    space_remove_regex,
    proof_super_s_regex,
    proof_replace_by,
    ans_regex,
    ans_replace_by,
    q_regex,
    q_replace_by,
    italics_regex,
    bold_regex,
    italics_n_bold_replace_by,
    error_or_rej_regex,
    text_trimmer,
    replace,
    text_attr_fn,
    compose,
    proof_super_script_fn,
    ans_fn,
    q_fn,
    italics_fn,
    bold_fn,
    list_fn

};


