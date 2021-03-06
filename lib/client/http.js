// Generated by CoffeeScript 1.3.3
var cache, fs, http, pathlib, res, view;

require('colors');

fs = require('fs');

pathlib = require('path');

http = require('http');

view = require('./view');

cache = {};

res = http.ServerResponse.prototype;

// If flatiron/union is being used, then bind the following
// functions to the RoutingStream Prototype
if (process.env.SS_DIRECTORY) {
  try {
      var target_path = process.mainModule.filename;
      //console.log("TARGET PATH: ", target_path);
      //console.log("BASENAME: ", pathlib.basename(target_path));
      target_path = target_path.replace(pathlib.basename(target_path), "");
      var modules_path = pathlib.join(target_path, 'node_modules', 'union');
      //console.log("Modules Path: ", modules_path);
      var union = require(modules_path)
      , res = union.RoutingStream.prototype;

  }
  // Otherwise, bind to the native http.req prototype
  catch (ex) {
    console.log(ex);
  }
}

module.exports = function(ss, clients, options) {
  res.serveClient = function(name) {
    var client, fileName, self, sendHTML;
    self = this;
    sendHTML = function(html, code) {
      if (code == null) {
        code = 200;
      }
      self.writeHead(code, {
        'Content-Length': Buffer.byteLength(html),
        'Content-Type': 'text/html'
      });
      return self.end(html);
    };
    try {
      client = typeof name === 'string' && clients[name];
      if (client == null) {
        throw new Error('Unable to find single-page client: ' + name);
      }
      if (options.packedAssets) {
        if (!cache[name]) {
          fileName = pathlib.join(ss.root, options.dirs.assets, client.name, client.id + '.html');
          cache[name] = fs.readFileSync(fileName, 'utf8');
        }
        return sendHTML(cache[name]);
      } else {
        return view(ss, client, options, sendHTML);
      }
    } catch (e) {
      sendHTML('Internal Server Error', 500);
      ss.log('Error: Unable to serve HTML!'.red);
      return ss.log(e);
    }
  };
  return res.serve = res.serveClient;
};
