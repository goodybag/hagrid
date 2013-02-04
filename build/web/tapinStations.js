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

, create: function(data, callback){
  if (typeof data === 'function'){
    callback = data;
    data = {};
  }

  utils.post('/businesses/' + , data, callback);
}


, get: function(businessId, query, callback){
  if (typeof query === 'function'){
    callback = query;
    query = {};
  }

  utils.get('/businesses/' + businessId  + utils.query(query), callback);
}

, update: function(businessId, data, callback){
  if (typeof data === 'function'){
    callback = data;
    data = {};
  }

  utils.update('/businesses/' + businessId  + , data, callback);
}

, del: function(businessId,  callback){
  utils.delete('/businesses/' + businessId  + , callback);
}


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