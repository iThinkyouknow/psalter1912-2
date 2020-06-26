import React, { Component, useEffect } from 'react';
import {
    View
    , TextInput
    , Share
    , Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import Clipboard from "@react-native-community/clipboard";

import {
    set_copy_text
} from '../../redux/actions/copy-actions';

import Default_Bg from '../../common/Default-bg';
import { sizes, colors } from '../../common/common.styles';
import { Rounded_Button } from '../../common/Rounded-Button';
import psalter_styles from '../Psalter/index.styles';
import {
    Default_Text
} from '../../common/Text';
import { is_array, composer } from '../../utils/functions';

const format_psalter_no = (no) => {
    return `Psalter ${no}`;
}
const format_text = (formatted_no, title, content, psalm, meter) => {
    const joinedContent = content.map((para) => {
        return para.join('\n')
    }).join('\n\n');
    return [formatted_no, `${title}`, `Psalm ${psalm}`, `Meter: ${meter}\n`, joinedContent].join('\n') 
};

const get_psalter_texts = (psalter_obj) => {
    const { title, content, psalm, meter, no } = psalter_obj;
    const formatted_psalter_no = format_psalter_no(no);
    const text = is_array(content) ? format_text(formatted_psalter_no, title, content, psalm, meter) : '';
    const share_subject = `${formatted_psalter_no} - ${title}`;

    return {
        text, share_subject
    };
};

const set_copy_text_action = (dispatch) => (copy_text) => {
    composer([
        set_copy_text,
        dispatch
    ])(copy_text)
};

const copy_to_clipboard = (string) => () => {
    Clipboard.setString(string);
};

const share_fn = (share_obj) => () => {
    try {
        Share.share(share_obj);
    } catch (error) {
        console.log(err)
    }
};


const onNavigatorEvent = (navigator) => (e) => {
    if (e.id === 'close') {
        navigator.dismissModal();
    }
};

const MiscActions = (props) => {
    const {
        text_font_size
        , navigator
        , psalter
        , text_to_be_copied
        , dispatch
    } = props;

    const { type } = navigator;

    const { text, share_subject } = get_psalter_texts(psalter);
    const set_copy_text_action_loaded = set_copy_text_action(dispatch);
    useEffect(() => {   
        set_copy_text_action_loaded(text);
    }, []);
    
    useEffect(() => {
        navigator.setOnNavigatorEvent(onNavigatorEvent(navigator));
    }, []);

    const dimensions = Dimensions.get('window');
    
    const share_obj = {
        subject: share_subject,
        title: share_subject,
        dialogTitle: share_subject,
        message: text_to_be_copied
    };
    
    return (
        <Default_Bg>
            <TextInput style={{
                    flex: 1,
                    padding: sizes.large,
                    color: colors.white,
                    fontSize: text_font_size
            }}
            textAlignVertical={'top'}
            multiline={true}
            selectable={true}
            editable={true}
            value={text_to_be_copied}
            onChangeText={(text) => {
                set_copy_text_action_loaded(text);
            }}
            >
            </TextInput>
            <View style={[
                psalter_styles.more_stuff_bottom_buttons_container, 
                { justifyContent: 'space-evenly', marginBottom: sizes.x_large }
            ]}>
                {Rounded_Button(<Default_Text text_align={'center'}>Copy</Default_Text>)(copy_to_clipboard(text_to_be_copied))(dimensions.width)}
                {Rounded_Button(<Default_Text text_align={'center'}>Share</Default_Text>)(share_fn(share_obj))(dimensions.width)}
            </View>
            
        </Default_Bg>
    )
};


function mapStateToProps(state) {
    return {
        psalter: state.psalter.content,
        text_font_size: state.text_font_size,
        text_to_be_copied: state.text_to_be_copied
    }
}

export default connect(mapStateToProps, null)(MiscActions);

export const MISC_ACTION_TEXT_TYPES = {
    PSALTER: 'PSALTER'
    , CREEDS: 'CREEDS'
    , BIBLE: 'BIBLE'
};