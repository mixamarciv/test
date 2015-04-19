'use strict';

var t = require('mocha');
var should = require('should');

var g = require('../inc.js');
var join = g.path.join2;

var request = require('request');
var querystring = require('querystring');

var clog = console.log;

var test_host = 'http://127.0.0.1:'+g.config.http_port;
var run_task  = join(__dirname,'test_task.bat');

clog('AAAAAAAAAAAA');
describe('run tests', function() {
    it('run test1', function(done){
        
        var run_options = {
            run_json: JSON.stringify({run:run_task}),
            out_file: run_task+'.out',
            name: 'test1',
            note: 'run test cmd task',
            cache_text: new Date().getTime(),
            user_info: 'teeest'
        }
        var url = test_host+'/run?' + querystring.stringify(run_options);
        request.get(url, function(err, httpResponse, body) {
          should.not.exist(err);
          //clog(httpResponse);
          clog(body);
          done();
        });
    });

});