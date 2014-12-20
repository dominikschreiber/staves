//var phantom = require('node-phantom')
//  , program = require('commander');
//
//phantom.create(function(err, ph) {
//  ph.createPage(function(err, page) {
//    console.log('created page');
//    page.content = '<h1>it works!</h1>';
//    page.render('./itworks.pdf');
//    ph.exit();
//  });
//}, { phantomPath: require('phantomjs').path });

module.exports = function(program) {
  console.log('program: ', program);
};