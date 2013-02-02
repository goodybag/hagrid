var
  hagrid = require('./')

, options = {
    buildDir: process.cwd() + '/build/web'
  , documentPath: 'http://localhost:3000'
  }
;

hagrid.generate('web', options, function(error){
  if (error) throw error;
  console.log("Complete!");
  process.exit(0);
});