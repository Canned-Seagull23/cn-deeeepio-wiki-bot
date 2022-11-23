"use strict";
const bot = require('nodemw');
// pass configuration object
const client = new bot("config.js");
client.getArticle('小丑鱼', (err, data) => {
    // error handling
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});
