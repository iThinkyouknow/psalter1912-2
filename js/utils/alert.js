import {
    Alert
} from 'react-native';

export const string_input_error_alert = (on_apology) => {
    const emojis = [`😳`, `🤔`, `😖`, `😑`, `😩`];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    Alert.alert(
        `Are you sure about this? ${emoji}`,
        `Ummm... I don't think you wanna be keying in "four hundred and five"
How about numbers instead?`,
        [
            {
                text: `Yea, you are right... 😳`,
                onPress: on_apology, style: 'cancel'
            }
        ],
        { cancelable: true }
    )
};

export const wrong_number_error_alert = (max_val, on_apology) => {
    Alert.alert(
        `Psalter Not Available`,
        `Come On!
Don't you know that there are only Psalters 1 - ${max_val} available?
Apologize Now! 😡`,
        [
            {
                text: `I'm Sorry! 😳`,
                onPress: on_apology,
                style: 'cancel'
            }
        ],
        { cancelable: true }
    );
};

export const perhaps_change_to_psalter_input_alert = (psalter_num) => {
    Alert.alert(
        `Perhaps...`,
        `What you want is to sing psalter ${psalter_num}.
Tap on the magnifying glass again and tap on the white space that says Psalter #.
The magnifying glass is for searching keywords.
From now on, tap on the white text input directly to go to a certain
Psalter #.
You're welcome!`,
        [
            {
                text: `Thank you! That makes so much sense!`,
                onPress: () => {}, style: 'cancel'
            }
        ],
        { cancelable: true }
    );
};

export const not_enough_characters_search_alert = (min_length) => {
    Alert.alert(
        `Too Many Search Results`,
        `Come On!
Don't waste my time producing unfruitful search results!
Search with at least ${min_length} characters &
Apologize Now! 😡`,
        [
            {
                text: `I'm Sorry! 😳`,
                onPress: () => {}, style: 'cancel'
            }
        ],
        { cancelable: true }
    );
};

export const neglected_alert = (texts, on_yes, on_no) => (index) => () => {

    const magic_number = Math.floor(Math.random() * texts.length);

    const text_array = texts[magic_number];

    Alert.alert(
        text_array[0]
        , text_array[1]
        , [
            {
                text: 'Not Yet...'
                , onPress: on_no
            }
            , {
                text: 'Right Away!'
                , onPress: on_yes(index)
            }
        ]
        , { cancelable: true }
    );
};

export const new_over_the_air_update_alert = (on_yes) => {
    Alert.alert(
        `Look, I can touch the Cloud!`
        , `I have a new function! Ask me about it. Yes! I can now fetch the latest data from the internet. That means that you'd have lesser opportunities to be embarrassed by wrong lyrics. If you do not wish for me to check for updates, stop me by going to your phone settings and disabling data or wifi or internet or something.`
        , [
            {
                text: 'Okay fine... whatever I guess...'
                , onPress: on_yes
            }
            , {
                text: 'YES PLEASE!!! I have been waiting!'
                , onPress: on_yes
            }
        ]
    )
};

export const new_data_present_alert = (on_yes) => (num_of_outdated_files = 0) => {
    Alert.alert(
        `Outdated files`
        , `Uh oh, you have some serious problems. You have ${num_of_outdated_files} outdated files that will do neither you nor your dog no good! Words that are wrong are here, there, everywhere! Update those files now!`
        , [
            {
                text: 'Not now'
            },
            {
                text: 'Yes Please!'
                , onPress: on_yes
            }
        ]
    )
};
