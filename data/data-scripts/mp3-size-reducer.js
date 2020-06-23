const fs     = require('fs');
const {log}  = console;
const ffmpeg = require('ffmpeg');

const dir = '~/psalter1912-2/Music-Files';
const output_dir = '~/psalter1912-2/Music-Files';

const files_array = fs.readdirSync(dir);
// log(files_array);

//     .forEach(file_name => {
//     fs.rename(`${dir}/${file_name}`, `${dir}/${file_name.replace(/ /g, '-')}`, () => log('done'));
// });

// log(files_array[0]);

const audio_converter_fn = (file) => {
    const process = new ffmpeg(`${dir}/${file}`);
    return process.then(vid => {
        // log(JSON.stringify(vid.metadata, null, 4));
        // log(file);

        const duration = (vid.metadata.duration.seconds >= 100) ? Math.round(vid.metadata.duration.seconds / 3) : vid.metadata.duration.seconds;
        vid.addCommand('-ar', '8000');
        return vid
        // .setDisableVideo()
            .setVideoStartTime(3)
            .setVideoDuration(duration)
            .setAudioChannels(1)
            // .setAudioBitRate(192)
            // .setAudioQuality(192)
            .setAudioCodec('mp3')
            .save(`${output_dir}/${file}`)
            .then((new_file) => log(new_file));

    });
};

Promise.all(files_array.slice(0, 100).map(audio_converter_fn))
    .then(() => {
        return Promise.all(files_array.slice(100, 200).map(audio_converter_fn))
    })
    .then(() => {
        return Promise.all(files_array.slice(200, 300).map(audio_converter_fn))
    })
    .then(() => {
        return Promise.all(files_array.slice(300, 400).map(audio_converter_fn))
    })
    .then(() => {
        return files_array.slice(400).map(audio_converter_fn);
    });






