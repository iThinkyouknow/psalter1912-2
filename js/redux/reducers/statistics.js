import {STATISTICS_ACTIONS} from '../actions/statistics-actions';
import moment from 'moment'

export const statistics_sung_psalter_date_details = (state = {}, action) => {
    if (action.type === STATISTICS_ACTIONS.SET_SUNG_PSALTER_DETAILS) {

        return {
            psalter_title: action.psalter_title
            , dates_array: action.sung_dates_array
                .map((date) => {
                    return {
                        date_time: moment(date).format('D MMM \'YY h:mm:ss A')
                        , ago: moment(date).fromNow()
                    }
                })
        };
    }

    

    return state;
};

export const neglected_texts = (state = {}, action = {}) => {
    if (action.type === STATISTICS_ACTIONS.NEGLECTED_TEXTS_INIT) {
        return {
            ...state,
            neglected_texts: action.neglected_texts
        }
    }

    if (action.type === STATISTICS_ACTIONS.NEGLECTED_ALERT_TEXTS_INIT) {
        return {
            ...state,
            neglected_alert_texts: action.neglected_alert_texts
        }
    }

    return state;
};
