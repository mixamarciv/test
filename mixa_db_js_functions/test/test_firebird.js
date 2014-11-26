'use strict';

require('mocha');
var should = require('should');
var join = require('path').join;


var db = require('..');
var options = {
    dbtype: 'ibase',
    database: join( __dirname, './data1.fdb' ),
    host: '127.0.0.1',     // default
    port: 3050,            // default
    user: 'SYSDBA',        // default
    password: 'masterkey'  // default
};

/**********
db.connect(options,function(err,connect){
    if(err) trow(err);
    connect.query('SELECT * FROM table'[,options],function(err,rows){
        if(err) trow(err);
        console.log(rows);
    });
    connect.generator('gen_name'[,inc_val],function(err,gen_id){
        if(err) trow(err);
        console.log('next id:'+gen_id);
    });
});
***********/

describe('run firebird test', function() {
    var conn = {};
    
    beforeEach('connect()', function() {
        it('should return a conn functons', function(done) {
            db.connect(options,function(err,p_conn){
                should.not.exist(err);
                should.exist(conn);
                conn = p_conn;
                done();
            });
        });
    });
    
    afterEach('query()', function(){
        it('should return a rows', function(done) {
            conn.query('SELECT id_post FROM app1_post',function(err,rows){
                should.not.exist(err);
                should.exist(rows);
                done();
            });
        });
    });
    
    afterEach('query()', function(){
        it('should return a rows', function(done) {
            conn.query('SELECT id_post FROM app1_post',function(err,rows){
                should.not.exist(err);
                should.exist(rows);
                done();
            });
        });
    });
});

function test_query(conn) {
    it('should return a rows', function(done) {
        conn.query('SELECT id_post FROM app1_post',function(err,rows){
            should.not.exist(err);
            should.exist(rows);
            done();
        });
    });
}

function test_query(conn) {
    it('should return a rows', function(done) {
        conn.query('SELECT id_post FROM app1_post',function(err,rows){
            should.not.exist(err);
            should.exist(rows);
            done();
        });
    });
}
