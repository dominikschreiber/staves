var es = require('event-stream')
  , _ = require('underscore');

exports.toVextabs = function(stavesPerPage) {
    return es.mapSync(function(parsed) {
        return _.map(subarraysOfLength(_.flatten(_.map(parsed.texts, function(verse) {
            return _.map(_.zip(parsed.notes, verse), function(noteVerse) {
                return [
                    parsed.headline,
                    'notes ' + noteVerse[0],
                    'text ++,.11,.font=Arial-14-normal,' + noteVerse[1]
                ].join('\n');
            });
        })), stavesPerPage), function(page) {
            return 'options space=0 stave-distance=40\n\n' + page.join('\n\n');
        });
    });
};


function subarraysOfLength(array, length) {
    var subarrays = [[]]
      , i;
    
    for (i = 0; i < array.length; i++) {
        if (subarrays[subarrays.length - 1].length < length) {
            subarrays[subarrays.length - 1].push(array[i]);
        } else {
            subarrays.push([array[i]]);
        }
    }
    
    return subarrays;
}