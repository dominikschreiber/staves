function parseStavesContent(raw) {
  var split = raw.split('\n\n')
  
  return {
    headline: split[0],
    notes: split[1].split('\n'),
    text: _.map(split.slice(2), function(verse) { return verse.split('\n'); })
  }
}

function createVextab(parsed) {
  return 'options space=0 stave-distance=40\n\n' +
    _.map(parsed.text, function(verse) {
      return _.map(_.zip(parsed.notes, verse), function(noteVerse) {
        return [
          parsed.headline,
          'notes ' + noteVerse[0],
          'text ++,.11,.font=Arial-14-normal,' + noteVerse[1]
        ].join('\n');
      }).join('\n\n');
    }).join('\n\n');
}

function createHtmlForVextab(vextab, vextabDivJs) {
  return '<html>' + 
    '<head><script>' + vextabDivJs + '</script></head>' + 
    '<body><div class="vex-tabdiv" width=680 scale=1.0 editor=false>' + vextab + '</div></body>' + 
    '</html>';
}

var fs = require('fs')
  , _ = require('underscore')
  , _s = require('underscore.string')
  , phantom = require('node-phantom')

  , vextabDivJs = fs.readFileSync(__dirname + '/../node_modules/vextab/releases/vextab-div.js')

  , server = require('http').createServer(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(createHtmlForVextab(decodeURIComponent(req.url.substring(req.url.lastIndexOf('?html='))), vextabDivJs));
    }).listen();

module.exports = function(program) {
  var infile = program.I
    , outfile = program.O
    , transpose = program.T
    , perPage = program.Pp;
  
  fs.readFile(infile, function(err, buff) {
    var vextab = createVextab(parseStavesContent(buff.toString()));
    
    phantom.create(function(err, ph) {
      if (err) {
        console.log(err);
      } else {
        ph.createPage(function(err, page) {
          page.open('http://localhost:' + server.address().port + '/?html=' + encodeURIComponent(vextab), function(err, status) {
            console.log(page);
            page.render(outfile);
            ph.exit();
          });
        });
      }
    }, {
      phantomPath: require('phantomjs').path,
      parameters: {
        'web-security': 'false'
      }
    });
  });
};