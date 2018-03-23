import {
    Alert
} from 'react-native';

export const string_input_error_alert = (on_apology) => {
    const emojis = [`😳`, `🤔`, `😖`, `😑`, `😩`];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    Alert.alert(
        `Are you sure about this? ${emoji}`,
        `Ummm... I don't think you wanna be keying in "four hundred and five" \
                How about keying in numbers instead?`,
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
        `Come On! \ 
            Don't you know that there are only Psalters 1 - ${max_val} available? \
            Apologize Now! 😡`,
        [
            {
                text: `I'm Sorry! 😳`,
                onPress: on_apology,
                style: 'cancel'
            }
        ],
        { cancelable: true }
    )
};

export const not_enough_characters_search_alert = (min_length) => {
    Alert.alert(
        `Too Many Search Results`,
        `Come On! \ 
Don't waste my time producing unfruitful search results! \ 
Search with at least ${min_length} characters & \ 
Apologize Now! 😡`,
        [
            {
                text: `I'm Sorry! 😳`,
                onPress: () => {}, style: 'cancel'
            }
        ],
        { cancelable: true }
    )
};
