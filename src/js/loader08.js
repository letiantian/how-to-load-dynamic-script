function getJS(url) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                    script.onreadystatechange = null;
                    resolve('success: '+url);
                }
            };
        } else {  //Others
            script.onload = function() {
                resolve('success: '+url);
            };
        }

        script.onerror = function() {
            reject(Error(url + 'load error!'));
        };

        script.src = url+'?'+'time='+Date.parse(new Date());
        document.body.appendChild(script);

    });
}

function spawn(generatorFunc) {
  function continuer(verb, arg) {
    var result;
    try {
      result = generator[verb](arg);  // 这个result是生成器的返回值，有value和done两个属性
    } catch (err) {
      return Promise.reject(err);
    }
    if (result.done) {
      return result.value;
    } else {
      return Promise.resolve(result.value).then(onFulfilled, onRejected);  // result.value是promise对象
    }
  }
  var generator = generatorFunc();
  var onFulfilled = continuer.bind(continuer, "next");
  var onRejected = continuer.bind(continuer, "throw");
  return onFulfilled();
}

var jquery = 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js',
    your   = './js/your.js',
    my     = './js/my.js'
;

spawn(function*() {
    try {
        yield getJS(jquery);
        console.log('jquery has loaded');
        yield getJS(your);
        console.log('your.js has loaded');
        yield getJS(my);
        console.log('my.js has loaded');
    } catch (err) { 
        console.log(err);
    }
});