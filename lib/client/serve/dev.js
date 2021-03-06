// Generated by CoffeeScript 1.3.3
var qs, system, url, utils;

url = require('url');

qs = require('querystring');

system = require('../system');

utils = require('./utils');

if (!process.SS_ROUTER) {
  module.exports = function(ss, router, options) {
    var asset;
    asset = require('../asset')(ss, options);
    router.on('/_serveDev/system?*', function(request, response) {
      return utils.serve.js(system.serve.js(), response);
    });
    router.on('/_serveDev/code?*', function(request, response) {
      var params, path, thisUrl;
      thisUrl = url.parse(request.url);
      params = qs.parse(thisUrl.query);
      path = utils.parseUrl(request.url);
      return asset.js(path, {
        pathPrefix: params.pathPrefix
      }, function(output) {
        return utils.serve.js(output, response);
      });
    });
    router.on('/_serveDev/start?*', function(request, response) {
      return utils.serve.js(system.serve.initCode(), response);
    });
    return router.on('/_serveDev/css?*', function(request, response) {
      var path;
      path = utils.parseUrl(request.url);
      return asset.css(path, {}, function(output) {
        return utils.serve.css(output, response);
      });
    });
  };
}
else {  
  module.exports = function(ss, router, options) {
    var asset;
    router = process.SS_ROUTER;
    asset = require('../asset')(ss, options);
    router.on('get', '/_serveDev/system?*', function(request, response) {
      response = this.res;
      return utils.serve.js(system.serve.js(), response);
    });

    router.on('get', '/_serveDev/code?*', function(request, response) {
      response = this.res;
      request = this.req;
      var params, path, thisUrl;
      thisUrl = url.parse(request.url);
      params = qs.parse(thisUrl.query);
      path = utils.parseUrl(request.url);
      return asset.js(path, {
        pathPrefix: params.pathPrefix
      }, function(output) {
        return utils.serve.js(output, response);
      });
    });
    router.on('get', '/_serveDev/start?*', function(request, response) {
      response = this.res;
      request = this.req;
      return utils.serve.js(system.serve.initCode(), response);
    });
    console.log(router.routes);
    return router.on('get', '/_serveDev/css?*', function(request, response) {
      response = this.res;
      request = this.req;
      var path;
      path = utils.parseUrl(request.url);
      return asset.css(path, {}, function(output) {
        return utils.serve.css(output, response);
      });
    });
  };  
}
