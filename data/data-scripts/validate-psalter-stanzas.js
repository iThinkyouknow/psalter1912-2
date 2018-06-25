const fs = require('fs');

const psalterArray = require('../PsalterJSON.json');

const problemPsalters = psalterArray
    .map(({content}, j) => {
        const problemStanza = content
            .map((stanzasArray) => stanzasArray.length)
            .reduce((acc, linesCount, index, array) => {
                const validCount = array[0];
                if (linesCount !== validCount) {
                    return {
                        problem: true,
                        stanza: index + 1
                        , psalter: j + 1
                    }
                }
                return acc;
            }, {problem: false, index: NaN, psalter: NaN});



        console.dir(problemStanza, {colors: true});

        return problemStanza;
    })
    .filter((problemObj) => problemObj.problem === true);


console.dir(problemPsalters);