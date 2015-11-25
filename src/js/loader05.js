// 这里调试用的代码我没有删除

Loader = (function() {

    var group_queue  = [];      // group list

    //// url_item = {url:str, start: false, finished：false}

    // 用于调试
    var log = function(msg) {
        return;
        console.log(msg);
    }

    var isFunc = function(obj) { 
        return Object.prototype.toString.call(obj) == "[object Function]"; 
    }

    var isArray = function(obj) { 
        return Object.prototype.toString.call(obj) == "[object Array]"; 
    }

    var isAllStart = function(url_items) {
        for (var idx=0; idx<url_items.length; ++idx) {
            if (url_items[idx].start == false )
                return false;
        }
        return true;
    }

    var isAnyStart = function(url_items) {
        for (var idx=0; idx<url_items.length; ++idx) {
            if (url_items[idx].start == true )
                return true;
        }
        return false;
    }

    var isAllFinished = function(url_items) {
        for (var idx=0; idx<url_items.length; ++idx) {
            if (url_items[idx].finished == false )
                return false;
        }
        return true;
    }

    var isAnyFinished = function(url_items) {
        for (var idx=0; idx<url_items.length; ++idx) {
            if (url_items[idx].finished == true )
                return true;
        }
        return false;
    }

    var loadFinished = function() {
        nextGroup();
    };

    var showGroupInfo = function() {
        for (var idx=0; idx<group_queue.length; idx++) {
            group = group_queue[idx];
            if (isArray(group)) {
                log('**********************');
                for (var i=0; i<group.length; i++) {
                    log('url:     '+group[i].url);
                    log('start:   '+group[i].start);
                    log('finished:'+group[i].finished);
                    log('-------------------');
                }
                log('isAllStart: ' + isAllStart(group));
                log('isAnyStart: ' + isAnyStart(group));
                log('isAllFinished: ' + isAllFinished(group));
                log('isAnyFinished: ' + isAnyFinished(group));
                log('**********************');
            }
        }
    };

    var nextGroup = function() {
        while (group_queue.length > 0) {
            showGroupInfo();
            // is Func
            if (isFunc(group_queue[0])) {
                log('## nextGroup: exec func');
                group_queue[0]();  // exec
                group_queue.shift();
                continue;
            // is Array
            } else if (isAllFinished(group_queue[0])) {   
                log('## current group all finished');
                group_queue.shift();
                continue;
            } else if (!isAnyStart(group_queue[0])) {
                log('## current group no one start!');
                loadGroup();
                break;
            } else {
                break;
            }
        }
    };

    var loadError = function(oError) {
        console.error("The script " + oError.target.src + " is not accessible.");
    };

    var loadScript = function(url_item) {
        log("load "+url_item.url);
        url = url_item.url;
        url_item.start = true;
        var script = document.createElement('script');
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                    script.onreadystatechange = null;
                    url_item.finished = true;
                    loadFinished();
                }
            };
        } else {  //Others
            script.onload = function(){
                url_item.finished = true;
                loadFinished();
            };
        }

        script.onerror = loadError;

        script.src = url+'?'+'time='+Date.parse(new Date());
        document.body.appendChild(script);
    };

    var loadGroup = function() {
        for (var idx=0; idx < group_queue[0].length; idx++) {
            loadScript(group_queue[0][idx]);
        }
    };

    var addGroup = function(url_array) {
        log('add :' + url_array);
        if (url_array.length > 0) {
            group = [];
            for (var idx=0; idx<url_array.length; idx++) {
                url_item = {
                    url: url_array[idx],
                    start: false,
                    finished: false,
                };
                group.push(url_item);
            }
            group_queue.push(group);
        }
        nextGroup();
    };

    var addFunc = function(callback) {
        callback && isFunc(callback) &&  group_queue.push(callback);
        log(group_queue);
        nextGroup();
    };

    var instanceAPI = {
        load : function() {
            addGroup([].slice.call(arguments));
            return instanceAPI;
        },

        wait : function(callback) {
            addFunc(callback);
            return instanceAPI;
        }
    };

    return instanceAPI;

})();  // end Loader
