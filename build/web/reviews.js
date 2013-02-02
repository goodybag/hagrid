define(function(require){
  var
    utils = require('./utils')
  ;

  return {
list: function(query, callback){
  if (typeof query === 'function'){
    callback = query;
    query = {};
  }

  utils.get('/businesses/' + utils.query(query), callback);
}

, create: function(){}

, get: function(businessId, query, callback){
  if (typeof query === 'function'){
    callback = query;
    query = {};
  }

  utils.get('/businesses/' + businessId  + utils.query(query), callback);
}

, update: function(){}
, del: function(){}

, locations: {
list: function(businessId, query, callback){
  if (typeof query === 'function'){
    callback = query;
    query = {};
  }

  utils.get('/businesses/' + businessId  + '/locations/' + utils.query(query), callback);
}



}
};
});