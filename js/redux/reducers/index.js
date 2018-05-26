import {combineReducers} from 'redux';
// import {psalter_text_input, valid_text_input, music_timer, text_input_as_search} from './state';


const rootReducer = combineReducers({
    ...require('./psalter')
    // psalter_text_input
    // valid_text_input
    // music_timer
    // text_input_as_search
    , ...require('./state')
    , ...require('./search')
    , ...require('./creeds-and-forms')
    , ...require('./bible')
    , ...require('./tab-bar')
    , ...require('./statistics')
});

export default rootReducer;