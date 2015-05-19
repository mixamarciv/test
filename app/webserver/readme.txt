test webserver

var dump:
    var ex = [/\._/,
              /^this\.socket/,
              /^this\..*\.socket/,
              /^this\..*\.connection/
             ];
    clog(g.mixa.dump.var_dump_node('this',this,{max_str_length:90000,exclude:ex}));



