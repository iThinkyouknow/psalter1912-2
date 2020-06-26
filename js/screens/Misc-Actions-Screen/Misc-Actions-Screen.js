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
import styles from './Misc-Actions-Screen.styles';
import {
    Default_Text
} from '../../common/Text';
import { 
    is_array
    , is_function
    , is_string
    , composer
    , no_op
    , getty
} from '../../utils/functions';

export const MISC_ACTION_TEXT_TYPES = {
    PSALTER: 'PSALTER'
    , CREEDS: 'CREEDS'
    , BIBLE: 'BIBLE'
};

const format_psalter_no = (no) => {
    return `Psalter ${no}`;
}
const format_text = (formatted_no, title, content, psalm, meter) => {
    const joinedContent = content.map((para) => {
        return para.join('\n')
    }).join('\n\n');
    return [formatted_no, `${title}`, `Psalm ${psalm}`, `Meter: ${meter}\n`, joinedContent].join('\n') 
};

const format_psalter_texts = ({psalter}) => {
    const { title, content, psalm, meter, no } = psalter;
    const formatted_psalter_no = format_psalter_no(no);
    const text = is_array(content) ? format_text(formatted_psalter_no, title, content, psalm, meter) : '';
    const share_subject = `${formatted_psalter_no} - ${title}`;

    return {
        text, share_subject
    };
};

const format_creeds_text = ({
    creed_body_title
    , creed_body_description
    , creed_body
}) => {

    const {header, content}  = creed_body;

    const content_text = content.map(({content}) => {
        let to_format_content = getty(content)('0.0.text')('') === header
            ? content.slice(1)
            : content;

        const content_text = to_format_content
            .map((para) => {
                return para
                    .filter(({ is_superscript }) => is_superscript !== true)
                    .map(({ text }) => text)
                    .join(' ');
            }).join('\n\n');

        return content_text;
    }).join('\n\n\n');

    

    const text = [
        (creed_body_title !== header) ? creed_body_title : ""
        , creed_body_description
        , `${header}\n`
        , content_text
    ]
        .filter(text => is_string(text))
        .join('\n').trim();

    const share_subject = `${creed_body_title} - ${header}`;

    return {
        text, share_subject
    };
};

const format_bible_text = (props) => {
    const { bible_passage } = props;
    const {title, content} = bible_passage;

    const body_content = content
        .slice(1)
        .map((texts, verseIndex) => {
            return texts
                .filter(({ is_footnote }) => is_footnote !== true)
                .map(({ text }, textIndex) => {
                    return textIndex === 0
                        ? `${verseIndex + 1}. ${text}`
                        : text
                })
                .join(' ');
        })
        .join('\n\n');
    
    const text = [
        title,
        body_content
    ].join('\n\n');

    return {text, share_subject: title};
};

const formatters = {
    [MISC_ACTION_TEXT_TYPES.PSALTER]: format_psalter_texts
    , [MISC_ACTION_TEXT_TYPES.CREEDS]: format_creeds_text
    , [MISC_ACTION_TEXT_TYPES.BIBLE]: format_bible_text
}

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
        , text_to_be_copied
        , type
        , dispatch
    } = props;

    const formatter = formatters[type] || no_op;
    const { text = '', share_subject = '' } = formatter(props) || {};
    
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
            <TextInput style={[styles.text_input, { fontSize: text_font_size}]}
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
            <View style={styles.pro_tip_container}>
                <Default_Text text_align='center'>
                    {`Pro Tip: You may also edit, share, etc. directly by selecting the text above`}
                </Default_Text>
            </View>
            
            <View style={[psalter_styles.more_stuff_bottom_buttons_container, styles.bottom_buttons_container_extra]}>
                {Rounded_Button(<Default_Text text_align={'center'}>Copy</Default_Text>)(copy_to_clipboard(text_to_be_copied))(dimensions.width)}
                {Rounded_Button(<Default_Text text_align={'center'}>Share</Default_Text>)(share_fn(share_obj))(dimensions.width)}
            </View>
            
        </Default_Bg>
    )
};


function mapStateToProps(state) {
    return {
        psalter: state.psalter.content
        , text_font_size: state.text_font_size
        , text_to_be_copied: state.text_to_be_copied
        , creed_body_title: state.creed_body.title
        , creed_body_description: state.creed_body.description
        , creed_body: state.creed_body.body
        , bible_passage: state.bible.bible_passage
    }
}

export default connect(mapStateToProps, null)(MiscActions);

