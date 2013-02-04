define(function(require){
  var
    utils = require('./utils')
  ;

  return {
stub: function(){}
, create: function(data, callback){
  if (typeof data === 'function'){
    callback = data;
    data = {};
  }

  utils.post('/session/' + , data, callback);
}

, del: function( callback){
  utils.delete('/session/' + , callback);
}


, oauth: {
stub: function(){}
, create: function(data, callback){
  if (typeof data === 'function'){
    callback = data;
    data = {};
  }

  utils.post('/session/' + '/oauth/' + , data, callback);
}

, del: function( callback){
  utils.delete('/session/' + '/oauth/' + , callback);
}



}
};
});