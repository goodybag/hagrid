/**
 * Prayer:
 *
 * Dear, Lord -
 *
 * I apologize for this file. Bless all of those who tread
 * these treachorous code paths. For those who attempt to wrangle
 * the spaghetti, I ask you, Lord, to bless those individuals with
 * your beautiful might and your beautiful eyes and lips. Mmmhmm..
 * Lord...
 *
 * Anyway! injesusnameweprayammmmmmmen
 *
 * -john
 */

var
  fs  = require('fs')
, hbs = require('handlebars')

, templates = {
    module: 'lib/generators/web/templates/module.handlebars'
  , list:   'lib/generators/web/templates/list.handlebars'
  , get:    'lib/generators/web/templates/get.handlebars'
  }

, getUrlParts = function(url){
    var urlParts = [];
    // Parse out ids variable names
    if (url.indexOf(':') > -1){
      url.split('/').slice(1).forEach(function(part){
        if (part[0] === ':'){
          urlParts.push({ part: part.substring(1), isUrl: false });
        } else {
          urlParts.push({ part: part, isUrl: true });
        }
      });
    } else {
      urlParts = url.split('/').slice(1).map(function(p){ return { part: p, isUrl: true } });
    }

    return urlParts;
  }

, getIdVars = function(url){
    var idVars = [];
    // Parse out ids variable names
    if (url.indexOf(':') > -1){
      url.split('/').slice(1).forEach(function(part){
        if (part[0] === ':'){
          idVars.push(part.substring(1));
        }
      });
    }

    return idVars;
  }

, getResourceMethods = function(resource, urlParts, idVars){
    var method, output = "";
    for (var i = 0; i < resource.methods.length; i++){
      method = resource.methods[i].toLowerCase();

      if (i > 0) output += ", ";

      if (method === "get"){
        if (resource.type === "collection"){
          output += 'list: ' + templates.list({
            idVars: idVars
          , urlParts: urlParts
          });
        } else if (resource.type === "item"){
          output += 'get: ' + templates.get({
            idVars: idVars
          , urlParts: urlParts
          });
        } else output += "stub: function(){}"
      } else if (method === "post"){
        output += "create: function(){}"
      } else if (method === "patch"){
        output += "update: function(){}"
      } else if (method === "delete"){
        output += "del: function(){}"
      } else output += "stub: function(){}"

      output += "\n";
    }

    return output;
  }
;

module.exports = function(document, options, callback){
  var stage = {
    start: function(){
      stage.compileTemplates();
    }

  , compileTemplates: function(){
      for (var key in templates){
      // console.log(fs.readFileSync(templates[key], 'utf-8'));
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
          , idVars    = getIdVars(url)
          , urlParts  = getUrlParts(url);
          ;

          if (resource.methods){
            // console.log(url, urlParts);
            output += getResourceMethods(resource, urlParts, idVars) + "\n";
          }

          if (resource.resources && resource.resources.item){
            var item = resource.resources.item;

            urlParts = getUrlParts(url + item.path);
            idVars = getIdVars(url + item.path);

            if (resource.methods.length > 0) output += ", ";
            output += getResourceMethods(item, urlParts, idVars) + "\n";

            output += ", ";

            if (item.resources){
              for (var key in item.resources){
                output += key + ": " + generate(item.resources[key], url + item.path);
              }
            }
          }

          for (var key in resource.resources){
            if (key === "item") continue;

            output += ", " + key + ": " + generate(resource.resources[key], url);
          }

          return output +  "\n}";
        }
      ;

      // Write each module
      for (var key in resources){
        console.log("Generating Module: ", options.buildDir + '/' + key + '.js');
        fs.writeFileSync(options.buildDir + '/' + key + '.js', templates.module({ $return: generate(resources[key]) }));
      }
      // Only write businesses for now
      // fs.writeFileSync(options.buildDir + '/businesses.js', templates.module({ $return: generate(resources.businesses) }));
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