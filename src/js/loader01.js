Loader = (function() {

  var loadScript = function(url) {
    var script = document.createElement( 'script' );
    script.setAttribute( 'src', url+'?'+'time='+Date.parse(new Date()));  // 不用缓存
    document.body.appendChild( script );
  };

  var loadMultiScript = function(url_array) {
    for (var idx=0; idx < url_array.length; idx++) {
      loadScript(url_array[idx]);
    }
  }

  return {
    load: loadMultiScript,
  };

})();  // end Loader