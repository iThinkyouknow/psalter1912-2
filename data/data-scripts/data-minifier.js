const fs = require('fs');

const fileNames = fs
    .readdirSync(`${__dirname}/../`)
    .filter((fileName) => /\.json$/i.test(fileName));



const apply = (val, fn) => fn(val);

const compose = (fns) => (val) => fns.reduce(apply, val);

const getFile = (fileName) => ({obj: require(`../${fileName}`), fileName});
const stringify = (indent) => ({obj, fileName}) => ({str: JSON.stringify(obj, null, indent), fileName});
const writeToFile = ({str, fileName}) => fs.writeFileSync(`${__dirname}/../${fileName}`, str);

const trace = (obj) => console.dir(obj, {colors: true, depth: null});

trace(fileNames);

const minify = (fileNames) => fileNames
    .map(compose([
        getFile
        , stringify()
        , writeToFile
    ]));

const deminify = (fileNames) => fileNames
    .map(compose([
        getFile,
        stringify(4)
        , writeToFile
    ]));


minify(fileNames);
// deminify(fileNames.slice(1, 2));



