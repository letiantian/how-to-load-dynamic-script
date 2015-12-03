console.log('your.js: time='+Date.parse(new Date()));

function myAlert(msg) {
    console.log('alert at ' + Date.parse(new Date()));
    alert(msg);
}

function myLog(msg) {
    console.log(msg);
}