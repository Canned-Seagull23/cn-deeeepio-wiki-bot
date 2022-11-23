const bot = require('nodemw');

// Create client
const client = new bot("config.json");

client.logIn((err: Error) => {
    if (err) console.error(err);
    console.log("Client logged in");
});

client.getArticle("机械人测试", (err: Error, data: any) => {
    // error handling
    if (err) {
        console.error(err);
        return;
    }

    console.log(data);
});