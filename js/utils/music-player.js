import {
    set_max_music_timer,
    set_music_timer
} from '../redux/actions/state-actions';

const _music_player_fn = () => {
    const Player = require('react-native-sound-player').default;
    Player.addEventListener('FinishedLoading', params => {
        console.log({params}, 'finishedLoading');
    });

    let current_music_file_name = '';
    let interval = 0;
    let isPlaying = false;
    
    const updateTimer = (dispatch) => () => {
        interval = setInterval(() => {
            Player.getInfo()
                .then((info) => {
                    if (!info) return;
                    dispatch(set_music_timer(info.currentTime));

                    if (info.currentTime >= info.duration || info.currentTime < 0) {
                        clearInterval(interval);
                    }
                        
                    })
                .catch(err => {
                    console.error("music player play: ", err);
                });
        }, 1000);
        
    };
    
    const play = (dispatch) => () => {
        if (isPlaying) return;
        Player.play();
        isPlaying = true;
        updateTimer(dispatch)();
    };
    
    // in render function
    const when_psalter_change = (dispatch, file_name) => () => {
        if (file_name !== current_music_file_name) {
            current_music_file_name = file_name;
            const [name, type] = file_name.split('.');
            Player.stop();
            Player.loadSoundFile(name, type);
            stopTimer()
            seek(dispatch, 0);
            Player.setNumberOfLoops(-1);
            Player.getInfo().then((info) => {
                if (info) {
                    dispatch(set_max_music_timer(info.duration));
                }
            })
            .catch((err) => {
                console.log(err);
            });
            if (isPlaying) {
                isPlaying = false;
                play(dispatch)();
            }
        }
    };
    
    const pause = ()  => {
        Player.pause();
        clearInterval(interval);
        isPlaying = false;
    }

    const seek = (dispatch, new_time) => {
        Player.seek(new_time);
        dispatch(set_music_timer(new_time));
    }
    
    // pause
    const pause_or_stop = (dispatch) => () => {
        if (!isPlaying) {    
            seek(dispatch, 0);
        }
        pause();

        
    };
    // slide
    const change_timing = (dispatch, new_time) => {
        seek(dispatch, new_time);
        if (isPlaying) {
            updateTimer(dispatch)();
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

const play_music = _music_player_fn();

export default play_music;