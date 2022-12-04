const bot = require('nodemw');
const https = require('https');

// Create client
const client = new bot("config.json");

// Constants
const CONSTANTS = {
    API_URL: "apibeta.deeeep.io",
    CROWDL_API_URL: "api.crowdl.io"
};
const CDWB_TAGS = {
    skintable: {
        all: {
            start: "skintable/all/start",
            end: "skintable/all/end"
        },
        realistic: {
            start: "skintable/realistic/start",
            end: "skintable/realistic/end"
        },
        seasonal: {
            start: "skintable/seasonal/start",
            end: "skintable/seasonal/end"
        },
        unrealistic: {
            start: "skintable/unrealistic/start",
            end: "skintable/unrealistic/end"
        },
        table: {
            end: "skintable/table/end"
        }
    }
};

// Data
let translations: any = {};
let animals: any = {};

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
    /*
        for (let i in Object.keys(animals)) {
            const animalId = animals[i];
            const animalName = translations[animalId.name + "-name"];
            if (animalName === undefined) continue;
            console.log(animalName)
            const data = await getArticlePromise(animalName)
                .catch(err => {
                    console.error(err);
                    console.log("Error fetching page " + animalName);
                });
            if (data === undefined) continue;
            console.log(data);
            const lines = data.split('\n')
                let tags = [];
    for (let i in lines) {
        if (lines[i].startsWith("<!--@cdwb/")) {
            tags.push({
                line: i,
                tag: lines[i].slice(10, -3)
            });
        };
    }
        }*/

    const animalId = 0;
    let skins: Array<any> = [];
    let realisticSkins: Array<any> = [];
    let seasonalSkins: Array<any> = [];
    let unrealisticSkins: Array<any> = [];

    await fetch(CONSTANTS.API_URL, "/skins?cat=all&animalId=" + animalId)
    .then((data: string) => {
        skins = JSON.parse(data);
    }).catch(e => {
        console.error(e);
        console.log("Error loading skins");
    });

    realisticSkins = skins.filter(skin => skin!.category == "real");
    seasonalSkins = skins.filter(skin => skin!.category == "season");
    unrealisticSkins = skins.filter(skin => skin!.category == "unrealistic");

    console.log(realisticSkins)
    console.log(seasonalSkins)
    console.log(unrealisticSkins)
    let d = await getArticlePromise("机械人测试");
    console.log(d);
    const lines = d.split('\n');
    interface cdwbTag {
        line: number;
        tag: string;
    }

    let tags: Array<cdwbTag> = [];
    for (let i in lines) {
        if (lines[i].startsWith("<!--@cdwb/")) {
            tags.push({
                line: Number(i),
                tag: lines[i].slice(10, -3)
            });
        };
    }
    console.log(tags);
    if (tags.filter(tag => tag.tag == CDWB_TAGS.skintable.all.start).length != 0) {
        console.log('x');
        const startln = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.all.start)[0]!.line;
        const endln = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.all.end)[0]!.line;
        const table = lines.slice(startln + 1, endln - 1);

        const realisticStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.realistic.start)[0]!.line;
        const realisticEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.realistic.end)[0]!.line;
        const realisticSection = lines.slice(realisticStartLn + 1, realisticEndLn - 1);

        let realisticSkinEntries: Array<any> = [];
        let realisticRow: Array<any> = [];
        for (let i in realisticSection) {
            if (realisticSection[i] == "|-" || realisticSection[i] == "<!--@cdwb/" + CDWB_TAGS.skintable.table.end + "-->") {
                realisticSkinEntries.push(realisticRow);
                realisticRow = [];
                continue;
            } else {
                realisticRow.push(realisticSection[i]);
            };
        }


        const seasonalStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.seasonal.start)[0]!.line;
        const seasonalEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.seasonal.end)[0]!.line;
        const seasonalSection = lines.slice(seasonalStartLn + 1, seasonalEndLn - 1);

        let seasonalSkinEntries: Array<any> = [];
        let seasonalRow: Array<any> = [];
        for (let i in seasonalSection) {
            if (seasonalSection[i] == "|-" || seasonalSection[i] == "<!--@cdwb/" + CDWB_TAGS.skintable.table.end + "-->") {
                seasonalSkinEntries.push(seasonalRow);
                seasonalRow = [];
                continue;
            } else {
                seasonalRow.push(seasonalSection[i]);
            };
        }

        const unrealisticStartLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.unrealistic.start)[0]!.line;
        const unrealisticEndLn = tags.filter(tag => tag.tag == CDWB_TAGS.skintable.unrealistic.end)[0]!.line;
        const unrealisticSection = lines.slice(unrealisticStartLn + 1, unrealisticEndLn - 1);
        
        let unrealisticSkinEntries: Array<any> = [];
        let unrealisticRow: Array<any> = [];
        for (let i in unrealisticSection) {
            if (unrealisticSection[i] == "|-" || unrealisticSection[i] == "<!--@cdwb/" + CDWB_TAGS.skintable.table.end + "-->") {
                unrealisticSkinEntries.push(unrealisticRow);
                unrealisticRow = [];
                continue;
            } else {
                unrealisticRow.push(unrealisticSection[i]);
            };
        }
    }

    /*
        await appendArticlePromise("机械人测试", "== TEST ==", "Test")
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            });*/
})();