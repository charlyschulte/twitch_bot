const axios = require("axios");
const tmi = require("tmi.js");
const parsedJSON = require("../settings.json");
const { checktimeout } = require("./timeouts");
const testing = require("./twitchTmi");
const genericapi = axios.create({
  timeout:1000
})
const twitchApi = axios.create({
  baseURL: parsedJSON.haurl,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});
let client;
function twitchResponse(message, username) {
  client.say(parsedJSON.channel, message.replace("USERNAME", username));
}
function startClient() {
  client = new tmi.Client({
    options: { debug: false },
    identity: {
      username: parsedJSON.botname,
      password: parsedJSON.onetimepassword,
    },
    channels: [parsedJSON.channel],
  });
  client.connect().catch(console.error);
}
startClient();
twitchApi.defaults.headers.common["Authorization"] =
  "Bearer " + parsedJSON.hatoken;
function callHomeAssistantScene(scene) {
  console.log("Running HA Trigger");
  console.log(scene);
  twitchApi
    .post("/api/services/scene/turn_on", {
      entity_id: scene,
    })
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    });
}
function callHomeAssistantScript(script) {
  console.log("Running HA Trigger");
  console.log(script);
  twitchApi
    .post("/api/services/script/turn_on", {
      entity_id: script,
    })
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    });
}
function callapi(url){
  console.log("Calling Api:"+url);
  genericapi.get(url).then((response)=>{}).catch((error)=>console.log(error));
}
function triggerCommands(command, username) {
  var found = parsedJSON.commands.find((element) => element.command == command);
  var foundIndex = parsedJSON.commands.findIndex(
    (element) => element.command == command
  );
  if (!found) return;
  trigger(found, foundIndex, username);
}
function triggerActions(action, username) {
  var found = parsedJSON.actions.find((element) => element.action == action);
  var foundIndex = parsedJSON.actions.findIndex(
    (element) => element.action == action
  );
  if (!found) return;
  console.log("GOT Trigger"+foundIndex);
  trigger(found, foundIndex, username);
}
function trigger(found, foundIndex, username) {
  checktimeout(found, foundIndex, username,twitchResponse);
  if (found.type === "hascene") {
    if (found.answer !== undefined) {
      twitchResponse(found.answer, username);
    }
    callHomeAssistantScene(found.trigger);
  }
  if (found.type == "hascript") {
    if (found.answer !== undefined) {
      twitchResponse(found.answer, username);
    }
    callHomeAssistantScript(found.trigger);
  }
  if(found.type =="callapi"){
    if(found.answer!==undefined){
      twitchResponse(found.answer,username);
    }
    callapi(found.trigger);
  }
}
exports.triggerCommands = triggerCommands;
exports.triggerActions = triggerActions;