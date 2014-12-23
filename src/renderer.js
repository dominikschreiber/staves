var fs = require('fs')
  , es = require('event-stream')
  , _ = require('underscore')
  , _s = require('underscore.string')
  , htmlpdf = require('html-pdf');

exports.toPdf = function(outfile, shouldUseSvg, width, height) {
    var scripts = [];
    
    if (shouldUseSvg) {
        scripts.push(fs.readFileSync(__dirname + '/../node_modules/raphael/raphael-min.js'));
    }
    scripts.push(fs.readFileSync(__dirname + '/../node_modules/vextab/releases/vextab-div.js'));
    
    return es.mapSync(function(vextabs) {
        var filenames = _.map(_.range(vextabs.length), function(index) {
           return outfile.replace('.pdf', '-' + _s.lpad(index + 1, 2, '0') + '.pdf');
        });
        
        _.chain(vextabs)
            .zip(filenames)
            .each(function(vextabFilename) {
                htmlpdf.create(createHtmlForVextab(vextabFilename[0], scripts), {
                    width: width + 'px',
                    height: height + 'px',
                    filename: vextabFilename[1]
                }, function(err, buffer) {});
            });
        
        return filenames;
    });
};

function createHtmlForVextab(vextab, scripts) {
    return '<html>' +
        '<head>' + 
            '<style>body{display:flex;height:100vh}body>*{margin:auto}</style>' + 
            _.chain(scripts)
                .filter(function(script) { return script; })
                .map(function(script) { return '<script>' + script + '</script>'; })
                .value()
                .join('') +
        '</head>' +
        '<body>' +
            '<div class="vex-tabdiv" width=680 scale=1.0 editor=false>' + vextab + '</div>' +
        '</body>' + 
        '</html>';
}