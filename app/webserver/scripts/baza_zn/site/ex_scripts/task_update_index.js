'use strict';
console.log('load task_update_index.js');

var g = require('../inc.js');
var fnc = g.functions;
var gen_query = fnc.db.gen_query;
var c = g.config;
var tf = g.thunkify;
var clog = console.log;


module.exports = function(fn){
    fnc.run_gen(function*(){
        clog('task_update_index begin');
        
        var p = require('../js/prepare_to_start.js');
        yield tf(p.load_db_list)();
        
        var db_id = c.args.db;
        if (!db_id) throw(new Error('argument db not set'));
        
        var db_config = c.db[db_id];
        if (!db_config) throw(new Error('db "'+db_id+'" not found'));
        clog('connect to db: '+db_id);
        var db = yield fnc.db.gen_connect(db_id);
        clog('connected');
        
        
        yield update_index_data(db_id);
        
        
        clog('close db connection');
        db.close();
        clog('task_update_index end');
    },function(err){
        if (err) {
            console.log(fnc.merr(err));
            return fn(err);
        }
        fn();
    });
}

function* update_index_data(db_id) {
    var id = c.args.id;
    if (id) {
        return yield update_index_data_id(db_id,id);
    }
}

function* update_index_data_id(db_id,id) {
    var post_data = {id:id, name:'', text:'', tags:''};
    yield get_post_data(db_id,post_data);
    
    post_data.words = {};
    var w = post_data.words;
    w.name = get_words_from_text(post_data.name);
    w.text = get_words_from_text(post_data.text);
    w.tags = get_words_from_text(post_data.tags);
    
    clog("post_data: ");
    clog(post_data);
}

//загружаем данные поста
function* get_post_data(db_id,post_data) {
  var sql = "SELECT id_post,name,text,tags FROM t_post WHERE id_post='"+post_data.id+"'";
  var rows = yield gen_query(db_id,sql);
  
  if ( rows.length==0 ) {
    //чистим на всякий случай таблицу t_post_text
    sql = "DELETE FROM t_post_text WHERE id_post='"+post_data.id+"' ";
    yield gen_query(db_id,sql);
    return post_data;
  }
  
  var row = rows[0];
  post_data.name += row.name;
  post_data.text += row.text;
  post_data.tags += row.tags;
  
  
  sql = "SELECT text FROM t_post_text WHERE id_post='"+post_data.id+"' ORDER BY n_order";
  rows = yield gen_query(db_id,sql);
  
  if ( rows.length==0 ) {
    return post_data;
  }
  
  for(var i=0;i<rows.length;i++){
    row = rows[i];
    post_data.text += row.text;
  }
  
  return post_data;
}

//получаем набор слов и количество их повторений в тексте
function get_words_from_text(text){
  if (!text) return {};
  
  text = text.replace(/<[A-Za-z][^>]*>/g," "); //удаляем теги
  
  //text = text.replace(/[ \t\n\v\r\.,;\:\!\?\|'"`~\\@#№$%\^\&\[\]\{\}\(\)\-\+\*\/=\<\>]+/g,' ');  //заменяем все ненужные символы на 1 пробел
  text = text.replace(new RegExp("[^A-Za-z0-9_А-Яа-я]","g"),' ');  //заменяем все ненужные символы на 1 пробел
  text = text.replace(new RegExp(" [A-Za-z0-9_А-Яа-я]{1,2} ","g"),' '); //убераем 1 и 2 символьные слова
  text = text.replace(/ +/g,' '); //убираем лишние пробелы

  //clog("-2-------------------------------------------------------------");
  //clog(text);
  //clog("--------------------------------------------------------------");
  
  var words = {};
  var re = new RegExp("\d{2,100}","g");
  //re = /[^ \t\n\v\r\.,;\:\!\?\|'"`~\\@#№$%\^\&\[\]{}\(\)\-\+\*\/=\<\>]{2,100}/g;
  re = /[^ ]+/g;
  
  //g.log.info( "\n================================================\n" );
  //g.log.info( "text: \"" +text+"\"");
  var arr = [];
  while ((arr = re.exec(text)) != null){
    //g.log.info( "\n"+g.mixa.dump.var_dump_node("arr",arr,{}) );
    var word = arr[0];
    word = word.toLowerCase();
    
    if(!words[word]) words[word] = 1;
    else words[word]++;
  }
  //g.log.info( "\n"+g.mixa.dump.var_dump_node("words",words,{}) );
  //g.log.info( "\n================================================\n" );
  return words;
}
