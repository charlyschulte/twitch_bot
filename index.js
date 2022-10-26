const {startClient} = require("./src/twitchTmi");
const {getTwitchFollower} = require("./src/twitchApi");
getTwitchFollower();
const {} = require('./src/twitchWs');
const { runApi } = require("./src/server");
startClient();
runApi();