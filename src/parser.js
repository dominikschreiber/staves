var es = require('event-stream')
  , _ = require('underscore')
  , debug = require('debug')('parsed');

exports.parse = function() {
    return es.mapSync(function (raw) {
        var split = raw
            .toString()
            .replace(/\n#[^\n]*\n/g, '\n') // remove # comments
            .split('\n\n')
        
          , parsed = {
                headline: split[0],
                notes: split[1].split('\n'),
                texts: _.map(split.slice(2), function(verse) {
                    return verse
                        .replace(/ /g, ',')
                        .split('\n');
                })
            };
        
        debug(parsed);
        return parsed;
    });
};