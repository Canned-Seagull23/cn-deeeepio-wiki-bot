const bot = require('nodemw');
const https = require('https');

// Create client
const client = new bot("config.json");

// Constants
const CONSTANTS = {
    API_URL: "apibeta.deeeep.io",
    CROWDL_API_URL: "api.crowdl.io"
};

// Data
let translations: any = {};
let animals: any = {};


// WikiText 

function wtTableToHtml(table: string): any {

}

function wtHtmlToTable(table: any): string {
    return '';
}


// Promises

function fetch(host: string, path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        https.request({
            host,
            path
        }, (res: any) => {
            var str = '';
            res.on('data', (c: string) => {
                str += c;
            });
            res.on('end', () => { resolve(str) });
        }).end();

    });
}

function logInPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
        client.logIn((err: Error) => {
            if (err) return reject(err);
            resolve("");
        });
    });
}

function getArticlePromise(article: string): Promise<any> {
    return new Promise((resolve, reject) => {
        client.getArticle(article, (err: Error, data: string) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

function editArticlePromise(title: string, content: string, summary: string, minor: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
        client.edit(title, content, summary, minor, (err: Error, res: any) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

function appendArticlePromise(title: string, content: string, summary: string): Promise<any> {
    return new Promise((resolve, reject) => {
        client.append(title, content, summary, (err: Error, res: any) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

(async () => {
    await fetch(CONSTANTS.API_URL, "/animals")
        .then((data: string) => {
            animals = JSON.parse(data);
        });
    await fetch(CONSTANTS.CROWDL_API_URL, "/deeeep/cdn/zh.json")
        .then((data: string) => {
            translations = JSON.parse(data);
        });;
        
    await logInPromise()
        .then(() => {
            console.log("Client logged in");
        })
        .catch((err) => {
            console.error(err);
            console.log("Logging in failed");
        });

    // Get all animal articles

    for (let i in Object.keys(animals)) {
        const animalId = animals[i];
        const animalName = translations[animalId.name + "-name"];
        if (animalName === undefined) continue;
        console.log(animalName)
        await getArticlePromise(animalName)
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error(err);
                console.log("Error fetching page " + animalName);
            });
    }

    let d = await getArticlePromise("机械人测试");
    console.log(d)

    /*
        await appendArticlePromise("机械人测试", "== TEST ==", "Test")
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            });*/
})();