'use strict';
console.log('load task_update_index.js');

var g = require('../inc.js');
var fnc = g.functions;
var c = g.config;
var tf = g.thunkify;
var clog = console.log;

var db_id = null;
//var gen_query = fnc.db.gen_query;
//var gen_next_id = fnc.db.gen_next_id;

module.exports = function(fn){
    fnc.run_gen(function*(){
        console.time('task_update_index');
        clog('task_update_index start');
        
        
        console.time('prepare_to_start.js');
        var p = require('../js/prepare_to_start.js');
        yield tf(p.load_db_list)();
        console.timeEnd('prepare_to_start.js');
        
        
        console.time('connected');
        db_id = c.args.db;
        if (!db_id) throw(new Error('argument db not set'));
        
        var db_config = c.db[db_id];
        if (!db_config) throw(new Error('db "'+db_id+'" not found'));
        clog('connect to db: '+db_id);
        var db = yield fnc.db.gen_connect(db_id);
        console.timeEnd('connected');
        
        
        console.time('update_index_data');
        yield update_index_data();
        console.timeEnd('update_index_data');
        
        
        console.time('close db');
        clog('close db connection');
        db.close();
        console.timeEnd('close db');
        
        console.timeEnd('task_update_index');
    },function(err){
        if (err) {
            console.log(fnc.merr(err));
            return fn(err);
        }
        fn();
    });
}


function* gen_query(sql,params) {
    if(params) return yield fnc.db.gen_query(db_id,sql,params);
    return yield fnc.db.gen_query(db_id,sql);
}

function* gen_next_id(gen_name,inc_val) {
    if(inc_val===undefined) return yield fnc.db.gen_next_id(db_id,gen_name,1);
    return yield fnc.db.gen_next_id(db_id,gen_name,inc_val);
}

function* update_index_data() {
    var id = c.args.id;
    if (id) {
        return yield update_index_data_id(id);
    }
}

//обновляем данные поста в базе
function* update_index_data_id(id,type) {
    
    if (!type) console.time('load post data');
    var post_data = {id:id, name:'', text:'', tags:''};
    yield get_post_data(post_data);
    if (!type) console.timeEnd('load post data');
    
    if (!type) console.time('get words from post data');
    post_data.words = {};
    var w = post_data.words;
    get_words_from_text(post_data.words,post_data.text,1);
    get_words_from_text(post_data.words,post_data.name,3);
    get_words_from_text(post_data.words,post_data.tags,5);
    if (!type) console.timeEnd('get words from post data');
    
    if (!type) console.time('update count post words in db');
    var words = post_data.words;
    var sql = "SELECT w.id_word,w.word,w.cnt AS word_cnt,p.id_post,p.cnt AS post_word_cnt \n"
             +"FROM t_word__post p \n"
             +"  LEFT JOIN t_word w ON w.id_word=p.id_word \n"
             +"WHERE p.id_post='" + post_data.id + "'";
    var rows = yield gen_query(sql);
    //обновляем информацию по уже существующим словам:
    for(var i=0;i<rows.length;i++){
        var row = rows[i];
        var old_word = row.word;
        var old_cnt  = row.post_word_cnt;
        var new_cnt  = words[old_word];
        
        if (new_cnt == old_cnt) { //если ничего не изменилось то ничего не обновляем
            words[old_word] == 0;
            delete words[old_word];
            continue;
        }
        
        if (!words[old_word]) { //если уже нет этого слова в посте
            row.old_cnt = old_cnt;
            yield meta_word_post_delete(post_data,row);
            continue;
        }
        
        row.new_cnt = new_cnt;
        row.old_cnt = old_cnt;
        yield meta_word_post_update(post_data,row);
        
        //больше эти слова нам не понадобятся
        words[old_word] = 0;
        delete words[old_word];
    }
    //добавляем новые слова:
    for (var w in words) {
        var row = {};
        row.new_cnt = words[w];
        row.word = w;
        yield meta_word_post_add(post_data,row);
    }
    if (!type) console.timeEnd('update count post words in db');
}

function* meta_get_id_word(word) {
    var sql = "SELECT id_word AS id FROM t_word w WHERE word='"+word+"'";
    var rows = yield gen_query(sql);
    if (rows.length>0) {
        var row = rows[0];
        return row.id;
    }
    var id = yield gen_next_id('t_word_id');
    sql = "INSERT INTO t_word(id_word,word) VALUES("+id+",'"+word+"')";
    yield gen_query(sql);
    return id;
}
    
function* meta_word_post_add(post_data,row) {
    if (!row.id_word) row.id_word = yield meta_get_id_word(row.word);
    var sql = "INSERT INTO t_word__post(id_post,id_word,cnt) VALUES('"+post_data.id+"',"+row.id_word+","+row.new_cnt+")";
    yield gen_query(sql);
    return 1;
}

function* meta_word_post_update(post_data,row) {
    if (!row.id_word) row.id_word = yield meta_get_id_word(row.word);
    var sql = "UPDATE t_word__post w SET w.cnt = "+row.new_cnt+" WHERE w.id_word="+row.id_word;
    yield gen_query(sql);
    return 1;
}

function* meta_word_post_delete(post_data,row) {
    if (!row.id_word) row.id_word = yield meta_get_id_word(row.word);
    var sql = "DELETE FROM t_word__post p WHERE p.id_word="+row.id_word+" AND p.id_post='"+post_data.id+"'";
    yield gen_query(sql);
    
    var sql = "SELECT SUM(p.cnt) AS cnt FROM t_word__post p WHERE p.id_word="+row.id_word+" ";
    var rows = yield gen_query(sql);
    var row2 = rows[0];
    
    if (row2.cnt>0) {
        return 1;
    }
    var sql = "DELETE FROM t_word w WHERE w.id_word="+row.id_word+" ";
    yield gen_query(sql);
    return 1;
}

//загружаем данные поста из базы
function* get_post_data(post_data) {
  var sql = "SELECT id_post,name,text,tags FROM t_post WHERE id_post='"+post_data.id+"' ";
  var rows = yield gen_query(sql);
  
  if ( rows.length==0 ) {
    //чистим на всякий случай таблицу t_post_text
    sql = "DELETE FROM t_post_text WHERE id_post='"+post_data.id+"' ";
    yield gen_query(sql);
    return post_data;
  }
  
  var row = rows[0];
  post_data.name += row.name;
  post_data.text += row.text;
  post_data.tags += row.tags;
  
  
  sql = "SELECT text FROM t_post_text WHERE id_post='"+post_data.id+"' ORDER BY n_order";
  rows = yield gen_query(sql);
  
  if( rows.length==0 ) {
    return post_data;
  }
  
  for(var i=0;i<rows.length;i++) {
    row = rows[i];
    post_data.text += row.text;
  }
  
  return post_data;
}

//получаем набор слов words и количество их повторений в тексте text
function get_words_from_text(words,text,inc,type) {
  if (!text) return {};
  
  text = text.replace(/<[A-Za-z][^>]*>/g," "); //удаляем теги
  var re = /[A-Za-z0-9_А-Яа-я]{2,}/g;
  if (type==2) { //или предварительная чистка текста перед выборкой
      //text = text.replace(/[ \t\n\v\r\.,;\:\!\?\|'"`~\\@#№$%\^\&\[\]\{\}\(\)\-\+\*\/=\<\>]+/g,' ');  //заменяем все ненужные символы на 1 пробел
      text = text.replace(new RegExp("[^A-Za-z0-9_А-Яа-я]","g"),' ');  //заменяем все ненужные символы на 1 пробел
      text = ' '+text+' ';
      text = text.replace(new RegExp(" [A-Za-z0-9_А-Яа-я]{1} ","g"),' '); //убераем 1 и 2 символьные слова
      text = text.replace(/ +/g,' '); //убираем лишние пробелы
      //var re = new RegExp("\d{2,100}","g");
      //re = /[^ \t\n\v\r\.,;\:\!\?\|'"`~\\@#№$%\^\&\[\]{}\(\)\-\+\*\/=\<\>]{2,100}/g;
      var re = /[^ ]+/g;
  }
  var arr = [];
  while ((arr = re.exec(text)) != null){
    var word = arr[0];
    word = word.toLowerCase();
    
    if(!words[word]) words[word] = inc;
    else words[word] += inc ;
  }
  clog(words);
  return words;
}


