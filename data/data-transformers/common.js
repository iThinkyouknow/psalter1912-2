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

const text_trimmer = text => text.replace(space_remove_regex, '');

const replace = to_replace_exp => output => text => text.replace(to_replace_exp, output);

const text_attr_fn =  (style) => (regex) => (output) => (text) => {

    return regex.test(text) ? {
        [style]: true,
        text: output
    } : {
        text
    }
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
    text_attr_fn
};


