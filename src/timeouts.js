const parsedJSON = require("../settings.json");
let counters = [];
let timeouts = [];
parsedJSON.commands.forEach((element) => {
  counters.push(0);
});
function checktimeout(found,foundIndex,username,callback){
    if(found.timeout===undefined){
        found.timeout=0;
    }
    if(counters[foundIndex]!=0){
        callback(parsedJSON.timeoutmessage.replace("BEFEHL",found.command).replace("SEKUNDEN",counters[foundIndex]),username);
        return false
    }
    if(found.timeout!=0)
    {
        counters[foundIndex]=found.timeout;
        startTimeout(foundIndex);
    }
}
function startTimeout(index) {
  if (counters[index] == 0) return;
  counters[index] = counters[index] - 1;
  setTimeout(startTimeout, 1000, index);
}
exports.startTimeout = startTimeout;
exports.checktimeout = checktimeout;