const tmi = require("tmi.js");
const { triggerCommands } = require("./apicaller");
const { checktimeout } = require("./timeouts");
const parsedJSON = require("../settings.json");

function startClient() {
  const client = new tmi.Client({
    options: { debug: true },
    identity: {
      username: parsedJSON.botname,
      password: parsedJSON.onetimepassword,
    },
    channels: [parsedJSON.channel],
  });
  client.connect().catch(console.error);
  client.on("message", (channel, tags, message, self) => {
    if (self) return;
    triggerCommands(message.toLowerCase(), tags.username);
  });
}
exports.startClient = startClient;
