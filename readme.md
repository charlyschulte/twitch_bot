
# Twitch Chat, Follower and Reward bot

An easy to use, open source twitch bot that can be triggered by chat commands,
Follows and Rewards.
It can directly trigger Home Assistant Scenes and Scripts and also call api endpoints for things like companion.
written in Nodejs

## Features

- Trigger Home Assistant Scripts
- Trigger Home Assistant Scenes
- Trigger Api´s
- Cross platform



## Install
1) Install nodejs

2) generate oauth token here: //https://twitchapps.com/tmi/

3) create dev account twitch https://dev.twitch.tv/

4) create access token https://twitchapps.com/tokengen/
with scopes: channel:manage:redemptions user:edit:follows channel:read:redemptions channel:read:subscriptions

5) Clone the project

```bash
  git clone https://github.com/charlyschulte/twitch_bot
```

6) Go to the project directory

```bash
  cd twitch_bot
```
7) fill informations : settings.json
8) run: 
```bash
node runupdate.json
```
9) view rewards.json and fill ids in settings

10) Install dependencies

```bash
  npm install
```

11) Start the server

```bash
  npm run start
```

