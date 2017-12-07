import {combineReducers} from 'redux';
import {psalter, psalters_count} from './psalter';
import {psalter_text_input} from './state';


const rootReducer = combineReducers({
    psalter,
    psalters_count,
    psalter_text_input
});

export default rootReducer;