/*! CSV.js v1.1 | MIT License | https://github.com/k08045kk/CSV.js/blob/master/LICENSE */
/**
 * CSVの解析/文字列化
 * CSVの文字列データの配列化と、配列のCSV文字列化の機能を提供する。
 * 
 * [参考]
 * RFC4180 - https://www.ietf.org/rfc/rfc4180.txt
 * CSV Generate - https://csv.js.org/
 * 続・正規表現を使ったCSVパーサ - http://liosk.blog103.fc2.com/blog-entry-75.html
 * 
 * @auther      toshi (https://github.com/k08045kk)
 * @version     1.1
 * @see         1 - add - 初版
 */
(function(root, factory) {
  if (!root.CSV) {
    root.CSV = factory();
  }
})(this, function() {
  "use strict";
  
  // -------------------- private --------------------
  
  var _this;
  
  function _extend(dst, src, undefinedOnly) {
    if (dst != null && src != null) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          if (!undefinedOnly || dst[key] === void 0) {
            dst[key] = src[key];
          }
        }
      }
    }
    return dst;
  };
  
  // -------------------- static --------------------
  
  /**
   * コンストラクタ
   * @constructor
   */
  _this = function CSV_constrcutor() {
    
  };
  
  // オプション
  _this.options = {
    // 区切り（１文字のみ）
    delimiter: ',',
    
    // 改行（\r\n, \n, \r）
    // 文字列化で使用される。配列化では使用されない。
    newline: '\r\n',
    
    // エスケープ（１文字のみ）
    escape: '"',
    
    // コメント文字
    // コメント文字から改行までをコメントとする。
    //comment: '',
    
    // フィールド両端のスペースを削除する
    // エスケープ文字で囲まれたフィールドの空白を削除しません。
    //trim: false,
    
    // 空行をスキップする
    //skip_empty_line: false,
    
    // 終了行を出力する
    eof: true
  };
  
  /**
   * CSVの解析
   * 
   * 独自仕様
   * 1. 改行文字（行区切り）として、CRLF/LF/CRに対応する（３種類共、区切り文字として扱う）
   * 2. エスケープが閉じていない場合、終端までをフィールドとして扱う
   * 3. エスケープがフィールドより先に閉じている場合、閉じたところまでをエスケープ処理する
   *    （以降の要素はエスケープ処理しない）
   *
   * @param {string} text - CSVのテキストデータ
   * @param {Object} opt_options - オプション
   * @return {string[][]} CSVの配列データ
   */
  _this.parse = function CSV_parse(text, opt_options) {
    var opt = {};
    _extend(opt, opt_options, true);
    _extend(opt, _this.options, true);
    
    var escape = opt.escape;
    var pattern = opt.delimiter
          + '|' + '\r?\n|\r'
          + '|' + escape+'(?:[^'+escape+']|'+escape+escape+')*(?:$|'+escape+')'
          + '|' + '[^'+opt.delimiter+'\r\n]+';
    var tokenizer = new RegExp(pattern, 'g');   // /,|\r?\n|\r|"(?:[^"]|"")*(?:$|")|[^,\r\n]+/g
    //                    ,: 区切り文字
    //             \r?\n|\r: 改行文字
    // "(?:[^"]|"")*(?:$|"): エスケープ文字
    //            [^,\r\n]+: エスケープ文字以外（+ エスケープ文字以降の文字）
    var ee = new RegExp(escape+escape, 'g');    // /""/g
    
    var records = [];
    var record = [];
    var field = null;
    var m, token;
    function addField() {
      record.push(field || '');
      field = null;
    }
    function addRecord() {
      addField();
      records.push(record);
      record = [];
    }
    while ((m = tokenizer.exec(text)) !== null) {
      token = m[0];
      switch (token) {
      case '\r\n':
      case '\n':
      case '\r':
        addRecord();
        break;
      case opt.delimiter:
        addField();
        break;
      default:
        if (token.charAt(0) == escape) {
          token = (token.length >= 2 && token.charAt(token.length-1) == escape)?
                  token.slice(1, -1).replace(ee, escape):
                  token.slice(1).replace(ee, escape);
        }
        field = field != null ? field+token: token;
        // エスケープが正常に終了していない場合、２回呼び出される可能性がある
        // 例："a"b
        // 正常でないエスケープの場合、先頭のエスケープは、処理する（先頭以外は処理しない）
        // 例："a""b"c"d""e"f => a"bc"d""e"f
        // 例：a"b""c" => a"b""c"
        // エスケープが閉じていない場合、終端まで処理する
        // 例："a""b,c\r\nd\n[EOF] => a"b,c\r\nd\n
      }
    }
    if (record.length != 0 || field != null) {   // 改行の直後ではない
      addRecord();
    }
    return records;
  };
  
  /**
   * CSVの文字列化
   * CSVデータ（二次元配列）を文字列データに変換する。
   * @param {string[][]} records - CSVの配列データ
   * @param {Object} opt_options - オプション
   * @return {string} CSVのテキストデータ
   */
  _this.stringify = function CSV_stringify(records, opt_options) {
    var opt = {};
    _extend(opt, opt_options, true);
    _extend(opt, _this.options, true);
    
    var escape = opt.escape;
    var escaped = new RegExp(opt.delimiter+'|\r?\n|\r|'+escape);  // /,|\r?\n|\r|"/
    var e = new RegExp(escape, 'g');                              // /"/g
    var lines = [];
    var tokens = [];
    var r, c, field;
    for (r=0; r<records.length; r++) {
      tokens.length = 0;
      for (c=0; c<records[r].length; c++) {
        field = records[r][c];
        tokens.push(escaped.test(field)? escape+field.replace(e, escape+escape)+escape: field);
      }
      lines.push(tokens.join(opt.delimiter));
    }
    opt.eof && lines.push('');
    return lines.join(opt.newline);
  };
  
  return _this;
});
