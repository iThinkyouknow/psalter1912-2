import { CREEDS_ACTIONS } from '../actions/creeds-actions';
import { CREEDS_COUNT } from '../../common/constants';
const get_lib_data = ({ title, levels_deep, content }) => {
    return {
        title
        , levels_deep
        , last_ch_index: content.length - 1
        , last_article_index: (levels_deep === 2)
            ? content.map(({ content }) => content.length - 1)
            : []
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

const originalState = {
    title_order: [
        'The-Heidelberg-Catechism(by-LD)'
        , 'The-Belgic-Confession'
        , 'The-Canons-of-Dordt'
        , 'The-Apostles-Creed'
        , 'The-Nicene-Creed'
        , 'The-Athanasian-Creed'
        , 'The-Creed-of-Chalcedon'
        , 'Form-for-the-Administration-of-Baptism'
        , 'Form-for-Public-Confession-of-Faith'
        , 'Form-for-the-Administration-of-the-Lords-Supper'
        , 'Form-for-Excommunication'
        , 'Form-for-Readmitting-Excommunicated-Persons'
        , 'Form-of-Ordination-(or-Installation)-of-Ministers-of-Gods-Word'
        , 'Form-of-Ordination-of-Elders-and-Deacons'
        , 'Form-for-the-Installation-of-Professors-of-Theology'
        , 'Form-for-the-Ordination-(or-Installation)-of-Missionaries'
        , 'Form-for-the-Confirmation-of-Marriage-before-the-Church'
        , 'Formula-of-Subscription-(PRCA)'
        , 'The-Church-Order'
    ],
    creeds_search_file: 'CreedsSearchJSON'
};

const _creeds = (cache = {}) => (state = originalState, action = {}) => {
    if (action.type === CREEDS_ACTIONS.CREEDS_FORMS_LIBRARY_INIT) {
        const {
            documents = {}
        } = action;

        const mapDocToKey = (key) => documents[key];
        const creeds = state.title_order.slice(0, CREEDS_COUNT).map(mapDocToKey);
        const forms = state.title_order.slice(CREEDS_COUNT).map(mapDocToKey);

        const library = [
            creeds,
            forms
        ];

        let initial_state = original_creed_state(library);
        initial_state.library = library;
        initial_state.documents = documents;
        initial_state.creeds_library = library.map(doc => doc.map(get_lib_data))

        return {
            ...state
            , ...initial_state
        };
    }

    if (action.type === CREEDS_ACTIONS.LOCK_IN_CREED) {
        const { library_type_index, selected_index, levels_deep } = action;

        const key = `${library_type_index}${selected_index}`;
        if (cache[key] === undefined) {
            const creed = state.library[library_type_index][selected_index];

            cache[key] = {
                ...get_creed_content_w_header_only(creed),
                library_type_index,
                selected_index
            };
        }
        return {
            ...state,
            creed: cache[key]
        };
    }

    if (action.type === CREEDS_ACTIONS.LOCK_IN_CREED_BODY) {
        const { library_type_index, selected_creed_index, selected_chapter_index, selected_article_index } = action;
        const creed = state.library[library_type_index][selected_creed_index];
        let creed_body;
        if (selected_article_index === undefined || selected_article_index === null) {

            creed_body = {
                title: creed.title || ''
                , description: creed.description || ''
                , body: creed.content[selected_chapter_index]
                , library_type_index
                , selected_creed_index
                , selected_chapter_index
                , selected_article_index
            }
        } else {
            //level 2
            creed_body = {
                title: creed.title || ''
                , description: creed.description || ''
                , body: {
                    ...creed.content[selected_chapter_index]
                    , content: [creed.content[selected_chapter_index].content[selected_article_index]]
                }
                , library_type_index
                , selected_creed_index
                , selected_chapter_index
                , selected_article_index
            }
        }
        return {
            ...state,
            creed_body
        };
    }

    if (action.type === CREEDS_ACTIONS.LOCK_IN_CREED_LEVEL_2) {
        const { library_type_index, selected_creed_index, selected_chapter_index } = action;
        const key = `${library_type_index}${selected_creed_index}${selected_chapter_index}`;
        if (cache[key] == undefined) {
            const creed = state.library[library_type_index][selected_creed_index];
            const chapter_header = creed.content[selected_chapter_index].header;
            const chapter_content = creed.content[selected_chapter_index].content.map(({ content }) => {

                const [header, body, body2] = content
                    .map(text_array => text_array.map(({ text }) => text));

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

            cache[key] = {
                title: chapter_header,
                levels_deep: creed.levels_deep,
                content: chapter_content,
                library_type_index,
                selected_creed_index,
                selected_chapter_index
            };
        }

        return {
            ...state,
            creed_level_2: cache[key]
        };
    }

    return state;
};

export const creeds = _creeds({});


const get_creed_content_w_header_only = (creed) => {
    const header_only_content = creed.content.map(({ header, content }) => {
        const new_content = content.map(({ content }) => {
            return content[0]
                .map(({ text }) => text)
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
