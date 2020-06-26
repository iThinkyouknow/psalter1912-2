import {PSALTER_PDF_ACTIONS} from '../actions/psalter-pdf-actions';

import {Platform} from 'react-native';


const _psalter_pdf_file_source = (state = "", action) => {
    if (action.type === PSALTER_PDF_ACTIONS.SET_FILE_SOURCE_INIT) {
        return { uri: "bundle-assets://The_Psalter_PDF.pdf" };
    }

    return state;
};

export const psalter_pdf_file_source = _psalter_pdf_file_source;
