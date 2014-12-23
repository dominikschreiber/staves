var fs = require('fs')
  , es = require('event-stream')

  , parser = require('./parser')
  , converter = require('./converter')
  , renderer = require('./renderer');

function stavesPerPage(width, height) {
    // 3.9 is empirically found
    return Math.round(3.9 / (width / height));
}

module.exports = function(program) {
    var infile = program.I
      , outfile = program.O
      , width = program.W
      , height = program.H
      , shouldUseSvg = program.S;
    
    if (!outfile) {
        outfile = infile.substring(infile.lastIndexOf('/') + 1).replace('.staves', '.pdf');
    }

    fs.createReadStream(infile)
        .pipe(es.wait())
        .pipe(parser.parse())
        .pipe(converter.toVextabs(stavesPerPage(width, height)))
        .pipe(renderer.toPdf(outfile, shouldUseSvg, width, height));
};