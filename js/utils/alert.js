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

export const wrong_number_error_alert = (max_val) => (on_apology) => {
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
From now on, tap on the white text input directly to go to a certain Psalter #.
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

export const neglected_alert = (random) => (on_yes) => (on_no) => (index) => () => {
    const texts = [
        [
            `Sorely Neglected`
            , `Your neglect is disappointing
Sing me now!`
        ]
        , [
            `Conveniently Neglected`
            , `It must have been really easy...
Sing me now!`
        ]
        , [
            `Conveniently Neglected`
            , `Have you ever wonder how I felt?
Sing me now!`
        ]
        , [
            `Wow!`
            , `I am amazed at how you never realize that I am always by your side
Sing me now!`
        ]
        , [
            `Thoughts...`
            , `of me springing up in your mind every hour
is what I wish you would do
Sing me now!`
        ]
        , [
            `Can you believe`
            , `that you don't even know me?
Sing me now!`
        ]
        , [
            `Best friends`
            , `We could be best friends
Sing me now!`
        ]
        , [
            `Come On!`
            , `Sing me now!`
        ]
        , [
            `Senpai noticed me!`
            , `Sing me now!`
        ]
    ];

    const magic_number = Math.floor(random() * texts.length);

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
