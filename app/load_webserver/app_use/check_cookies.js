'use strict';

//меняем this.cookies.set и get
//  что бы результат this.cookies.get был == предыдущему this.cookies.set в этом же запросе
module.exports = function (ths) {
    ths.cookies.__original_get = ths.cookies.get;
    ths.cookies.__original_set = ths.cookies.set;
    
    var self = ths;
    ths.cookies.__set_vars = {};
    
    ths.cookies.get = function (name,options,default_value){
        var v = self.cookies.__set_vars[name];
        if( v === undefined ){
            v = self.cookies.__original_get(name,options);
            self.cookies.__set_vars[name] = v;
        }
        return v;
    }
    
    ths.cookies.set = function (name,value,options){
        self.cookies.__set_vars[name] = value;
        return self.cookies.__original_set(name,value,options);
    }   
}
