'use strict';
console.log('start app  (%s%s; node %s; pid:%s)',process.platform, process.arch, process.version, process.pid);


var clog = console.log;
var g = require('./inc.js');

var webserver = require('app/load_webserver/webserver.js');

webserver.start(function(err){
    if (err) {
      console.error('\n\n\n  WEBSERVER START ERROR:  \n\n');
      f.merr(err,'load error:');
      console.error(err);
      return;
    }
    clog('\n\nserver is running  '+g.mixa.str.date_format('Y.M.D h:m:s k')+'\n\n');
});
