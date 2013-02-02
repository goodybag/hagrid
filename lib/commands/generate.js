var
  fs = require('fs')
, req = require('request')
;

module.exports = function(client, options, callback){
  var stage = {
    start: function(){
      stage.determineIfClientIsSupported();
    }

  , determineIfClientIsSupported: function(){
      fs.exists('lib/generators/' + client + '/index.js', function(result){
        if (!result) return stage.error(new Error("Cannot find client generator: " + client));

        stage.retrieveDocument();
      });
    }

  , retrieveDocument: function(){
      req.get(options.documentPath, function(error, response, results){
        if (error) return stage.error(error);

        if (!results) return stage.error(new Error('Invalid document format'));

        results = JSON.parse(results);

        if (results.type !== "descriptor") return stage.error(new Error('Invalid document format: type is not a descriptor'));
        if (!results.resources) return stage.error(new Error('Invalid document format: no resources'));

        stage.generateClient(results);
      });
    }

  , generateClient: function(document){
      var generator = require('../generators/' + client);

      generator(document, options, function(error){
        if (error) return stage.error(error);

        stage.end();
      });
    }

  , error: function(error){
      callback(error);
    }

  , end: function(){
      callback();
    }
  };

  stage.start();
};