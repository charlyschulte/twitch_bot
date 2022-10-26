let WebSocket = require("ws");
const parsedJSON = require("../settings.json");
const { triggerActions } = require("./apicaller");
var timeout = 10; // seconds
let address = "wss://pubsub-edge.twitch.tv";
var timeout = 10; // seconds
connect(address);
function connect(address) {
    let ws = new WebSocket(address);
    let timerTimeout = setTimeout(() => ws.terminate(), timeout * 1000); // force close unless cleared on 'open'
    ws.on('open', () => {
        console.log('Opened. Clearing timeout ...');
        clearTimeout(timerTimeout);
        ws.send(
          JSON.stringify({
            type: "LISTEN",
            data: {
              topics: parsedJSON.websocketsTopics,
              auth_token: parsedJSON.accessToken,
            },
          })
        );
        // do your thing here, like ws.send(...);
    });
    ws.on("message", function message(data) {
      console.log("Got: "+data);
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
    ws.on('close', () => {
        clearTimeout(timerTimeout);
        console.error('Websocket connection closed. Reconnecting in %f seconds ...', timeout);
        setTimeout(() => connect(address), timeout * 1000);
    });
    ws.on('error', reason => console.error('Websocket error: ' + reason.toString()));
    return ws;
}

