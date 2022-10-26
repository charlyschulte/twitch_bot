const express = require("express");
var parsedJSON = require('../settings.json');
const {twitchResponse} = require('./apicaller');
const app = express();
function buildApiEndpoints(){
    parsedJSON.api.forEach((element)=>{
        app.get(element.url,(req,res)=>{
            if(element.type==="message"){
                twitchResponse(element.action.replace("RESPONSE", req.query[element.param]))
                res.send("");
            }
        })
    })
    app.get('/fog', (req, res) => { addFog(); res.send('Fog Added, current Cue: '+getCurrentFogCueCount()) })
}
function runApi() {
    buildApiEndpoints();
  app.listen(parsedJSON.apiport, () => {
    console.log("Server is up!");
  });
}
exports.runApi = runApi;
