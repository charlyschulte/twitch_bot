
const got = require('got');
const fs = require('fs');
var parsedJSON = require('../settings.json');
const { triggerActions } = require('./apicaller');
const accessToken = parsedJSON.accessToken;

let clientId = ""
let userId = ""
let lastFollowers=null;
const getCustomRewards = async () => {
    try {
        let { body } = await got(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${userId}`, { headers: headers })
        return JSON.parse(body).data
    } catch (error) {
        console.log(error)
        
        return null
    }
}

async function getTwitchFollower(){
    try {
        await validateToken();
    let { body } =await got(`https://api.twitch.tv/helix/users/follows?to_id=${userId}&first=1`, { headers: headers });
    let followers =  JSON.parse(body).data;
    let lastFollower = followers[0];
    if(lastFollowers!=null && lastFollower.from_id!==lastFollowers){
        triggerActions("follower",lastFollower.from_name);
    }
    lastFollowers=lastFollower.from_id;
    setTimeout(getTwitchFollower, 15000);
    return;
    } catch (error) {
        console.log("TWITCH Follower could not be loaded");
        setTimeout(getTwitchFollower, 15000);
        return;
    }
    
}
const validateToken = async () => {
    let r
    try {
        let { body } = await got(`https://id.twitch.tv/oauth2/validate`, {
            headers: {
                "Authorization": `Bearer `+accessToken
            }
        })
        r = JSON.parse(body)
    } catch (error) {
        console.log(error);
        console.log('Invalid token. Please get a new token using twitch token -u -s "channel:manage:redemptions user:edit:follows"')
        return false
    }

    if(r.scopes.indexOf("channel:manage:redemptions") == -1 || r.scopes.indexOf("user:edit:follows") == -1 || !r.hasOwnProperty('user_id')){
        console.log('Invalid scopes. Please get a new token using twitch token -u -s "channel:manage:redemptions user:edit:follows"')
        return false
    }

    // update the global variables to returned values
    clientId = r.client_id
    userId = r.user_id
    headers = {
        "Authorization": `Bearer `+accessToken,
        "Client-ID": clientId,
        "Content-Type": "application/json"
    }

    return true
}
async function updateRewards(){

    await validateToken();
    let rewards = await getCustomRewards();
    let rewardsStripped = [];
    rewards.forEach((item)=>{
        rewardsStripped.push({id:item.id,title:item.title});
    })
    fs.writeFile("rewards.json", JSON.stringify(rewardsStripped), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}
exports.getTwitchFollower = getTwitchFollower;
exports.updateRewards = updateRewards;