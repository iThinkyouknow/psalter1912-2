import {SEARCH_ACTIONS} from '../actions/search-actions';
import psalterSearchJson from '../../../data/PsalterSearchJSON.json';

const psalter_search_result_cache = {};

export function psalter_search_results(state = [], action = {}) {
    if (action.type === SEARCH_ACTIONS.SEARCH_PSALTER) {

        if (typeof action.search_text !== 'string') return state;

        // const regex = new RegExp(action.search_text.split('').join('(\\w|\\s|\\d)*'), 'ig');
        const regex = new RegExp(action.search_text, 'ig');

        const cache_key = regex.toString().toLowerCase();

        const result_in_cache = psalter_search_result_cache[cache_key];

        if  (result_in_cache !== undefined) return result_in_cache;


        const search_result = psalterSearchJson.reduce((acc, {index, title, text}, i) => {
            const result_array = regex.exec(text);
            if (!Array.isArray(result_array)) return acc;
            const search_text = result_array[0];
            const start_index = (result_array.index < 20) ? 0 : result_array.index - 20;
            const end_index = ((result_array.input.length - start_index) < 194) ? result_array.input.length : start_index + 114;

            const result_context_str = result_array.input.slice(start_index, end_index);

            const exact_search_string_regex = new RegExp(search_text, 'ig');
            const search_string_result_wi_context = exact_search_string_regex.exec(result_context_str);
            const exact_string_start_range = 20;
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
            ];

            const result = {
                index,
                title,
                search_result: result_string_with_format
            };

            return [...acc, result];
        }, []);

        psalter_search_result_cache[cache_key] = search_result;


        console.log(JSON.stringify(Object.keys(psalter_search_result_cache), null, 4));
        return search_result;
    }

    return state;
}

