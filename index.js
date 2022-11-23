"use strict";
const bot = require('nodemw');
// Create client
const client = new bot("config.json");
client.logIn((err) => {
    if (err)
        console.error(err);
    console.log("Client logged in");
});
client.getArticle("机械人测试", (err, data) => {
    // error handling
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});
