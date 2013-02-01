var
  hagrid = require('./')

, options = {
    buildDir: '/goodybag/api-client-generator/build/web'
  , documentPath: 'http://magic.staging.goodybag.com'
  }
;

hagrid.generate('web', options, function(error){
  if (error) throw error;
  console.log("Complete!");
  process.exit(0);
});