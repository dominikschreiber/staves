var fs = require('fs')
  , es = require('event-stream')

  , parser = require('./parser')
  , converter = require('./converter')
  , renderer = require('./renderer');

module.exports = function(program) {
    var infile = program.I
      , outfile = program.O
      , width = program.W
      , height = program.H
      , shouldUseSvg = program.S;

    fs.createReadStream(infile)
        .pipe(es.wait())
        .pipe(parser.parse())
        .pipe(converter.toVextabs(Math.floor(height / 250)))
        .pipe(renderer.toPdf(outfile, shouldUseSvg, width, height));
};