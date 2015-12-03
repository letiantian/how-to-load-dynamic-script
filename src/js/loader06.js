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
            script.onload = function(){
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