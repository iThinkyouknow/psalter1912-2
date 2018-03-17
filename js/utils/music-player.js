import {
    Player,
    Recorder,
    MediaStates
} from 'react-native-audio-toolkit';

import {
    set_max_music_timer,
    set_music_timer
} from '../redux/actions/state-actions';

const _music_player_fn = (Player) => {
    // state machine
    let current_music_file_name = '';
    let music_player;
    let interval = 0;

    //helper fn
    const create_new_player = (Player_class) => (new_file_name) => {
        const new_music_player = new Player_class(new_file_name);
        new_music_player.looping = true;

        return new_music_player;
    };

    const reset_timer = (dispatch) => (_interval) => {
        clearInterval(_interval);
        dispatch(set_music_timer(0));
    };

    const play_callback = (dispatch) => (play_time) => () => {
        dispatch(set_max_music_timer(music_player.duration));
        music_player.seek(play_time);
        interval = setInterval(() => {
            dispatch(set_music_timer(music_player.currentTime));
            if (music_player.currentTime >= music_player.duration || music_player.currentTime === -1) {
                clearInterval(interval);
            }
        }, 1000);
    };

    // play
    const play = (dispatch) => (music_file_name) => (current_time) => () => {
        clearInterval(interval);
        if (music_player) music_player.stop();
        if (music_file_name !== current_music_file_name) {
            current_music_file_name = music_file_name;
            reset_timer(dispatch)(interval);
        }
        music_player = create_new_player(Player)(current_music_file_name);
        const actual_current_time = (current_time < 0) ? 0 : current_time;
        music_player.play(play_callback(dispatch)(actual_current_time));
    };

    // in render function
    const when_psalter_change = (dispatch) => (file_name) => {
        if (file_name !== current_music_file_name) {
            current_music_file_name = file_name;
            reset_timer(dispatch)(interval);

            if (music_player && music_player.isPlaying) {
                play(dispatch)(current_music_file_name)(0)();

            } else {
                if (music_player) {
                    music_player.stop();
                }
                music_player = create_new_player(Player)(current_music_file_name);
                music_player.volume = 0;
                music_player.play(() => {
                    dispatch(set_max_music_timer(music_player.duration));
                    music_player.stop();
                });
            }
        }
    };

    // pause
    const pause_or_stop = (dispatch) => () => {
        if (music_player) {
            if (music_player.isPlaying) { //pause
                clearInterval(interval);
                dispatch(set_music_timer(music_player.currentTime));
                music_player.stop();
                music_player = undefined;
            }
        } else if (!music_player) { //stop
            music_player = undefined;
            reset_timer(dispatch)(interval);
        }
    };
    // slide
    const change_timing = (dispatch) => (new_time) => {
        clearInterval(interval);
        dispatch(set_music_timer(new_time));
        if (music_player && music_player.isPlaying) {
            music_player.stop();
            play(dispatch)(current_music_file_name)(new_time)();
        }
    };

    const stopTimer = () => {
        clearInterval(interval);
    };

    //return
    return {
        when_psalter_change,
        play,
        pause_or_stop,
        change_timing,
        stopTimer
    };
};

const play_music = _music_player_fn(Player);

export default play_music;