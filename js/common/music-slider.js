import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    FlatList,
    Animated,
    Slider,
    TouchableHighlight,
    Image,
StyleSheet
} from 'react-native';

// import styles from './music-slider.styles';
import {
    colors,
    sizes,
    font_sizes,
    zIndex,
    native_elements,
    buttons
} from './common.styles';

import {
    Default_Text,
    Animated_Text,
    main_title
} from './Text';

import Default_bg from './Default-bg';

import music_player from '../utils/music-player'

const styles = StyleSheet.create({
    music_slider_container: {
        marginHorizontal: sizes.large,
        flexDirection: 'row',
        alignItems: 'center'
    },
    music_slider: {
        flex: 1,
        marginLeft: sizes.default
    },
    pause_button_container: {
        width: sizes.x_large,
        height: sizes.x_large,
        justifyContent: 'center'
    },
    play_button_container: {
        marginLeft: sizes.medium,
        width: sizes.x_large,
        height: sizes.x_large,
        justifyContent: 'center'
    },
    play_button: {
        width: buttons.medium,
        height: buttons.medium
    },
    button_std: {
        width: buttons.default,
        height: buttons.default
    }
});



export default music_slider = (dispatch) => (current_music_timer) => (max_music_timer) => ({item, index}) => {
    if (!Array.isArray(item.sources)) return null;
    if ((typeof item.sources[0] !== 'string') || item.sources[0].length < 1) return null;

    const music_slider_array = item.sources.map((file_name, j) => {
        const time = (time_in_ms) => {
            if (time_in_ms === undefined || time_in_ms === null || isNaN(time_in_ms) || time_in_ms === -1) return `00:00`;
            const date = new Date (time_in_ms);
            const minutes = (`${date.getUTCMinutes()}`.length === 2) ? `${date.getUTCMinutes()}` : `0${date.getUTCMinutes()}`;
            const seconds = (`${date.getUTCSeconds()}`.length === 2) ? `${date.getUTCSeconds()}` : `0${date.getUTCSeconds()}`;
            return `${minutes}:${seconds}`;
        };

        const value_change = (should_stop_timer) => () => {
            if (should_stop_timer) {
                music_player.stopTimer();
                should_stop_timer = false;
            }
        };

        return (
            <View key={`music-player-${file_name}-${j}`} style={styles.music_slider_container}>

                <Default_Text>
                    {time(current_music_timer)}
                </Default_Text>
                <Slider style={styles.music_slider}
                        key={`${file_name}-${index}`}
                        step={Math.floor(max_music_timer / 1000)}
                        maximumValue={max_music_timer}
                        value={current_music_timer}
                        onValueChange={value_change(true)}
                        onSlidingComplete={(play_at_time) => {
                            music_player.change_timing(dispatch)(play_at_time);
                        }} />
                <Default_Text style={{marginLeft: sizes.default}}>
                    {time(max_music_timer)}
                </Default_Text>

                <TouchableHighlight style={styles.play_button_container}
                                    onPress={music_player.play(dispatch)(file_name)(current_music_timer)}>
                    <Image style={styles.play_button}
                           source={require('../../images/icons/icon-play.png')} />
                </TouchableHighlight>
                <TouchableHighlight style={styles.pause_button_container}
                                    onPress={music_player.pause_or_stop(dispatch)}>
                    <Image style={styles.button_std}
                           source={require('../../images/icons/icons-pause.png')} />
                </TouchableHighlight>
            </View>
        );
    });

    return (max_music_timer > 0)
        ? (
            <View >
                {main_title(1)(item.title)}
                {music_slider_array}
            </View>
        )
        : null;
};


