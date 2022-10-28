let WebSocket = require("ws");
const parsedJSON = require("../settings.json");
const { triggerActions } = require("./apicaller");
let address = "wss://pubsub-edge.twitch.tv";
let isActive = true;
let ws;
let started = false;
connect()
function sendAuthentication(){
  ws.send(
    JSON.stringify({
      type: "LISTEN",
      data: {
        topics: parsedJSON.websocketsTopics,
        auth_token: parsedJSON.accessToken,
      },
    })
  );
}
setInterval(()=>{
  if(!started)
    return;
  if(!isActive){
    console.log("RECONNECTING")
    ws.terminate();
    setTimeout(connect, 1000);
    return; 
  }
  ws.send(JSON.stringify({
    "type": "PING"
  }));
  isActive=false;
},10000)
function connect() {
  try {
    ws = new WebSocket(address);
    
  } catch (error) {
    console.log(error);
    console.log("INTERNET Connection disconnected, trying to reconnect in 10 seconds");
    return;
  }
  ws.on('open', () => {
    sendAuthentication();
    started=true;
    isActive=true;
    console.log("REAUTHENTICATED");
    // do your thing here, like ws.send(...);
    
  });
  ws.on("message", function message(data) {
    console.log("Got: " + data);
    if(JSON.parse(data).type==="PONG"){
      isActive=true;
    }
    if(JSON.parse(data).type==="RECONNECT"){
      console.log("GOT RECONNECT");
      sendAuthentication();
    }
    if (JSON.parse(data).data !== undefined) {
      let response = JSON.parse(JSON.parse(data).data.message);
      console.log(data);
      if (response.type == "reward-redeemed") {
        triggerActions(response.data.redemption.reward.id, response.data.redemption.user.display_name);
      }
      if (
        response.type == "MESSAGE" &&
        response.data.topic == "channel-subscribe-events-v1.70396263"
      ) {
      }
    }
  });
  ws.on('error', reason => console.error('Websocket error: ' + reason.toString()));
 
  return ws;
}

