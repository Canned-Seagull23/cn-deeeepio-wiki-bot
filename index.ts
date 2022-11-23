const bot = require('nodemw');

// Create client
const client = new bot("config.json");

function logInPromise() {
    return new Promise((resolve, reject) => {
        client.logIn((err: Error) => {
            if (err) return reject(err);
            resolve("");
        });
    });
}

function getArticlePromise(article: string) {
    return new Promise((resolve, reject) => {
        client.getArticle(article, (err: Error, data: string) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

(async () => {
    await logInPromise()
        .then(() => {
            console.log("Client logged in");
        })
        .catch((err) => {
            console.error(err);
            console.log("Logging in failed");
        });

    await getArticlePromise("机械人测试")
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
})();