var es = require('event-stream')
  , _ = require('underscore');

exports.parse = function() {
    return es.mapSync(function (raw) {
        var split = raw
            .toString()
            .replace(/\n#[^\n]*\n/g, '\n') // remove # comments
            .split('\n\n');

        return {
            headline: split[0],
            notes: split[1].split('\n'),
            texts: _.map(split.slice(2), function(verse) { return verse.split('\n'); })
        };
    });
};