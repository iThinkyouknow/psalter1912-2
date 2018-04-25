import {CREEDS_ACTIONS} from '../actions/creeds-actions';

import heidelberg_catechism from '../../../data/The-Heidelberg-Catechism(by-LD).json';
import belgic_confession from '../../../data/The-Belgic-Confession.json';
import canons_of_dordt from '../../../data/The-Canons-of_Dordt.json';
import apostles_creed from '../../../data/The-Apostles-Creed.json';
import nicene_creed from '../../../data/The-Nicene-Creed.json';
import athanasian_creed from '../../../data/The-Athanasian-Creed.json';
import creed_of_chalcedon from '../../../data/The-Creed-of-Chalcedon.json';

import baptism from '../../../data/Form-for-the-Administration-of-Baptism.json';
import public_confession_of_faith from '../../../data/Form-for-Public-Confession-of-Faith.json';
import lords_supper from "../../../data/Form-for-the-Administration-of-the-Lords-Supper.json";
import excommunication from '../../../data/Form-for-Excommunication.json';
import readmitting_excommunicated_persons from  '../../../data/Form-for-Readmitting-Excommunicated-Persons.json';
import ordination_or_installation_of_ministers_of_gods_word from '../../../data/Form-of-Ordination-(or-Installation)-of-Ministers-of-Gods-Word.json';
import ordination_of_elders_and_deacons from '../../../data/Form-of-Ordination-of-Elders-and-Deacons.json';
import the_installation_of_professors_of_theology from '../../../data/Form-for-the-Installation-of-Professors-of-Theology.json';
import the_ordination_or_installation_of_missionaries from '../../../data/Form-for-the-Ordination-(or-Installation)-of-Missionaries.json';
import marriage_form from '../../../data/Form-for-the-Confirmation-of-Marriage-before-the-Church.json';
import formula_of_subscription_PRCA from '../../../data/Formula-of-Subscription-(PRCA).json';
import the_church_order from '../../../data/The-Church-Order.json';

const creeds = [
    heidelberg_catechism,
    belgic_confession,
    canons_of_dordt,
    apostles_creed,
    nicene_creed,
    athanasian_creed,
    creed_of_chalcedon
];

const forms = [
    baptism,
    public_confession_of_faith,
    lords_supper,
    excommunication,
    readmitting_excommunicated_persons,
    ordination_or_installation_of_ministers_of_gods_word,
    ordination_of_elders_and_deacons,
    the_installation_of_professors_of_theology,
    the_ordination_or_installation_of_missionaries,
    marriage_form,
    formula_of_subscription_PRCA,
    the_church_order
];

const library = [
    creeds,
    forms
];

const get_lib_data = ({title, levels_deep}) => ({title, levels_deep});

const library_names_levels_array = [
    creeds.map(get_lib_data),
    forms.map(get_lib_data)
];

const _creeds_library = (library_names_levels_array) => (state, action = {}) => {
    return library_names_levels_array;
};

export const creeds_library = _creeds_library(library_names_levels_array);


const get_creed_content_w_header_only = (creed) => {
    const header_only_content = creed.content.map(({header, content}) => {
        const new_content = content.map(({content}) => {
            return content[0]
                .map(({text}) => text)
                .join(' ');
        });

        return {
            header,
            content: new_content
        }
    });

    return {
        title: creed.title,
        levels_deep: creed.levels_deep,
        content: header_only_content
    };
};

const original_creed_state = (library) => {
    const creed = library[0][0];
    return {
        ...get_creed_content_w_header_only(creed),
        library_type_index: 0,
        selected_index: 0
    };
};

const _creed = library => cache => original_state => (state = original_state, action) => {
    if (action.type === CREEDS_ACTIONS.LOCK_IN_CREED) {
        const {library_type_index, selected_index, levels_deep} = action;

        const key = `${library_type_index}${selected_index}`;
        if (cache[key] !== undefined) return cache[key];

        const creed = library[library_type_index][selected_index];

        cache = {
            ...cache,
            [key]: {
                ...get_creed_content_w_header_only(creed),
                library_type_index,
                selected_index
            }
        };

        return cache[key];
    }
    return state;
};

export const creed = _creed(library)({})(original_creed_state);


const _creed_level_2 = library => cache => (state = {}, action) => {
    if (action.type === CREEDS_ACTIONS.LOCK_IN_CREED_LEVEL_2) {
        const {library_type_index, selected_creed_index, selected_chapter_index} = action;
        const key = `${library_type_index}${selected_creed_index}${selected_chapter_index}`;

        if (cache[key] !== undefined) return cache[key];

        const creed = library[library_type_index][selected_creed_index];
        const chapter_header = creed.content[selected_chapter_index].header;
        const chapter_content = creed.content[selected_chapter_index].content.map(({content}) => {

            const [header, body, body2] = content
                .map(text_array => text_array.map(({text}) => text));

            const header_text = header.join(' ');

            const is_rej_of_error = /rejection of error/i.test(header_text);

            const body_to_display = is_rej_of_error ? body2 : body;

            const joined_body = body_to_display
                .join(' ')
                .slice(0, 100)
                .replace('\n\n', '');

            return {
                header: header_text,
                content: [`${joined_body}...`]
            };
        });

        cache = {
            ...cache,
            [key]: {
                title: chapter_header,
                levels_deep: creed.levels_deep,
                content: chapter_content,
                library_type_index,
                selected_creed_index,
                selected_chapter_index
            }
        };


        return cache[key];
    }

    return state;
};

export const creed_level_2 = _creed_level_2(library)({});


const _creed_body = (library) => (state = {}, action = {}) => {
    if (action.type === CREEDS_ACTIONS.LOCK_IN_CREED_BODY) {
        const {library_type_index, selected_creed_index, selected_chapter_index, selected_article_index} = action;
        const creed = library[library_type_index][selected_creed_index];

        if (selected_article_index === undefined || selected_article_index === null) {

            return {
                title: creed.title || '',
                description: creed.description || '',
                body: creed.content[selected_chapter_index]
            }
        } else {
            //level 2

            return {
                title: creed.title || '',
                description: creed.description || '',
                body: {
                    ...creed.content[selected_chapter_index],
                    content: [creed.content[selected_chapter_index].content[selected_article_index]]
                }

            }
        }
    }

    return state;
};

export const creed_body = _creed_body(library);

