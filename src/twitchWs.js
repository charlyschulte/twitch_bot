let WebSocket = require("ws");
const parsedJSON = require("../settings.json");
const { triggerActions } = require("./apicaller");

const wss = new WebSocket("wss://pubsub-edge.twitch.tv");
wss.on("open", function open() {
  console.log("OPENED");
  // channel:read:subscriptions channel:read:redemptions
  wss.send(
    JSON.stringify({
      type: "LISTEN",
      data: {
        topics: parsedJSON.websocketsTopics,
        auth_token: parsedJSON.accessToken,
      },
    })
  );
});
wss.on("error", (error) => {
  console.log(error);
});
wss.on("message", function message(data) {
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
