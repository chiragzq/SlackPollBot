const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
const SlackBot = require("slackbots");
const axios = require("axios");
const http = require('http');

const bot = new SlackBot({
    token: config.token,
    name: config.name
});

bot.on("start", () => {
    console.log("Bot is now running");
});

bot.on("message", async (message) => {
    if(!message.type || message.type != "message" || message.subtype == "bot_message" || message.subtype == "message_deleted") return;
    if(message.text.startsWith("!poll")) {
        console.log(message);
        await api("POST", "reactions.add", {
            token: config.token,
            name: "thumbsup",
            channel: message.channel,
            timestamp: message.ts
        });
        await api("POST", "reactions.add", {
            token: config.token,
            name: "thumbsdown",
            channel: message.channel,
            timestamp: message.ts
        });
        await api("POST", "reactions.add", {
            token: config.token,
            name: "shrug",
            channel: message.channel,
            timestamp: message.ts
        });
        
    }
});

http.createServer((req, res) => {
    res.end("");
}).listen(process.env.PORT || 8000);



/**
 * (Stolen from my slack reaction role bot)
 * Sends a request to the slack API and retrieves the result/error
 * @param {string} method the http request method (e.g. GET, POST)
 * @param {string} endpoint the api method to call (e.g. user.info)
 * @param {object} params the parameters to send to the server. they will automatically be sent as 
 *                        url parameters or in the post body depending on the request type
 */
const api = async (method, endpoint, params) => {
    const url = "https://slack.com/api/" + endpoint;
    if(!params) params = {};
    console.log(endpoint);
    const resp = await axios({
        method: method,
        url: url,
        params: params
    });
    console.log(resp.data);
    return resp.data;
}