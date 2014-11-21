console.log('  load app/app_use/check_cookies.js..');

var g = require('../../inc.js');
var f = g.functions;
var clog = console.log;

//меняем this.cookies.set и get
//  что бы результат this.cookies.get был == предыдущему this.cookies.set в этом же запросе
module.exports = function *pageNotFound(next) {
    this.cookies.__original_get = this.cookies.get;
    this.cookies.__original_set = this.cookies.set;
    
    var self = this;
    this.cookies.__set_vars = {};
    
    this.cookies.get = function (name,options,default_value){
        var v = self.cookies.__set_vars[name];
        if( v === undefined ){
            v = self.cookies.__original_get(name,options);
            self.cookies.__set_vars[name] = v;
        }
        return v;
    }
    
    this.cookies.set = function (name,value,options){
        self.cookies.__set_vars[name] = value;
        return self.cookies.__original_set(name,value,options);
    }
    
    yield next;    
}

