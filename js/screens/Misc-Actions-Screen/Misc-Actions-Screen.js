import React, { useEffect } from 'react';
import {
    View
    , TextInput
    , Share
    , Dimensions
    , ScrollView
    , TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import Clipboard from "@react-native-clipboard/clipboard";
import _ from 'lodash';

import {
    set_copy_text
} from '../../redux/actions/copy-actions';

import {
    set_misc_actions_text_input_pointer_events
} from '../../redux/actions/state-actions';

import Default_Bg from '../../common/Default-bg';
import { font_sizes, padding_top_style_android, user_font_color, user_tint_color } from '../../common/common.styles';
import { Rounded_Button } from '../../common/Rounded-Button';
import psalter_styles from '../Psalter/index.styles';
import styles from './Misc-Actions-Screen.styles';
import {
    Default_Text
    , format_psalter_texts
    , format_creeds_text
    , format_bible_text
} from '../../common/Text';

import { 
    composer
    , no_op
} from '../../utils/functions';
import { Navigation } from 'react-native-navigation';

const url = 'https://psalterapp.weebly.com'

export const MISC_ACTION_TEXT_TYPES = {
    PSALTER: 'PSALTER'
    , CREEDS: 'CREEDS'
    , BIBLE: 'BIBLE'
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

const set_misc_actions_text_input_pointer_events_action = (dispatch) => (pointer_events) => {
    composer([
        set_misc_actions_text_input_pointer_events,
        dispatch
    ])(pointer_events)
};

const copy_to_clipboard = (string) => () => {
    Clipboard.setString(string);
};

const share_fn = (share_obj) => () => {
    try {
        Share.share(share_obj, share_obj);
    } catch (error) {
        console.log(err)
    }
};


const onNavigatorEvent = (Navigation) => ({buttonId, componentId}) => {
    if (buttonId === 'close') {
        Navigation.dismissModal(componentId);
    }
};

let text_input_ref = {};

const add_credits_to_text = (text) => {
    return (
`${text}

💫 The Psalter App 1912
${url}`
    );
    
}

const MiscActions = (props) => {
    const {
        text_font_size
        , text_to_be_copied
        , type
        , text_input_pointer_events
        , dispatch
        , user_settings
    } = props;

    const formatter = formatters[type] || no_op;
    const { text = '', share_subject = '' } = formatter(props) || {};
    
    const set_copy_text_action_loaded = set_copy_text_action(dispatch);
    const set_misc_actions_text_input_pointer_events_action_loaded = set_misc_actions_text_input_pointer_events_action(dispatch);

    useEffect(() => {   
        set_copy_text_action_loaded(text);
    }, []);
    
    useEffect(() => {
        Navigation.events().registerNavigationButtonPressedListener(onNavigatorEvent(Navigation));
    }, []);

    const dimensions = Dimensions.get('window');
    
    const text_for_share_copy = add_credits_to_text(text_to_be_copied);

    const share_obj = {
        subject: share_subject,
        title: share_subject,
        dialogTitle: share_subject,
        message: text_for_share_copy,
        url
    };

    const color_style = user_font_color(user_settings);
    const color_tint_style = {color: user_tint_color(user_settings)};

    return (
        <Default_Bg style={{paddingBottom: 0}} user_settings={props.user_settings}>
            <ScrollView scrollEnabled={text_input_pointer_events === 'none'} style={{flex: 1, paddingTop: padding_top_style_android}}>
                <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => {
                        set_misc_actions_text_input_pointer_events_action_loaded('auto');
                        text_input_ref.focus();
                    }}>

                    <TextInput style={[styles.text_input, color_style, { fontSize: text_font_size}]}
                        ref={ref => text_input_ref = ref}
                        pointerEvents={text_input_pointer_events}
                        underlineColorAndroid={'transparent'}
                        textAlignVertical={'top'}
                        multiline={true}
                        selectable={true}
                        editable={true}
                        value={text_to_be_copied}
                        onChangeText={(text) => {
                            set_copy_text_action_loaded(text);
                        }}
                        onBlur={() => {
                            set_misc_actions_text_input_pointer_events_action_loaded();
                        }}
                    >
                    </TextInput>

                </TouchableOpacity>
            </ScrollView>
            
            
            
            <View style={styles.pro_tip_container}>
                <Default_Text style={color_style} font_size={font_sizes.small} text_align='center'>
                    {`Pro Tip: You may also edit, share, etc. directly by selecting the text above`}
                </Default_Text>
            </View>
            
            <View style={[psalter_styles.more_stuff_bottom_buttons_container, styles.bottom_buttons_container_extra]}>
                <Rounded_Button user_settings={user_settings} on_press={copy_to_clipboard(text_for_share_copy)} screen_width={dimensions.width}>
                    <Default_Text style={color_tint_style} text_align={'center'}>Copy</Default_Text>
                </Rounded_Button>
                <Rounded_Button user_settings={user_settings} on_press={share_fn(share_obj)} screen_width={dimensions.width}>
                    <Default_Text style={color_tint_style} text_align={'center'}>Share</Default_Text>
                </Rounded_Button>
            </View>
            
        </Default_Bg>
    )
};


function mapStateToProps(state) {
    const creed_body = _.get(state, 'creeds.creed_body') || {};
    return {
        psalter: state.psalter.content
        , text_font_size: state.text_font_size
        , user_settings: state.user_settings
        , text_to_be_copied: state.text_to_be_copied
        , creed_body_title: creed_body.title || ''
        , creed_body_description: creed_body.description || ''
        , creed_body: creed_body.body || {}
        , bible_passage: state.bible.bible_passage
        , text_input_pointer_events: state.misc_actions_text_input_pointer_events
    }
}

export default connect(mapStateToProps, null)(MiscActions);

