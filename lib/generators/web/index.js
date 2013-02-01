var
  fs  = require('fs')
, hbs = require('handlebars')

, templates = {
    module: 'templates/module.handlebars'
  , list:   'templates/list.handlebars'
  }

, outputDir: './'
;

module.exports.generate = function(document, callback){
  var stage = {
    start: function(){
      stage.compileTemplates();
    }

  , compileTemplates: function(){
      for (var key in templates){
        templates[key] = hbs.compile(fs.readFileSync(templates[key], 'utf-8'));
      }

      stage.generateModules();
    }

  , generateModules: function(){
      var
        api = {}

      , resources = document.resources

      , generate = function(resource, url){
          url = (url || "") + resource.path;

          var
            output    = "{\n"
          , idVars    = []
          , urlParts  = []
          ;

          // Parse out ids variable names
          if (url.indexOf(':') > -1){
            url.split('/').forEach(function(part){
              if (part[0] === ':'){
                idVars.push(part.substring(1));
                urlParts.push({ part: part.substring(1), isUrl: false });
              } else {
                urlParts.push({ part: part, isUrl: true });
              }
            });
          }

          if (resource.methods){
            var method;
            for (var i = 0; i < resource.methods.length; i++){
              method = resource.method[i].toLowerCase();

              if (i > 0) output += ", ";

              if (method === "get"){
                if (resource.type === "collection"){
                  output: 'list: ' + templates.list({
                    idVars: idVars
                  , path: url
                  });
                }
              }
            }
          }

          return "\n}";
        }
      ;

      // Write each module
      for (var key in resources){
        fs.writeFileSync(outputDir + key + '.js', generate(resources[key]))
      }
    }

  , error: function(error){
      throw error;
    }

  , end: function(){
      process.exit(0);
    }
  };

  stage.start();
};