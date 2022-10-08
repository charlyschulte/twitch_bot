This is a simple nodejs script for twitch
it can be called via chat or trigger actions when a new follower or subscription is added.

you can directly call apis or home assistant scenes / scripts

1) generate oauth token here:
//https://twitchapps.com/tmi/


2) create dev account twitch

3) create access token
https://twitchapps.com/tokengen/

with scopes:
channel:manage:redemptions user:edit:follows channel:read:redemptions channel:read:subscriptions

4) fill informations : settings.json

5) run: "node runupdate.json"

6) view rewards.json and fill ids in settings
 
7) Run "npm i"

8) run "npm run start"

