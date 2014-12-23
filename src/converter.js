var es = require('event-stream')
  , _ = require('underscore')
  , debug = require('debug')('vextab');

/**
 * <p>converts a parsed .staves file like</p>
 * <pre>{
 *   headline: <String>,
 *   notes: [<String>, ...],
 *   texts: [[<String>, ...], ...]
 * }</pre>
 * <p>into a list of .vextab files, e.g.</p>
 * <pre>[
 *   '<options>\n\n<headline>\n<notes-line>\n<text-line>\n\n...',
 *   ...
 * ]</pre>
 * <p>where each .vextab file fits on a single page
 * defined by --width and --height command-line
 * arguments and each entry in the parsed .staves
 * texts creates a new page</p>
 */
exports.toVextabs = function(stavesPerPage) {
    return es.mapSync(function(parsed) {
        var vextabs = _.chain(parsed.texts)
            // => [<text>, ...]
            .map(function(verse) {
                return _.chain(parsed.notes)
                    // => [<notes>, ...]
                    .zip(verse)
                    // => [[<notes>, <text>], ...]
                    .map(createTabstave(parsed.headline))
                    // => [<headline>\n<notes-line>\n<text-line>, ...]
                    .reduce(createSubArrays(stavesPerPage), [[]])
                    // => [[<headline>\n<notes-line>\n<text-line> x stavesPerPage], ...]
                    .map(function(vextabs) { return vextabs.join('\n\n') })
                    // => [<headline>\n<notes-line>\n<text-line>\n\n x stavesPerPage, ...]
                    .value()
            })
            // => [[<headline>\n<notes-line>\n<text-line>\n\n x stavesPerPage, ...], ...]
            .flatten()
            // => [<headline>\n<notes-line>\n<text-line>\n\n x stavesPerPage, ...]
            .map(createPage)
            // => [<options>\n\n<headline>\n<notes-line>\n<text-line>\n\n..., ...]
            .value();
        
        debug(vextabs);
        return vextabs;
    });
};

function createPage(tabstaves) {
    return 'options space=0 stave-distance=40\n\n' + tabstaves;
}

function createSubArrays(length) {
    return function(prev, now) {
        if (prev[prev.length - 1].length < length) {
            prev[prev.length - 1].push(now);
        } else {
            prev.push([now]);
        }
        return prev;
    };
}

function createTabstave(headline) {
    return function(noteVerse) {
        return [
            headline,
            convertNotesLine(noteVerse[0]),
            convertTextLine(noteVerse[1])
        ].join('\n');
    };
}

function convertNotesLine(notes) {
    return 'notes ' + notes;
}

function convertTextLine(text) {
    return 'text ++,.11,.font=Arial-14-normal,' + text;
}