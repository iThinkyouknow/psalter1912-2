
const psalterSearchJson = require('/Users/notforyoutouse/psalter1912-2/data/PsalterSearchJSON.json');
const {log} = console;

const test_str = 'ss 1:'

const regex = new RegExp(test_str.split('').join('(\\w|\\s|\\d)*'), 'ig');
log(regex);

const search_result = psalterSearchJson.reduce((acc, {index, title, text}, i) => {
    const result_array = regex.exec(text);
    if (!Array.isArray(result_array)) return acc;
    const search_text = result_array[0];
    const start_index = (result_array.index < 20) ? 0 : result_array.index - 20;
    const end_index = ((result_array.input.length - start_index) < 80) ? result_array.input.length : start_index + 80;

    const result_context_str = result_array.input.slice(start_index, end_index);

    const exact_search_string_regex = new RegExp(search_text, 'ig');
    const search_string_result_wi_context = exact_search_string_regex.exec(result_context_str);
    const exact_string_start_range = search_string_result_wi_context.index;
    const exact_string_end_range = exact_string_start_range +  search_text.length;

    const result_string_with_format = [
        {
            text: '...' + result_context_str.slice(0, exact_string_start_range)
        },
        {
            style: 'bold',
            text: result_context_str.slice(exact_string_start_range, exact_string_end_range)
        },
        {
            text: result_context_str.slice(exact_string_end_range) + '...'
        }
    ]


    const result = {
        index,
        title,
        search_result: result_string_with_format
    }
    return [...acc, result];
}, []);

log(JSON.stringify(search_result, null, 4));