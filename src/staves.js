process.env.PWD = require('phantomjs').path;

function parseStavesContent(raw) {
  var split = raw
    .replace(/\n#[^\n]*\n/g, '\n') // remove # comments
    .split('\n\n');
  
  return {
    headline: split[0],
    notes: split[1].split('\n'),
    texts: _.map(split.slice(2), function(verse) { return verse.split('\n'); })
  }
}

function createVextabs(parsed, stavesPerVextab) {
  return _.map(subarraysOfLength(_.flatten(_.map(parsed.texts, function(verse) {
      return _.map(_.zip(parsed.notes, verse), function(noteVerse) {
        return [
          parsed.headline,
          'notes ' + noteVerse[0],
          'text ++,.11,.font=Arial-14-normal,' + noteVerse[1]
        ].join('\n');
      });
    })), stavesPerVextab), function(page) {
    return 'options space=0 stave-distance=40\n\n' + page.join('\n\n');
  });
}

function subarraysOfLength(array, length) {
  var subarrays = [[]];
  for (var i = 0; i < array.length; i++) {
    if (subarrays[subarrays.length - 1].length < length) {
      subarrays[subarrays.length - 1].push(array[i]);
    } else {
      subarrays.push([array[i]]);
    }
  }
  return subarrays;
}

function createHtmlForVextab(vextab, scripts) {
  return '<html>' + 
    '<head>' + _.map(scripts, function(script) { return '<script>' + script + '</script>'; }).join('') + '</head>' + 
    '<body style="-webkit-filter: invert(100%)"><div class="vex-tabdiv" width=680 scale=1.0 editor=false>' + vextab + '</div></body>' + 
    '</html>';
}

var fs = require('fs')
  , _ = require('underscore')
  , _s = require('underscore.string')
  , htmlpdf = require('html-pdf')

  , vextabDivJs = fs.readFileSync(__dirname + '/../node_modules/vextab/releases/vextab-div.js')
  , raphaelJs = fs.readFileSync(__dirname + '/../node_modules/raphael/raphael-min.js');

module.exports = function(program) {
  var infile = program.I
    , outfile = program.O
    , transpose = program.T
    , width = program.W
    , height = program.H;
  
  fs.readFile(infile, function(err, buff) {
    var content = parseStavesContent(buff.toString())
      , vextabs = createVextabs(content, Math.floor(height / 250));
    
    _.each(vextabs, function(vextab, index) {
      htmlpdf.create(createHtmlForVextab(vextab, [raphaelJs, vextabDivJs]), {
        width: width + 'px',
        height: height + 'px',
        filename: outfile.replace('.pdf', '-' + (index + 1) + '.pdf')
      }, function(err, buffer) {});
    });
  });
};