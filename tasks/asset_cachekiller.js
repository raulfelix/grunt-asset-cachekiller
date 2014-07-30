/*
 * grunt-asset-cachekiller
 * https://github.com/rcar1115/grunt-asset-cachekiller
 *
 * Copyright (c) 2014 Raul Felix Carrizo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var
    path = require('path'),
    crypto = require('crypto');

  grunt.registerMultiTask('asset_cachekiller', 'The best Grunt plugin ever.', function() {

    function generateContentHash(filepath, algorithm, encoding) {
      var hash = crypto.createHash(algorithm);
      hash.update(grunt.file.read(filepath));
      return hash.digest(encoding);
    }
      
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      algorithm: 'md5',
      length: 12
    });
    
    // Iterate over all specified file groups.
    this.files.forEach(function (pair) {
      
      if (pair.src.length === 0) {
        grunt.log.error('No source files found for destination: ' + pair.dest);
      }
      
      pair.src.forEach(function (f) {
      
        var content,
          assetContent,
          filename = path.basename(f),
          hash = generateContentHash(f, options.algorithm, 'hex'),
          prefix = hash.slice(0, options.length),
          hashedFilename = [prefix, filename].join('.'),
          oldFileName = filename,
          manifest = {},
          manifestPath = path.resolve(pair.dest, 'manifest.json');

        // does asset file exist
        if (grunt.file.exists(options.file)) {
          content = grunt.file.read(options.file);
        } else {
          grunt.log.error('Asset file not found: ' + options.file);
          grunt.log.error('No changes made for: ' + filename);
          return false;
        }

        // read existing manifest data
        if (grunt.file.exists(manifestPath)) {
          manifest = grunt.file.readJSON(manifestPath);
        }

        // if updates are required
        if (hashedFilename !== manifest[filename]) {
          
          if (manifest[filename] !== undefined) {
            // delete the existing file
            grunt.file.delete(path.resolve(pair.dest, manifest[filename]));
            oldFileName = manifest[filename];
            grunt.log.writeln('Delete outdate file: ' + oldFileName);
          } 

          // update asset reference file
          content = content.replace(new RegExp(oldFileName), hashedFilename);
          grunt.file.write(options.file, content);

          // write content to generated asset
          assetContent = grunt.file.read(f);
          grunt.file.write(path.resolve(pair.dest, hashedFilename), assetContent);
          
           // update manifest with new file mappings
          manifest[filename] = hashedFilename;
          grunt.file.write(manifestPath, JSON.stringify(manifest, null, 2)); 
          
          grunt.log.writeln('Cache bust ' + oldFileName + ' -> ' + hashedFilename);
        } 
        else {
          grunt.log.writeln('File unchanged ' + oldFileName + ' -> ' + hashedFilename);
        }
      });
    });
  });
};