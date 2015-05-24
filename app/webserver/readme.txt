test webserver

var dump:
    var ex = [/\._/,
              /^this\.socket/,
              /^this\..*\.socket/,
              /^this\..*\.connection/
             ];
    clog(g.mixa.dump.var_dump_node('this',this,{max_str_length:90000,exclude:ex}));





    var ex = [/^g\.iconv/,
              /^g\.u/,
              /^g\.path/,
              /^g\.moment/,
	      /^g\.fs/,
	      /^g.crypto/,
	      /^g.crc/,
             ];
    clog(g.mixa.dump.var_dump_node('g',g,{max_str_length:90000,exclude:ex}));
