'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.asset_cachekiller = {
  
  tearDown: function(done) {
    var content = '<script type="text/javascript" src="tmp/js/main.js"></script><link rel="stylesheet" href="tmp/css/style.css" />';
    grunt.file.write('test/fixtures/assets.html', content);
    grunt.file.write('test/files/style.css', 'body {  background-color: #000; }');
    
    done();
  },
  
  bust: function(test) {
    test.expect(7);

    var manifest1 = grunt.file.exists('tmp/js/manifest.json');
    var manifest2 = grunt.file.exists('tmp/css/manifest.json');
    var hashedjs = grunt.file.exists('tmp/js/9beb708ab971.main.js');
    var hashedcss = grunt.file.exists('tmp/css/9b5642b54649.style.css');
    var assetFile = grunt.file.read('test/fixtures/assets.html');
    var manifestContent1 = grunt.file.readJSON('tmp/js/manifest.json');
    var manifestContent2 = grunt.file.readJSON('tmp/css/manifest.json');
    
    test.ok(manifest1, "js manifest created");
    test.ok(manifest2, "css manifest created");
    test.ok(hashedjs, "js hashed file name");
    test.ok(hashedcss, "css hashed file name");
    test.equal(assetFile,'<script type="text/javascript" src="tmp/js/9beb708ab971.main.js"></script><link rel="stylesheet" href="tmp/css/9b5642b54649.style.css" />');
    test.deepEqual(manifestContent1, { 'main.js': '9beb708ab971.main.js' });
    test.deepEqual(manifestContent2, { 'style.css': '9b5642b54649.style.css' });

    test.done();
  }

};