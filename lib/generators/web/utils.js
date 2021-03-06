define(function(require){
  var
    req     = require('reqwest')
  , config  = require('./config')
  ;

  utils.noop = function(){};

  utils.api = {};

  utils.api.get = function(url, data, callback){
    utils.api.request('get', url, data, callback);
  };

  utils.api.post = function(url, data, callback){
    utils.api.request('post', url, data, callback);
  };

  utils.api.patch = function(url, data, callback){
    utils.api.request('patch', url, data, callback);
  };

  utils.api.update = function(url, data, callback){
    utils.api.request('patch', url, data, callback);
  };

  utils.api.del = function(url, data, callback){
    utils.api.request('del', url, data, callback);
  };

  utils.api.request = function(method, url, data, callback){
    switch (method){
      case "get":   method = "GET"; break;
      case "post":  method = "POST"; break;
      case "del":   method = "DELETE"; break;
      case "put":   method = "PATCH"; break;
      case "patch": method = "PATCH"; break;
    }

    url = config.apiUrl + url;

    if (typeof data === "function"){
      callback = data;
      data = {};
    }

    if (method === "GET"){
      url += utils.queryParams(data);
      data = null;
    }

    var ajax = {
      method: method
    , url: url
    , withCredentials: true
    , crossOrigin: true
    , success: function(results){
        callback(results.error, results.data, results.meta);
      }
    , error: function(error){
        callback(error);
      }
    };

    if (data) ajax.data = data;

    req(ajax);
  };

  utils.queryParams = function(data){
    if (typeof data !== "object") return "";
    var params = "?";
    for (var key in data){
      params += key + "=" + data[key] + "&";
    }
    return params.substring(0, params.length - 1);
  };

  return utils;
});