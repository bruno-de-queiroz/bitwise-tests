function bitdefine(directive){
	var _loadedScripts = {}
		, _dependencies = 0
		, _loaded = 0
		, _bin = function(val){
			var _obj = {
				"string" : function(convert){
					var binary_string = ''
						, current_letter;

					for (var i=0; i < convert.length; i++) {
						current_letter = convert.substring(i, i + 1).charCodeAt(0).toString(2);
						if (current_letter.length < 8) {
							while(current_letter.length < 8) {
								current_letter = '0' + current_letter;
							}
						}
						binary_string += current_letter;
					}
					return binary_string;
				}
				, "number" : function(convert) {
					return convert.toString(2);
				}
			}
			return _obj[typeof(val)] ? _obj[typeof(val)].call(this,val) : null;
		}
		, _hex = function(val){
			var _obj = {
				"string" : function(convert){
					var hex_string = '';
					for (var i=0; i < convert.length; i++) {
						hex_string += ''+convert.charCodeAt(i).toString(16);
					}
					return hex_string;
				}
				, "number" : function(convert) {
					return convert.toString(16).toUpperCase();
				}
			}
			return _obj[typeof(val)] ? _obj[typeof(val)].call(this,val) : null;
		}
		, _toString = function(convert){

			if (convert.length % 8 != 0) {
				if(convert.length % 4 == 0){
					return parseInt(convert,2);
				}
				return 'Binary length is not divisible by eight.'

			} else {

				convert = convert.replace(/ /g,'').replace(/\n/g,'');

				var ascii_string = ''
					, current_byte;

				for (var i=0; i < convert.length/8; i++) {
					current_byte = convert.substring(i*8, (i*8)+8);
					ascii_string += String.fromCharCode(parseInt(current_byte, 2));
				}
				return ascii_string;
			}
		}
		, _files = {
			0x1 : {
				name: "jquery"
				, object: "window.$"
				, alias: "$"
				, url : "http://code.jquery.com/jquery-2.0.0.min.js"
			}
			,  0x4 : {
				name : "require"
				, object: "require"
				, alias : "_"
				, url : "http://requirejs.org/docs/release/2.1.5/minified/require.js"
			}
		}
		, _fn = function(fn){
			_onLoad = fn;
		}
		, _getScript = function(item,callback) {

			script = document.createElement("script");
			script.src = item.url;

			script.onload = function( evt ) {
				_loaded++;
				eval("_loadedScripts."+item.alias+" = "+item.object+";");
				eval(item.object + " = null; ");
				callback(null,evt);
			}

			document.head.appendChild( script );
		}


	var mask = _bin(directive);

	for(var i in _files){
		var key = parseInt(i);
		if( mask & key ){
			var item = _files[i];
			_dependencies++;
			_getScript(item,function(){
				if(_loaded == _dependencies){
					_onLoad.call(_loadedScripts);
				}
			});
		}
	}

	return _fn;
}



bitdefine("a")(function(data) {
	console.log(this);
	this.$(".teste strong:eq(0)").css("background","black");
	if(this._){
		this.$(".teste strong:eq(2)").css("background","black");
	}
});