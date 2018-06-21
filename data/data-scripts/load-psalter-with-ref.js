const fs = require('fs');
const psalter_json = require('../PsalterJSON.json');
const {log} = console;

const j = (item) => {
    return log(JSON.stringify(item, null, 4));
};

const get_ref = (current_psalter) => (prev_psalter) => {
    return (current_psalter.psalm === prev_psalter.psalm)
        ? prev_psalter.ref
        : [];
};


const load_w_ref = (p_array = []) => (index = 0) => (return_array = []) => {

    const psalter = p_array[index];

    const ref = (!Array.isArray(psalter.ref) || psalter.ref.length === 0)
        ? get_ref(psalter)(return_array.slice(-1)[0])
        : psalter.ref;

    const new_return_array = [...return_array, {
        ...psalter,
        ref
    }];

    const new_index = index + 1;

    return (new_index < p_array.length)
        ? load_w_ref(p_array)(new_index)(new_return_array)
        : new_return_array;
};

const output = load_w_ref(psalter_json)(0)([]);

fs.writeFile(`/Users/notforyoutouse/psalter1912-2/data/PsalterJSON-2.json`, JSON.stringify(output, null, 4), 'utf-8', () => {
    // j(require(`/data/PsalterJSON.json`));
});