var fs = require('fs')
  , es = require('event-stream')
  , _ = require('underscore')
  , htmlpdf = require('html-pdf');

exports.toPdf = function(outfile, shouldUseSvg, width, height) {
    var scripts = [];
    
    if (shouldUseSvg) {
        scripts.push(fs.readFileSync(__dirname + '/../node_modules/raphael/raphael-min.js'));
    }
    scripts.push(fs.readFileSync(__dirname + '/../node_modules/vextab/releases/vextab-div.js'));
    
    return es.mapSync(function(vextabs) {
        _.each(vextabs, function(vextab, index) {
            htmlpdf.create(createHtmlForVextab(vextab, scripts), {
                width: width + 'px',
                height: height + 'px',
                filename: outfile.replace('.pdf', '-' + (index + 1) + '.pdf')
            }, function(err, buffer) {});
        });
    });
};

function createHtmlForVextab(vextab, scripts) {
    return '<html>' +
        '<head>' + _.chain(scripts)
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