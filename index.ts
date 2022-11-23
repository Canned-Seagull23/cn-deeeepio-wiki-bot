const bot = require('nodemw');

// pass configuration object
const client = new bot("config.js");

client.getArticle('小丑鱼', (err: Error, data: any) => {
    // error handling
    if (err) {
        console.error(err);
        return;
    }

    console.log(data);
});