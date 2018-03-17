const fs = require('fs');
const {log} = console;

fs.readFile('/Users/notforyoutouse/Dropbox/iOS\ App\ dev/Test2/Test2/Music\ Files/Psalter\ 2.mp3', (err, data) => {
    log(data);
});



