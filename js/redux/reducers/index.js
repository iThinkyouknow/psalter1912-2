import {combineReducers} from 'redux';
import {psalter, psalters_count} from './psalter';
// import {psalter_text_input, valid_text_input, music_timer, text_input_as_search} from './state';


const rootReducer = combineReducers({
    psalter,
    psalters_count,
    // psalter_text_input,
    // valid_text_input,
    // music_timer,
    // text_input_as_search,
    ...require('./state'),
    ...require('./search'),
    ...require('./creeds-and-forms')
});

export default rootReducer;